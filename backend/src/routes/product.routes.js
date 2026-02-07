const express = require('express')
const router = express.Router()
const {
  getAllProducts,
  getProductById,
  searchProducts,
} = require('../controllers/product.controller')

router.get('/', getAllProducts)
router.get('/search', searchProducts)
router.get('/:id', getProductById)

module.exports = router
