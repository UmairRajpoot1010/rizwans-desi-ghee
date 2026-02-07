const Order = require('../models/Order')
const Product = require('../models/Product')

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress } = req.body
    const userId = req.user._id || req.user.id

    // Validate items array
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must have at least one item',
      })
    }

    // Validate shipping address
    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required',
      })
    }

    // Validate and process items
    const orderItems = []
    let totalAmount = 0

    for (const item of items) {
      const product = await Product.findById(item.product)
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.product} not found`,
        })
      }

      // Check if product is active
      if (!product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} is not available`,
        })
      }

      // Check stock availability
      if (!product.hasStock(item.quantity)) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
        })
      }

      // Add item to order
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      })

      totalAmount += product.price * item.quantity

      // Update product stock
      product.stock -= item.quantity
      await product.save()
    }

    // Create order
    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      status: 'pending',
      paymentStatus: 'pending',
    })

    // Populate product details
    await order.populate('items.product')
    await order.populate('user', 'name email')

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
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

// @desc    Get user orders
// @route   GET /api/orders/my
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id
    const { status, page = 1, limit = 10 } = req.query

    const query = { user: userId }
    if (status) {
      query.status = status
    }

    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const skip = (pageNum - 1) * limitNum

    const orders = await Order.find(query)
      .populate('items.product', 'name price images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)

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

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name price images description')

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    // Check if order belongs to user or user is admin
    const userId = req.user._id || req.user.id
    const isAdmin = req.admin || (req.user && req.user.role === 'admin')

    if (order.user._id.toString() !== userId.toString() && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order',
      })
    }

    res.json({
      success: true,
      data: order,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
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
