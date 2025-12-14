// Vercel serverless function entry point
import app from '../backend/server.js';

// Export handler for Vercel
// This function will be called for all /api/* requests
export default async (req, res) => {
  // Set Vercel environment flag
  process.env.VERCEL = '1';
  
  try {
    // Handle the request through Express
    return app(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
};

