const { body, validationResult } = require('express-validator')

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    })
  }
  next()
}

// Product validation rules
const validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ max: 200 })
    .withMessage('Product name cannot exceed 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Product description is required'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('images')
    .isArray({ min: 1 })
    .withMessage('At least one product image is required')
    .custom((images) => {
      if (!Array.isArray(images) || images.length === 0) {
        throw new Error('At least one product image is required')
      }
      return true
    }),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Product category is required'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  handleValidationErrors,
]

// Product update validation (all fields optional)
const validateProductUpdate = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Product name cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Product name cannot exceed 200 characters'),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Product description cannot be empty'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('images')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one product image is required')
    .custom((images) => {
      if (images && (!Array.isArray(images) || images.length === 0)) {
        throw new Error('At least one product image is required')
      }
      return true
    }),
  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Product category cannot be empty'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  handleValidationErrors,
]

// Order validation rules
const validateOrder = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must have at least one item')
    .custom((items) => {
      if (!Array.isArray(items) || items.length === 0) {
        throw new Error('Order must have at least one item')
      }
      items.forEach((item, index) => {
        if (!item.product) {
          throw new Error(`Item ${index + 1}: Product ID is required`)
        }
        if (!item.quantity || item.quantity < 1) {
          throw new Error(`Item ${index + 1}: Quantity must be at least 1`)
        }
        if (!Number.isInteger(item.quantity)) {
          throw new Error(`Item ${index + 1}: Quantity must be an integer`)
        }
      })
      return true
    }),
  body('shippingAddress.name')
    .trim()
    .notEmpty()
    .withMessage('Shipping name is required'),
  body('shippingAddress.email')
    .trim()
    .notEmpty()
    .withMessage('Shipping email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('shippingAddress.phone')
    .trim()
    .notEmpty()
    .withMessage('Shipping phone is required'),
  body('shippingAddress.address')
    .trim()
    .notEmpty()
    .withMessage('Shipping address is required'),
  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('Shipping city is required'),
  body('shippingAddress.state')
    .trim()
    .notEmpty()
    .withMessage('Shipping state is required'),
  body('shippingAddress.zipCode')
    .trim()
    .notEmpty()
    .withMessage('Shipping zip code is required'),
  handleValidationErrors,
]

// Order status update validation
const validateOrderStatus = [
  body('status')
    .optional()
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid status. Must be one of: pending, processing, shipped, delivered, cancelled'),
  body('paymentStatus')
    .optional()
    .isIn(['pending', 'paid', 'failed'])
    .withMessage('Invalid payment status. Must be one of: pending, paid, failed'),
  body()
    .custom((body) => {
      if (!body.status && !body.paymentStatus) {
        throw new Error('At least one of status or paymentStatus must be provided')
      }
      return true
    }),
  handleValidationErrors,
]

// Admin login validation
const validateAdminLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  handleValidationErrors,
]

module.exports = {
  validateProduct,
  validateProductUpdate,
  validateOrder,
  validateOrderStatus,
  validateAdminLogin,
  handleValidationErrors,
}
