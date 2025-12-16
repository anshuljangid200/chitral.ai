// Vercel serverless function entry point
import serverless from 'serverless-http';
import app from '../backend/server.js';

// Set Vercel environment flag
process.env.VERCEL = '1';

// Wrap Express app as a serverless handler
const handler = serverless(app);

// Export for Vercel
export default handler;

