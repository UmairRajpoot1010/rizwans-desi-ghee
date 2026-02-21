const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')

// Simple disk storage for uploads (uploads/)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'))
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, `${unique}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
})

// Middleware
const { protect } = require('../middlewares/auth.middleware')
const { validateOrder } = require('../middlewares/validation.middleware')

// Controllers
const {
  createOrder,
  getMyOrders,
  getOrderById,
} = require('../controllers/order.controller')

/**
 * Order Routes (User)
 * Base path: /api/orders
 * All routes require user authentication
 * Note: Admin order routes are in /api/admin/orders
 */

// Accept multipart for optional payment screenshot
// Parse JSON payloads sent as form fields (when using multipart/form-data)
const parseJsonFormFields = (req, res, next) => {
  try {
    if (req.body.items && typeof req.body.items === 'string') {
      req.body.items = JSON.parse(req.body.items)
    }
    if (req.body.shippingAddress && typeof req.body.shippingAddress === 'string') {
      req.body.shippingAddress = JSON.parse(req.body.shippingAddress)
    }
  } catch (err) {
    // ignore parse errors; validation will catch malformed payload
  }
  next()
}

router.post('/', protect, upload.single('paymentScreenshot'), parseJsonFormFields, validateOrder, createOrder)
router.get('/my', protect, getMyOrders)
router.get('/:id', protect, getOrderById)

module.exports = router
