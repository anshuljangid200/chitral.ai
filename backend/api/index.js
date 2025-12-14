// Vercel serverless function entry point
import app from '../server.js';

// Export handler for Vercel
// This function will be called for all requests
export default async (req, res) => {
  try {
    // Handle the request through Express
    await app(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
};

// (runtime configured in root vercel.json)
