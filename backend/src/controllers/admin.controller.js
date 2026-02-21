const Admin = require('../models/Admin')
const Product = require('../models/Product')
const Order = require('../models/Order')
const User = require('../models/User')
const { generateToken } = require('../utils/generateToken')

/**
 * Helper to send a consistent JSON response.
 * Only includes `data` and `meta` when provided.
 */
const sendResponse = (res, statusCode, { success, message, data, meta }) => {
  const payload = { success, message }
  if (data !== undefined) payload.data = data
  if (meta !== undefined) payload.meta = meta
  return res.status(statusCode).json(payload)
}

// @desc    Admin login
// @route   POST /api/admin/auth/login
// @access  Public
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return sendResponse(res, 400, {
        success: false,
        message: 'Please provide email and password',
      })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Find admin by normalized email
    const admin = await Admin.findByEmail(normalizedEmail)

    if (!admin || admin.role !== 'admin') {
      return sendResponse(res, 401, {
        success: false,
        message: 'Invalid credentials',
      })
    }

    if (!admin.isActive) {
      return sendResponse(res, 403, {
        success: false,
        message: 'Admin account is inactive. Please contact administrator',
      })
    }

    const isMatch = await admin.comparePassword(password)
    if (!isMatch) {
      return sendResponse(res, 401, {
        success: false,
        message: 'Invalid credentials',
      })
    }

    // JWT payload must include id + role=admin
    const token = generateToken(admin._id, 'admin')

    return sendResponse(res, 200, {
      success: true,
      message: 'Login successful',
      data: {
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: 'admin',
          isActive: admin.isActive,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get current admin profile
// @route   GET /api/admin/auth/me
// @access  Private (Admin)
exports.getCurrentAdmin = async (req, res, next) => {
  try {
    const adminId = req.admin?._id || req.admin?.id

    if (!adminId) {
      return sendResponse(res, 401, {
        success: false,
        message: 'Not authenticated as admin',
      })
    }

    const admin = await Admin.findById(adminId).select('-password')

    if (!admin) {
      return sendResponse(res, 404, {
        success: false,
        message: 'Admin not found',
      })
    }

    return sendResponse(res, 200, {
      success: true,
      message: 'Admin profile fetched successfully',
      data: admin,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard/stats
// @access  Private (Admin)
exports.getStats = async (req, res, next) => {
  try {
    const [totalOrders, totalProducts, totalUsers, revenueAgg] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ])

    const totalRevenue = Number(revenueAgg[0]?.total || 0)

    return sendResponse(res, 200, {
      success: true,
      message: 'Dashboard stats fetched successfully',
      data: {
        totalOrders: Number(totalOrders) || 0,
        totalProducts: Number(totalProducts) || 0,
        totalUsers: Number(totalUsers) || 0,
        totalRevenue,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all products (Admin)
// @route   GET /api/admin/products
// @access  Private (Admin)
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 })

    return sendResponse(res, 200, {
      success: true,
      message: 'Products fetched successfully',
      data: products,
      meta: {
        count: products.length,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create product
// @route   POST /api/admin/products
// @access  Private (Admin)
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, images, category, stock } = req.body

    if (!name || price === undefined) {
      return sendResponse(res, 400, {
        success: false,
        message: 'Product name and price are required',
      })
    }

    const product = await Product.create({
      name,
      description,
      price,
      images,
      category,
      stock,
    })

    return sendResponse(res, 201, {
      success: true,
      message: 'Product created successfully',
      data: product,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private (Admin)
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!product) {
      return sendResponse(res, 404, {
        success: false,
        message: 'Product not found',
      })
    }

    return sendResponse(res, 200, {
      success: true,
      message: 'Product updated successfully',
      data: product,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private (Admin)
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
      return sendResponse(res, 404, {
        success: false,
        message: 'Product not found',
      })
    }

    return sendResponse(res, 200, {
      success: true,
      message: 'Product deleted successfully',
      data: { id: product._id },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Private (Admin)
exports.getAllOrders = async (req, res, next) => {
  try {
    const {
      status,
      paymentStatus,
      userId,
      page = 1,
      limit = 10,
      sort = '-createdAt',
    } = req.query

    const query = {}

    if (status) {
      query.status = status
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus
    }

    if (userId) {
      query.user = userId
    }

    const pageNum = parseInt(page, 10) || 1
    const limitNum = parseInt(limit, 10) || 10
    const skip = (pageNum - 1) * limitNum

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'name email phone')
        .populate('items.product', 'name price images')
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(query),
    ])

    const pages = Math.ceil(total / limitNum) || 1

    return sendResponse(res, 200, {
      success: true,
      message: 'Orders fetched successfully',
      data: orders,
      meta: {
        total,
        page: pageNum,
        pages,
        count: orders.length,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update order status
// @route   PUT /api/admin/orders/:id
// @access  Private (Admin)
// COD: Admin can set paymentStatus to "paid" (collected on delivery) or "failed"
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, paymentStatus, paymentVerificationStatus } = req.body
    const orderId = req.params.id

    const order = await Order.findById(orderId)
    if (!order) {
      return sendResponse(res, 404, {
        success: false,
        message: 'Order not found',
      })
    }

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    const validPaymentStatuses = ['pending', 'paid', 'failed']
    const validPaymentVerification = ['pending', 'verified', 'rejected']

    if (status && !validStatuses.includes(status)) {
      return sendResponse(res, 400, {
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      })
    }

    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return sendResponse(res, 400, {
        success: false,
        message: `Invalid payment status. Must be one of: ${validPaymentStatuses.join(', ')}`,
      })
    }

    if (paymentVerificationStatus && !validPaymentVerification.includes(paymentVerificationStatus)) {
      return sendResponse(res, 400, {
        success: false,
        message: `Invalid payment verification status. Must be one of: ${validPaymentVerification.join(', ')}`,
      })
    }

    // Prevent invalid state transitions (simple rules)
    const currentStatus = order.status
    if (currentStatus === 'cancelled') {
      return sendResponse(res, 400, {
        success: false,
        message: 'Cannot update a cancelled order',
      })
    }
    if (currentStatus === 'delivered' && status && status !== 'delivered') {
      return sendResponse(res, 400, {
        success: false,
        message: 'Cannot change status of a delivered order',
      })
    }

    const previousStatus = order.status

    if (status) {
      order.status = status
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus
    }

    if (paymentVerificationStatus) {
      order.paymentVerificationStatus = paymentVerificationStatus
    }

    // If order is newly cancelled, restore product stock
    if (status === 'cancelled' && previousStatus !== 'cancelled') {
      for (const item of order.items) {
        const product = await Product.findById(item.product)
        if (product) {
          product.stock += item.quantity
          await product.save()
        }
      }
    }

    await order.save()

    await order.populate('user', 'name email')
    await order.populate('items.product', 'name price images')

    return sendResponse(res, 200, {
      success: true,
      message: 'Order status updated successfully',
      data: order,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete order (Admin)
// @route   DELETE /api/admin/orders/:id
// @access  Private (Admin)
exports.deleteOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id

    const order = await Order.findById(orderId)
    if (!order) {
      return sendResponse(res, 404, {
        success: false,
        message: 'Order not found',
      })
    }

    // Restore product stock if order wasn't already cancelled
    if (order.status !== 'cancelled') {
      for (const item of order.items) {
        const product = await Product.findById(item.product)
        if (product) {
          product.stock += item.quantity
          await product.save()
        }
      }
    }

    await Order.findByIdAndDelete(orderId)

    return sendResponse(res, 200, {
      success: true,
      message: 'Order deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })

    return sendResponse(res, 200, {
      success: true,
      message: 'Users fetched successfully',
      data: users,
      meta: {
        count: users.length,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
exports.updateUser = async (req, res, next) => {
  try {
    // Prevent role escalation: do not allow role to be changed via this endpoint
    if (req.body && Object.prototype.hasOwnProperty.call(req.body, 'role')) {
      delete req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select('-password')

    if (!user) {
      return sendResponse(res, 404, {
        success: false,
        message: 'User not found',
      })
    }

    return sendResponse(res, 200, {
      success: true,
      message: 'User updated successfully',
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
      return sendResponse(res, 404, {
        success: false,
        message: 'User not found',
      })
    }

    return sendResponse(res, 200, {
      success: true,
      message: 'User deleted successfully',
      data: { id: user._id },
    })
  } catch (error) {
    next(error)
  }
}
