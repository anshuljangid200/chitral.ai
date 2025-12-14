import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// Lazy database connection - only connect when needed (for serverless)
let dbConnected = false;
let dbConnectionError = null;

const ensureDBConnection = async () => {
  if (!dbConnected && !dbConnectionError) {
    try {
      await connectDB();
      dbConnected = true;
      dbConnectionError = null;
      console.log('Database connection established');
    } catch (error) {
      console.error('Database connection error:', error.message);
      dbConnectionError = error;
      dbConnected = false;
      throw error; // Re-throw to let route handlers handle it
    }
  } else if (dbConnectionError) {
    throw dbConnectionError; // Re-throw existing error
  }
};

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || process.env.VERCEL_URL || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to ensure DB connection before handling requests
// Skip DB connection for health check
app.use(async (req, res, next) => {
  if (req.path !== '/api/health') {
    await ensureDBConnection();
  }
  next();
});

// Routes - Vercel routes /api/* to this function, so paths include /api
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Event Ticketing API Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      events: '/api/events',
      registrations: '/api/registrations'
    },
    timestamp: new Date().toISOString(),
  });
});

// Health check (doesn't require DB connection)
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Export app for Vercel serverless functions
// Only start server if not in Vercel environment
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

export default app;

