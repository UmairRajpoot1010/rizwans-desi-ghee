const rateLimit = require('express-rate-limit')
const { NODE_ENV } = require('../config/env')

/**
 * Rate limiter for authentication routes (login, register)
 * Prevents brute-force attacks on auth endpoints
 */
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: NODE_ENV === 'production' ? 10 : 100, // 10 attempts per window in prod, 100 in dev
  message: {
    success: false,
    message: 'Too many attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
})

module.exports = { authRateLimiter }
