export const notFound = (req, res, next) => {
  // Handle 404 for API routes
  // In Vercel, all /api/* requests come through this handler
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

