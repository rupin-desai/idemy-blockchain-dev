const logger = require('./logger.util');

/**
 * Custom error class
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error handler for async/await functions
 */
const catchAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

/**
 * Global error handling middleware
 */
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error
  logger.error(`${err.statusCode} - ${err.message}`, { 
    url: req.originalUrl,
    method: req.method,
    stack: err.stack 
  });

  // Handle specific errors
  let error = { ...err };
  error.message = err.message;

  // Send error response
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message
    });
  }

  // For programming or other unknown errors, don't leak details
  return res.status(500).json({
    success: false,
    status: 'error',
    message: 'Something went wrong'
  });
};

module.exports = {
  AppError,
  catchAsync,
  globalErrorHandler
};