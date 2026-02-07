const { NODE_ENV } = require('../config/env')

const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message
  error.statusCode = err.statusCode || 500

  // Log error with stack trace in development
  if (NODE_ENV === 'development') {
    console.error('❌ Error:', {
      message: err.message,
      stack: err.stack,
      statusCode: error.statusCode,
    })
  } else {
    // In production, log without stack trace
    console.error('❌ Error:', {
      message: err.message,
      statusCode: error.statusCode,
    })
  }

  // Mongoose bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`
    error = { message, statusCode: 404 }
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field'
    const message = `Duplicate ${field} value entered. Please use another value.`
    error = { message, statusCode: 400 }
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ')
    error = { message, statusCode: 400 }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token. Please login again.'
    error = { message, statusCode: 401 }
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired. Please login again.'
    error = { message, statusCode: 401 }
  }

  // Express validator errors
  if (err.name === 'ValidationError' && Array.isArray(err.errors)) {
    const message = err.errors.map((e) => e.msg).join(', ')
    error = { message, statusCode: 400 }
  }

  // CORS errors
  if (err.message && err.message.includes('CORS')) {
    error = { message: 'Not allowed by CORS policy', statusCode: 403 }
  }

  // Send error response
  res.status(error.statusCode).json({
    success: false,
    message: error.message || 'Internal Server Error',
    ...(NODE_ENV === 'development' && { stack: err.stack }),
  })
}

module.exports = { errorHandler }
