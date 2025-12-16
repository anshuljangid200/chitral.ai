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

// Validate required environment variables at startup
const validateEnv = () => {
  const required = ['MONGO_URI', 'JWT_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    const error = `CRITICAL: Missing environment variables: ${missing.join(', ')}`;
    console.error(`\n❌ ${error}\n`);
    throw new Error(error);
  }
  console.log('✓ All required environment variables loaded');
};

try {
  validateEnv();
} catch (error) {
  console.error('Startup validation failed:', error.message);
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    process.exit(1);
  }
}

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
// CRITICAL: Must wrap async properly to catch errors in serverless
app.use((req, res, next) => {
  if (req.path === '/api/health' || req.path === '/health' || req.path === '/') {
    return next();
  }
  
  ensureDBConnection()
    .then(() => next())
    .catch((err) => {
      console.error('[DB Connection Error]', err.message);
      next(err);
    });
});

// Routes
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

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

// Global error handlers for serverless
process.on('unhandledRejection', (reason, promise) => {
  console.error('[Unhandled Rejection]', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[Uncaught Exception]', error);
});

// Export app for Vercel serverless functions
// Only start server if not in Vercel environment
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

export default app;

