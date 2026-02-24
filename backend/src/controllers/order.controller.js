const mongoose = require('mongoose')
const Order = require('../models/Order')
const Product = require('../models/Product')

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id)

const sendResponse = (res, statusCode, { success, message, data, meta }) => {
  const payload = { success, message }
  if (data !== undefined) payload.data = data
  if (meta !== undefined) payload.meta = meta
  return res.status(statusCode).json(payload)
}

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
// Payment: COD (Cash-On-Delivery) only. paymentStatus defaults to "pending".
// Admin marks as "paid" when customer pays on delivery.
exports.createOrder = async (req, res, next) => {
  try {
    // Support multipart/form-data: items and shippingAddress may be JSON strings
    let { items, shippingAddress, paymentMethod } = req.body
    if (typeof items === 'string') {
      try { items = JSON.parse(items) } catch { items = [] }
    }
    if (typeof shippingAddress === 'string') {
      try { shippingAddress = JSON.parse(shippingAddress) } catch { shippingAddress = null }
    }
    paymentMethod = (paymentMethod || 'COD').toString().toUpperCase()
    const userId = req.user?._id || req.user?.id

    if (!userId) {
      return sendResponse(res, 401, {
        success: false,
        message: 'Not authenticated',
      })
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return sendResponse(res, 400, {
        success: false,
        message: 'Order must have at least one item',
      })
    }

    if (!shippingAddress) {
      return sendResponse(res, 400, {
        success: false,
        message: 'Shipping address is required',
      })
    }

    const orderItems = []
    let totalAmount = 0

    for (const item of items) {
      if (!item.product || !isValidObjectId(item.product)) {
        return sendResponse(res, 400, {
          success: false,
          message: `Invalid product id: ${item.product}`,
        })
      }

      if (!item.quantity || item.quantity <= 0) {
        return sendResponse(res, 400, {
          success: false,
          message: 'Each order item must have a positive quantity',
        })
      }

      if (!item.size) {
        return sendResponse(res, 400, {
          success: false,
          message: 'Product size is required',
        })
      }

      const product = await Product.findById(item.product)
      if (!product) {
        return sendResponse(res, 404, {
          success: false,
          message: `Product with ID ${item.product} not found`,
        })
      }

      if (!product.isActive) {
        return sendResponse(res, 400, {
          success: false,
          message: `Product ${product.name} is not available`,
        })
      }

      if (!product.hasStock(item.quantity)) {
        return sendResponse(res, 400, {
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
        })
      }

      const unitPrice = product.getPriceForSize(item.size)
      if (!unitPrice) {
        return sendResponse(res, 400, {
          success: false,
          message: `Size ${item.size} not available for ${product.name}`,
        })
      }

      orderItems.push({
        product: product._id,
        size: item.size,
        quantity: item.quantity,
        price: unitPrice,
      })

      totalAmount += unitPrice * item.quantity

      product.stock -= item.quantity
      if (product.stock < 0) {
        return sendResponse(res, 400, {
          success: false,
          message: `Insufficient stock for ${product.name}`,
        })
      }
      await product.save()
    }

    // For ONLINE payment, handle Base64 screenshot
    let paymentProof = { data: null, uploadedAt: null }
    if (paymentMethod === 'ONLINE') {
      const base64Data = req.body.paymentProof || req.body.paymentScreenshot
      if (!base64Data) {
        return sendResponse(res, 400, {
          success: false,
          message: 'Payment proof is required for online payments'
        })
      }
      paymentProof = {
        data: base64Data,
        uploadedAt: new Date()
      }
    }

    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      status: 'pending',
      paymentStatus: paymentMethod === 'COD' ? 'pending' : 'unverified',
      paymentMethod,
      paymentProof,
      paymentVerificationStatus: paymentMethod === 'ONLINE' ? 'pending' : 'pending',
    })

    await order.populate('items.product')
    await order.populate('user', 'name email')

    return sendResponse(res, 201, {
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

    const query = {}

    if (status) query.status = status
    if (paymentStatus) query.paymentStatus = paymentStatus
    if (userId) query.user = userId

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

    return sendResponse(res, 200, {
      success: true,
      message: 'Orders fetched successfully',
      data: orders,
      meta: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
        count: orders.length,
      },
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
    const userId = req.user?._id || req.user?.id
    const { status, page = 1, limit = 10 } = req.query

    if (!userId) {
      return sendResponse(res, 401, {
        success: false,
        message: 'Not authenticated',
      })
    }

    const query = { user: userId }
    if (status) {
      query.status = status
    }

    const pageNum = parseInt(page, 10) || 1
    const limitNum = parseInt(limit, 10) || 10
    const skip = (pageNum - 1) * limitNum

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('items.product', 'name price images')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(query),
    ])

    return sendResponse(res, 200, {
      success: true,
      message: 'Orders fetched successfully',
      data: orders,
      meta: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
        count: orders.length,
      },
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
    const { id } = req.params

    if (!isValidObjectId(id)) {
      return sendResponse(res, 400, {
        success: false,
        message: 'Invalid order id',
      })
    }

    const order = await Order.findById(id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name price images description')

    if (!order) {
      return sendResponse(res, 404, {
        success: false,
        message: 'Order not found',
      })
    }

    const userId = req.user?._id || req.user?.id
    const isAdmin = req.admin || (req.user && req.user.role === 'admin')

    if (!isAdmin && (!userId || order.user._id.toString() !== userId.toString())) {
      return sendResponse(res, 403, {
        success: false,
        message: 'Not authorized to access this order',
      })
    }

    return sendResponse(res, 200, {
      success: true,
      message: 'Order fetched successfully',
      data: order,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update order shipping info (User only)
// @route   PUT /api/orders/:id/shipping
// @access  Private
exports.updateMyOrderShipping = async (req, res, next) => {
  try {
    const { id } = req.params
    const { phone, address, city, state, zipCode, email, name } = req.body

    const order = await Order.findById(id)
    if (!order) return sendResponse(res, 404, { success: false, message: 'Order not found' })

    const userId = req.user?._id || req.user?.id
    if (order.user.toString() !== userId.toString()) {
      return sendResponse(res, 403, { success: false, message: 'Not authorized' })
    }

    // Only allow updating if order is pending or processing
    if (!['pending', 'processing'].includes(order.status)) {
      return sendResponse(res, 400, { success: false, message: `Cannot update shipping details for a ${order.status} order` })
    }

    // Update details
    if (phone !== undefined) order.shippingAddress.phone = phone
    if (address !== undefined) order.shippingAddress.address = address
    if (city !== undefined) order.shippingAddress.city = city
    if (state !== undefined) order.shippingAddress.state = state
    if (zipCode !== undefined) order.shippingAddress.zipCode = zipCode
    if (email !== undefined) order.shippingAddress.email = email
    if (name !== undefined) order.shippingAddress.name = name

    await order.save()

    return sendResponse(res, 200, {
      success: true,
      message: 'Order shipping details updated successfully',
      data: order,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Cancel order (User only) - Performs a hard delete to remove from profile
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelMyOrder = async (req, res, next) => {
  try {
    const { id } = req.params

    const order = await Order.findById(id)
    if (!order) return sendResponse(res, 404, { success: false, message: 'Order not found' })

    const userId = req.user?._id || req.user?.id
    if (order.user.toString() !== userId.toString()) {
      return sendResponse(res, 403, { success: false, message: 'Not authorized' })
    }

    if (!order.canCancel()) {
      return sendResponse(res, 400, { success: false, message: `Order cannot be cancelled because its status is ${order.status}` })
    }

    // Restock the items
    for (const item of order.items) {
      const product = await Product.findById(item.product)
      if (product) {
        product.stock += item.quantity
        await product.save()
      }
    }

    // Instead of setting status to 'cancelled', we delete the order as requested
    await Order.findByIdAndDelete(id)

    return sendResponse(res, 200, {
      success: true,
      message: 'Order cancelled and removed successfully',
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
    const { status, paymentStatus, paymentVerificationStatus } = req.body
    const { id } = req.params

    if (!isValidObjectId(id)) {
      return sendResponse(res, 400, {
        success: false,
        message: 'Invalid order id',
      })
    }

    const order = await Order.findById(id)
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

    // Build update object
    const updateData = {}
    if (status) updateData.status = status
    if (paymentStatus) updateData.paymentStatus = paymentStatus
    if (paymentVerificationStatus) updateData.paymentVerificationStatus = paymentVerificationStatus

    // Apply updates
    Object.assign(order, updateData)

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
