const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      validate: {
        validator: Number.isInteger,
        message: 'Quantity must be an integer',
      },
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
    },
  },
  { _id: false }
)

// Virtual for item subtotal
orderItemSchema.virtual('subtotal').get(function () {
  return this.quantity * this.price
})

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    items: {
      type: [orderItemSchema],
      required: [true, 'Order must have at least one item'],
      validate: {
        validator: function (value) {
          return value && value.length > 0
        },
        message: 'Order must have at least one item',
      },
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount must be positive'],
    },
    shippingAddress: {
      name: {
        type: String,
        required: [true, 'Shipping name is required'],
        trim: true,
      },
      email: {
        type: String,
        required: [true, 'Shipping email is required'],
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
      },
      phone: {
        type: String,
        required: [true, 'Shipping phone is required'],
        trim: true,
      },
      address: {
        type: String,
        required: [true, 'Shipping address is required'],
        trim: true,
      },
      city: {
        type: String,
        required: [true, 'Shipping city is required'],
        trim: true,
      },
      state: {
        type: String,
        required: [true, 'Shipping state is required'],
        trim: true,
      },
      zipCode: {
        type: String,
        required: [true, 'Shipping zip code is required'],
        trim: true,
      },
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        message: 'Status must be one of: pending, processing, shipped, delivered, cancelled',
      },
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['pending', 'paid', 'failed'],
        message: 'Payment status must be one of: pending, paid, failed',
      },
      default: 'pending',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Indexes for better query performance
orderSchema.index({ user: 1 }) // User orders lookup
orderSchema.index({ status: 1 }) // Status filtering
orderSchema.index({ paymentStatus: 1 }) // Payment status filtering
orderSchema.index({ createdAt: -1 }) // Latest orders
orderSchema.index({ user: 1, createdAt: -1 }) // User's recent orders

// Pre-save hook to calculate total amount
orderSchema.pre('save', function (next) {
  if (this.items && this.items.length > 0) {
    this.totalAmount = this.items.reduce((total, item) => {
      return total + item.quantity * item.price
    }, 0)
  }
  next()
})

// Virtual for order item count
orderSchema.virtual('itemCount').get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0)
})

// Method to check if order can be cancelled
orderSchema.methods.canCancel = function () {
  return ['pending', 'processing'].includes(this.status)
}

// Method to check if order is completed
orderSchema.methods.isCompleted = function () {
  return this.status === 'delivered' && this.paymentStatus === 'paid'
}

// Static method to find orders by user
orderSchema.statics.findByUser = function (userId) {
  return this.find({ user: userId }).sort({ createdAt: -1 })
}

// Static method to find orders by status
orderSchema.statics.findByStatus = function (status) {
  return this.find({ status }).sort({ createdAt: -1 })
}

module.exports = mongoose.model('Order', orderSchema)
