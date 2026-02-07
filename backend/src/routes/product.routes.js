const express = require('express')
const router = express.Router()
const { protectAdmin } = require('../middlewares/auth.middleware')
const { validateProduct, validateProductUpdate } = require('../middlewares/validation.middleware')
const {
  getAllProducts,
  getProductById,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller')

// Public routes
router.get('/', getAllProducts)
router.get('/search', searchProducts)
router.get('/:id', getProductById)

// Admin protected routes
router.post('/', protectAdmin, validateProduct, createProduct)
router.put('/:id', protectAdmin, validateProductUpdate, updateProduct)
router.delete('/:id', protectAdmin, deleteProduct)

module.exports = router
