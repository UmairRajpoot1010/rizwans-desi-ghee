const express = require('express')
const router = express.Router()

// Middleware
const { protectAdmin } = require('../middlewares/auth.middleware')
const { validateProduct, validateProductUpdate } = require('../middlewares/validation.middleware')

// Controllers
const {
  getAllProducts,
  getProductById,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller')

/**
 * Product Routes
 * Base path: /api/products
 */

// Public routes (no authentication required)
router.get('/', getAllProducts)
router.get('/search', searchProducts) // Must come before /:id to avoid route conflicts
router.get('/:id', getProductById)

// Admin-only routes (require admin authentication)
router.post('/', protectAdmin, validateProduct, createProduct)
router.put('/:id', protectAdmin, validateProductUpdate, updateProduct)
router.delete('/:id', protectAdmin, deleteProduct)

module.exports = router
