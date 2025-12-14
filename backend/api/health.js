// Simple health check endpoint that doesn't require DB
export default async (req, res) => {
  return res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
};

