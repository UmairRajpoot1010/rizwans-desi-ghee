const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required'],
    },
    size: {
      type: String,
      required: [true, 'Product size is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      validate: {
        validator: function (value) {
          return Number.isInteger(value)
        },
        message: 'Quantity must be an integer',
      },
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
      validate: {
        validator: function (value) {
          return value >= 0 && !isNaN(value)
        },
        message: 'Price must be a positive number',
      },
    },
  },
  { _id: false }
)

// Virtual for item subtotal
orderItemSchema.virtual('subtotal').get(function () {
  return this.quantity * this.price
})

/**
 * Order Schema
 * Payment Strategy v1.0: Cash-On-Delivery (COD) only.
 * - paymentStatus defaults to "pending" (payment due on delivery)
 * - Admin can mark paymentStatus as "paid" (customer paid on delivery) or "failed"
 * - No online payment integration (Stripe, etc.) in v1.0
 * - TODO: Integrate online payment gateway in future version
 */
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
          return Array.isArray(value) && value.length > 0
        },
        message: 'Order must have at least one item',
      },
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount must be positive'],
      validate: {
        validator: function (value) {
          return value >= 0 && !isNaN(value)
        },
        message: 'Total amount must be a positive number',
      },
    },
    shippingAddress: {
      name: {
        type: String,
        required: [true, 'Shipping name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters'],
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
        maxlength: [15, 'Phone number cannot exceed 15 characters'],
      },
      address: {
        type: String,
        required: [true, 'Shipping address is required'],
        trim: true,
        maxlength: [200, 'Address cannot exceed 200 characters'],
      },
      city: {
        type: String,
        required: [true, 'Shipping city is required'],
        trim: true,
        maxlength: [100, 'City cannot exceed 100 characters'],
      },
      state: {
        type: String,
        required: [true, 'Shipping state is required'],
        trim: true,
        maxlength: [100, 'State cannot exceed 100 characters'],
      },
      zipCode: {
        type: String,
        required: [true, 'Shipping zip code is required'],
        trim: true,
        maxlength: [10, 'Zip code cannot exceed 10 characters'],
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
    // COD: pending = awaiting payment on delivery, paid = collected, failed = payment failed
    paymentStatus: {
      type: String,
      enum: {
        values: ['pending', 'paid', 'failed'],
        message: 'Payment status must be one of: pending, paid, failed',
      },
      default: 'pending',
    },
    // Payment method and screenshot for online payments
    paymentMethod: {
      type: String,
      enum: {
        values: ['COD', 'ONLINE'],
        message: 'Payment method must be either COD or ONLINE',
      },
      default: 'COD',
    },
    paymentScreenshot: {
      type: String,
      default: null,
    },
    // Admin verification of online payment proof
    paymentVerificationStatus: {
      type: String,
      enum: {
        values: ['pending', 'verified', 'rejected'],
        message: 'Payment verification must be one of: pending, verified, rejected',
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

// Indexes - declared once
orderSchema.index({ user: 1 }) // User orders lookup
orderSchema.index({ status: 1 }) // Status filtering
orderSchema.index({ paymentStatus: 1 }) // Payment status filtering
orderSchema.index({ createdAt: -1 }) // Latest orders
orderSchema.index({ user: 1, createdAt: -1 }) // User's recent orders (compound index)

// Pre-save hook to calculate total amount
orderSchema.pre('save', function (next) {
  if (this.items && this.items.length > 0) {
    const calculatedTotal = this.items.reduce((total, item) => {
      return total + item.quantity * item.price
    }, 0)

    // Only update if totalAmount is not set or differs significantly (allowing for rounding)
    if (!this.totalAmount || Math.abs(this.totalAmount - calculatedTotal) > 0.01) {
      this.totalAmount = calculatedTotal
    }
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

// Method to update order status
orderSchema.methods.updateStatus = function (newStatus) {
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Invalid status: ${newStatus}`)
  }
  this.status = newStatus
  return this.save()
}

// Method to update payment status
orderSchema.methods.updatePaymentStatus = function (newPaymentStatus) {
  const validPaymentStatuses = ['pending', 'paid', 'failed']
  if (!validPaymentStatuses.includes(newPaymentStatus)) {
    throw new Error(`Invalid payment status: ${newPaymentStatus}`)
  }
  this.paymentStatus = newPaymentStatus
  return this.save()
}

// Static method to find orders by user
orderSchema.statics.findByUser = function (userId) {
  return this.find({ user: userId }).sort({ createdAt: -1 })
}

// Static method to find orders by status
orderSchema.statics.findByStatus = function (status) {
  return this.find({ status }).sort({ createdAt: -1 })
}

// Static method to find orders by payment status
orderSchema.statics.findByPaymentStatus = function (paymentStatus) {
  return this.find({ paymentStatus }).sort({ createdAt: -1 })
}

module.exports = mongoose.model('Order', orderSchema)
