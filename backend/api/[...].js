// Catch-all route handler for Vercel
// This file name uses Vercel's dynamic routing pattern
import app from '../server.js';

export default (req, res) => {
  return app(req, res);
};

