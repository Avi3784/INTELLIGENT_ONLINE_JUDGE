require('dotenv').config();
const connectDB = require('./config/db');
const { createWorker } = require('./queue');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

async function startWorker() {
  logger.info('Connecting to Database...');
  await connectDB();
  logger.info('Database connected. Starting BullMQ Worker...');
  
  createWorker();
  logger.info('Worker is running and listening for jobs...');
}

startWorker().catch(err => {
  logger.error('Worker failed to start:', err);
});
