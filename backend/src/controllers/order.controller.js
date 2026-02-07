const Order = require('../models/Order')
const Product = require('../models/Product')

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress } = req.body
    const userId = req.user.id

    // Calculate total amount
    let totalAmount = 0
    for (const item of items) {
      const product = await Product.findById(item.productId)
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` })
      }
      totalAmount += product.price * item.quantity
    }

    const order = await Order.create({
      user: userId,
      items: items.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
        price: (await Product.findById(item.productId)).price,
      })),
      totalAmount,
      shippingAddress,
    })

    res.status(201).json(order)
  } catch (error) {
    next(error)
  }
}

// @desc    Get user orders
// @route   GET /api/orders/my
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    next(error)
  }
}

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product')
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }
    // Check if order belongs to user or user is admin
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' })
    }
    res.json(order)
  } catch (error) {
    next(error)
  }
}
