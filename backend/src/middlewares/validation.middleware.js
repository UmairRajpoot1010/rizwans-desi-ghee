const { body, param, validationResult } = require('express-validator')

/**
 * Middleware to handle validation errors
 * Returns consistent JSON error responses with meaningful messages
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    // Log validation errors and body for debugging in production
    console.error('⚠️ Validation Failed:', {
      path: req.path,
      method: req.method,
      contentType: req.headers['content-type'],
      errors: errors.array().map(e => ({ path: e.path, msg: e.msg })),
      body: req.body
    })

    // API contract format: { success: false, message: "Error message" }
    const uniqueMessages = [...new Set(errors.array().map((e) => e.msg))]
    const errorMessages = uniqueMessages.join(', ')
    return res.status(400).json({
      success: false,
      message: errorMessages || 'Validation failed',
    })
  }

  next()
}

/**
 * Validate MongoDB ObjectId parameter
 */
const validateObjectId = (paramName = 'id') => {
  return param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName}. Must be a valid MongoDB ObjectId`)
}

// Product validation rules
const validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Product name must be between 1 and 200 characters')
    .escape(), // Sanitize to prevent XSS
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ min: 10 })
    .withMessage('Product description must be at least 10 characters')
    .escape(),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number')
    .toFloat(),
  // Image strategy v1.0: Accept image URLs as strings. TODO: Integrate Cloudinary/S3 for uploads.
  body('images')
    .isArray({ min: 1 })
    .withMessage('At least one product image is required')
    .custom((images) => {
      if (!Array.isArray(images) || images.length === 0) {
        throw new Error('At least one product image is required')
      }
      images.forEach((image, index) => {
        if (typeof image !== 'string' || image.trim().length === 0) {
          throw new Error(`Image ${index + 1} must be a valid URL string`)
        }
      })
      return true
    }),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Product category is required')
    .isLength({ max: 100 })
    .withMessage('Category cannot exceed 100 characters')
    .escape(),
  body('stock')
    .optional({ checkFalsy: false })
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer')
    .toInt(),
  body('isActive')
    .optional({ checkFalsy: false })
    .isBoolean()
    .withMessage('isActive must be a boolean')
    .toBoolean(),
  handleValidationErrors,
]

// Product update validation (all fields optional)
const validateProductUpdate = [
  body('name')
    .optional({ checkFalsy: false })
    .trim()
    .notEmpty()
    .withMessage('Product name cannot be empty')
    .isLength({ min: 1, max: 200 })
    .withMessage('Product name must be between 1 and 200 characters')
    .escape(),
  body('description')
    .optional({ checkFalsy: false })
    .trim()
    .notEmpty()
    .withMessage('Product description cannot be empty')
    .isLength({ min: 10 })
    .withMessage('Product description must be at least 10 characters')
    .escape(),
  body('price')
    .optional({ checkFalsy: false })
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number')
    .toFloat(),
  body('images')
    .optional({ checkFalsy: false })
    .isArray({ min: 1 })
    .withMessage('At least one product image is required')
    .custom((images) => {
      if (images && (!Array.isArray(images) || images.length === 0)) {
        throw new Error('At least one product image is required')
      }
      if (images) {
        images.forEach((image, index) => {
          if (typeof image !== 'string' || image.trim().length === 0) {
            throw new Error(`Image ${index + 1} must be a valid URL string`)
          }
        })
      }
      return true
    }),
  body('category')
    .optional({ checkFalsy: false })
    .trim()
    .notEmpty()
    .withMessage('Product category cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Category cannot exceed 100 characters')
    .escape(),
  body('stock')
    .optional({ checkFalsy: false })
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer')
    .toInt(),
  body('isActive')
    .optional({ checkFalsy: false })
    .isBoolean()
    .withMessage('isActive must be a boolean')
    .toBoolean(),
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
        if (typeof item.product !== 'string' || item.product.trim().length === 0) {
          throw new Error(`Item ${index + 1}: Product ID must be a valid string`)
        }
        if (!item.quantity || item.quantity < 1) {
          throw new Error(`Item ${index + 1}: Quantity must be at least 1`)
        }
        if (!Number.isInteger(Number(item.quantity))) {
          throw new Error(`Item ${index + 1}: Quantity must be an integer`)
        }
      })
      return true
    }),
  // Resilient validation for shipping address fields
  body('shippingAddress').notEmpty().withMessage('Shipping address information is required'),
  body('shippingAddress.name')
    .trim()
    .notEmpty()
    .withMessage('Shipping name is required')
    .isLength({ min: 2, max: 100 }),
  body('shippingAddress.email')
    .trim()
    .notEmpty()
    .withMessage('Shipping email is required')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('shippingAddress.phone')
    .trim()
    .notEmpty()
    .withMessage('Shipping phone is required')
    .isLength({ min: 10, max: 15 }),
  body('shippingAddress.address')
    .trim()
    .notEmpty()
    .withMessage('Shipping address is required')
    .isLength({ min: 5, max: 200 }),
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

  // Payment info validation
  body('paymentMethod')
    .optional()
    .isIn(['COD', 'ONLINE', 'cod', 'online'])
    .withMessage('Invalid payment method'),
  body('paymentProof')
    .optional()
    .isString()
    .withMessage('Payment proof must be a valid base64 string'),
  handleValidationErrors,
]

// Order status update validation
const validateOrderStatus = [
  body('status')
    .optional({ checkFalsy: false })
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid status. Must be one of: pending, processing, shipped, delivered, cancelled'),
  body('paymentStatus')
    .optional({ checkFalsy: false })
    .isIn(['pending', 'paid', 'failed'])
    .withMessage('Invalid payment status. Must be one of: pending, paid, failed'),
  body('paymentVerificationStatus')
    .optional({ checkFalsy: false })
    .isIn(['pending', 'verified', 'rejected'])
    .withMessage('Invalid payment verification status. Must be one of: pending, verified, rejected'),
  body()
    .custom((body) => {
      if (!body.status && !body.paymentStatus && !body.paymentVerificationStatus) {
        throw new Error('At least one of status, paymentStatus, or paymentVerificationStatus must be provided')
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
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .isLength({ max: 128 })
    .withMessage('Password cannot exceed 128 characters'),
  handleValidationErrors,
]

module.exports = {
  validateProduct,
  validateProductUpdate,
  validateOrder,
  validateOrderStatus,
  validateAdminLogin,
  validateObjectId,
  handleValidationErrors,
}
