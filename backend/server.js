const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const problemRoutes = require('./routes/problems');

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to The Intelligent Visual Judge API 🧑‍⚖️' });
});

app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
