const express = require('express')
const router = express.Router()
// Middleware
const { protect } = require('../middlewares/auth.middleware')
const { validateOrder } = require('../middlewares/validation.middleware')

// Controllers
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateMyOrderShipping,
  cancelMyOrder,
} = require('../controllers/order.controller')

/**
 * Order Routes (User)
 * Base path: /api/orders
 * All routes require user authentication
 * Note: Admin order routes are in /api/admin/orders
 */

router.post('/', protect, validateOrder, createOrder)
router.get('/my', protect, getMyOrders)
router.get('/:id', protect, getOrderById)
router.put('/:id/shipping', protect, updateMyOrderShipping)
router.put('/:id/cancel', protect, cancelMyOrder)

module.exports = router
