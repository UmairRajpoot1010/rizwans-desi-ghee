const express = require('express')
const router = express.Router()

// Middleware
const { protect } = require('../middlewares/auth.middleware')
const { authRateLimiter } = require('../middlewares/rateLimit.middleware')

// Controllers
const { register, login, getMe } = require('../controllers/auth.controller')

/**
 * Authentication Routes
 * Base path: /api/auth
 * Rate limiting applied to login/register to prevent brute-force attacks
 */

// Public routes (rate limited)
router.post('/register', authRateLimiter, register)
router.post('/login', authRateLimiter, login)

// Protected routes (require authentication)
router.get('/me', protect, getMe)

module.exports = router
