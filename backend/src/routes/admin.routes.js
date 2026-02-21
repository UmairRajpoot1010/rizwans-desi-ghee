const express = require('express')
const router = express.Router()

// Middleware
const { protectAdmin } = require('../middlewares/auth.middleware')
const { authRateLimiter } = require('../middlewares/rateLimit.middleware')
const {
  validateProduct,
  validateProductUpdate,
  validateOrderStatus,
  validateAdminLogin,
} = require('../middlewares/validation.middleware')

// Controllers
const {
  adminLogin,
  getCurrentAdmin,
  getStats,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getAllUsers,
  updateUser,
  deleteUser,
} = require('../controllers/admin.controller')

/**
 * Admin Routes
 * Base path: /api/admin
 * Most routes require admin authentication
 */

// ============================================
// Authentication Routes (rate limited)
// ============================================
router.post('/auth/login', authRateLimiter, validateAdminLogin, adminLogin)
router.get('/auth/me', protectAdmin, getCurrentAdmin)

// ============================================
// Dashboard Routes
// ============================================
router.get('/dashboard/stats', protectAdmin, getStats)

// ============================================
// Product Management Routes
// ============================================
router.get('/products', protectAdmin, getAllProducts)
router.post('/products', protectAdmin, validateProduct, createProduct)
router.put('/products/:id', protectAdmin, validateProductUpdate, updateProduct)
router.delete('/products/:id', protectAdmin, deleteProduct)

// ============================================
// Order Management Routes
// ============================================
router.get('/orders', protectAdmin, getAllOrders)
router.put('/orders/:id', protectAdmin, validateOrderStatus, updateOrderStatus)
router.delete('/orders/:id', protectAdmin, deleteOrder)

// ============================================
// User Management Routes
// ============================================
router.get('/users', protectAdmin, getAllUsers)
router.put('/users/:id', protectAdmin, updateUser)
router.delete('/users/:id', protectAdmin, deleteUser)

module.exports = router
