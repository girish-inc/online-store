// Not found error handler
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  // Log error details
  console.error('Error occurred:');
  console.error('Message:', err.message);
  console.error('Stack:', err.stack);
  console.error('Request URL:', req.originalUrl);
  console.error('Request Method:', req.method);
  console.error('User:', req.user ? req.user._id : 'Not authenticated');
  console.error('Timestamp:', new Date().toISOString());
  console.error('---');

  // Determine status code
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Handle specific error types
  if (err.name === 'CastError') {
    statusCode = 400;
    err.message = 'Invalid ID format';
  }
  
  if (err.name === 'ValidationError') {
    statusCode = 400;
    err.message = Object.values(err.errors).map(val => val.message).join(', ');
  }
  
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    err.message = `${field} already exists`;
  }

  // Prepare response
  const errorResponse = {
    success: false,
    status: statusCode,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      error: err,
      requestUrl: req.originalUrl,
      requestMethod: req.method,
      timestamp: new Date().toISOString()
    })
  };

  res.status(statusCode).json(errorResponse);
};

// Async error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { notFound, errorHandler, asyncHandler };