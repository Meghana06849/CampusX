export const errorHandler = (err, req, res, next) => {
  let message = err.message;
  let status = err.statusCode || 500;

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    message = `Duplicate field value '${Object.keys(err.keyValue)[0]}' entered`;
    status = 400;
  }

  // Handle Mongoose validation error
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    status = 400;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token';
    status = 401;
  }

  if (err.name === 'TokenExpiredError') {
    message = 'Token expired';
    status = 401;
  }

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
