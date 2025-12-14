export const notFound = (req, res, next) => {
  // Only handle 404 for API routes, let Vercel handle others
  if (req.path.startsWith('/api')) {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
  } else {
    // For non-API routes, return 404 directly
    res.status(404).json({
      success: false,
      message: `Route not found: ${req.originalUrl}`,
    });
  }
};

