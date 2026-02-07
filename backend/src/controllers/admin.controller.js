const Admin = require('../models/Admin')
const Product = require('../models/Product')
const Order = require('../models/Order')
const User = require('../models/User')
const { generateToken } = require('../utils/generateToken')

// @desc    Admin login
// @route   POST /api/admin/auth/login
// @access  Public
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      })
    }

    // Find admin by email (include password for comparison)
    const admin = await Admin.findByEmail(email.toLowerCase())

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      })
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Admin account is inactive. Please contact administrator',
      })
    }

    // Verify password
    const isMatch = await admin.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      })
    }

    // Generate JWT token
    const token = generateToken(admin._id, 'admin')

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
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
    const admin = await Admin.findById(req.admin._id).select('-password')

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      })
    }

    res.json({
      success: true,
      data: admin,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get admin stats
// @route   GET /api/admin/dashboard/stats
// @access  Private (Admin)
exports.getStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments()
    const totalProducts = await Product.countDocuments()
    const totalUsers = await User.countDocuments()
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ])

    res.json({
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue: totalRevenue[0]?.total || 0,
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
    res.json(products)
  } catch (error) {
    next(error)
  }
}

// @desc    Create product
// @route   POST /api/admin/products
// @access  Private (Admin)
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json(product)
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
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(product)
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
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json({ message: 'Product deleted successfully' })
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

    // Build query
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

    // Calculate pagination
    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const skip = (pageNum - 1) * limitNum

    // Execute query
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('items.product', 'name price images')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)

    // Get total count
    const total = await Order.countDocuments(query)

    res.json({
      success: true,
      count: orders.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: orders,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update order status
// @route   PUT /api/admin/orders/:id
// @access  Private (Admin)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, paymentStatus } = req.body
    const orderId = req.params.id

    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      })
    }

    // Validate payment status
    const validPaymentStatuses = ['pending', 'paid', 'failed']
    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid payment status. Must be one of: ${validPaymentStatuses.join(', ')}`,
      })
    }

    // Update status
    if (status) {
      order.status = status
    }

    // Update payment status
    if (paymentStatus) {
      order.paymentStatus = paymentStatus
    }

    // If order is cancelled, restore product stock
    if (status === 'cancelled' && order.status !== 'cancelled') {
      for (const item of order.items) {
        const product = await Product.findById(item.product)
        if (product) {
          product.stock += item.quantity
          await product.save()
        }
      }
    }

    await order.save()

    // Populate before sending response
    await order.populate('user', 'name email')
    await order.populate('items.product', 'name price images')

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order,
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
    res.json(users)
  } catch (error) {
    next(error)
  }
}

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(user)
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
      return res.status(404).json({ message: 'User not found' })
    }
    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    next(error)
  }
}
