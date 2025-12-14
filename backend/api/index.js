// Vercel serverless function entry point
import app from '../server.js';

// Export as Vercel serverless function handler
// This handles all routes through Express
export default (req, res) => {
  return app(req, res);
};

