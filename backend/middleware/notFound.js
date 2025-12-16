export const notFound = (req, res, next) => {
  // Handle 404 for API routes
  // Return proper JSON error instead of passing to error handler
  res.status(404).json({
    success: false,
    message: `Not Found - ${req.method} ${req.originalUrl}`,
    statusCode: 404,
  });
};

