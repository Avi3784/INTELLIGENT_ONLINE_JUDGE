const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const winston = require('winston');
const connectDB = require('./config/db');
const { createWorker } = require('./queue');

const authRoutes = require('./routes/auth');
const problemRoutes = require('./routes/problems');
const submissionRoutes = require('./routes/submissions');
const aiRoutes = require('./routes/ai');
const userRoutes = require('./routes/users');
const solutionRoutes = require('./routes/solutions');
const oauthRoutes = require('./routes/oauth');
const adminRoutes = require('./routes/admin');
const passport = require('passport');
require('./config/passport');

const app = express();
const server = http.createServer(app);
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const io = new Server(server, {
  cors: {
    origin: frontendUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

const chatHandler = require('./sockets/chatHandler');
chatHandler(io);

const arenaHandler = require('./sockets/arenaHandler');
arenaHandler(io);

// 1. Logger setup (Winston)
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ],
});
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// 2. Security HTTP Headers (Helmet)
app.use(helmet());

// 3. API Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', apiLimiter);

app.use(express.json({ limit: '5mb' }));

app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  })
);

app.use(session({
  secret: process.env.JWT_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to The Intelligent Visual Judge API 🧑‍⚖️' });
});

app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/users', userRoutes);
app.use('/api/solutions', solutionRoutes);
app.use('/api/oauth', oauthRoutes);
app.use('/api/admin', adminRoutes);

app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.stack}`);

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);

    // Start the worker in the same process to avoid needing a separate paid Render Worker instance
    console.log('Starting background worker...');
    createWorker();
  });
});
