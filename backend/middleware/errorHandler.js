export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // CRITICAL: Always log errors with context for Vercel Function Logs
  const timestamp = new Date().toISOString();
  const reqInfo = `${req.method} ${req.originalUrl}`;
  
  console.error(`[${timestamp}] ERROR on ${reqInfo}:`, {
    name: err.name,
    message: err.message,
    code: err.code,
    statusCode: error.statusCode || 500,
  });
  
  if (process.env.NODE_ENV === 'development' || process.env.VERCEL) {
    console.error('Stack:', err.stack);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const message = `Duplicate entry. ${field} already exists.`;
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // MongoDB connection errors
  if (err.message && err.message.includes('MONGO_URI')) {
    const message = 'Database configuration error. Please check MONGO_URI environment variable.';
    error = { message, statusCode: 500 };
  }

  if (err.name === 'MongoServerError' || err.name === 'MongooseError' || err.message?.includes('buffering timed out')) {
    const message = 'Database connection failed. Please check your MongoDB connection string and network.';
    error = { message, statusCode: 503 };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, statusCode: 401 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

