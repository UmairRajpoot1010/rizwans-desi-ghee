const express = require('express')
const router = express.Router()
const { protect } = require('../middlewares/auth.middleware')
const { validateOrder } = require('../middlewares/validation.middleware')
const {
  createOrder,
  getMyOrders,
  getOrderById,
} = require('../controllers/order.controller')

// User routes (protected)
// Note: Admin routes for orders are in /api/admin/orders
router.post('/', protect, validateOrder, createOrder)
router.get('/my', protect, getMyOrders)
router.get('/:id', protect, getOrderById)

module.exports = router
