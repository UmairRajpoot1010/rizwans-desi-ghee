const mongoose = require('mongoose')
const { Schema } = mongoose

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be positive'],
    },
    weight: String,
    images: {
      type: [String],
      required: [true, 'At least one product image is required'],
      validate: {
        validator: function (value) {
          return Array.isArray(value) && value.length > 0
        },
        message: 'At least one product image is required',
      },
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
      maxlength: [100, 'Category cannot exceed 100 characters'],
    },
    stock: {
      type: Number,
      required: false, // Not required, default handles it
      min: [0, 'Stock cannot be negative'],
      default: 0,
      validate: {
        validator: function (value) {
          return Number.isInteger(value)
        },
        message: 'Stock must be an integer',
      },
    },
    variants: [
      {
        size: {
          type: String,
          required: [true, 'Variant size is required'],
          trim: true,
        },
        price: {
          type: Number,
          required: [true, 'Variant price is required'],
          min: [0, 'Price must be positive'],
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Indexes - declared once
productSchema.index({ name: 'text', description: 'text' }) // Text search index
productSchema.index({ category: 1 }) // Category index
productSchema.index({ isActive: 1 }) // Active products filter
productSchema.index({ createdAt: -1 }) // Latest products

// Virtual for base price (1kg if available, otherwise first variant)
productSchema.virtual('basePrice').get(function () {
  if (!this.variants || this.variants.length === 0) return 0
  const baseVariant = this.variants.find((v) => v.size.replace(/\s/g, '').toLowerCase() === '1kg')
  return baseVariant ? baseVariant.price : this.variants[0].price
})

// Virtual for checking if product is in stock
productSchema.virtual('inStock').get(function () {
  return this.stock > 0
})

// Method to get price for specific size
productSchema.methods.getPriceForSize = function (size) {
  if (!size) return null

  const normalizedRequestedSize = size.replace(/\s/g, '').toLowerCase()

  if (!this.variants || this.variants.length === 0) {
    // Fallback to fixed prices if variants not defined
    const FIXED_PRICES = { '500g': 1500, '1kg': 3000, '2kg': 6000 }
    return FIXED_PRICES[normalizedRequestedSize] || null
  }

  const variant = this.variants.find((v) => v.size.replace(/\s/g, '').toLowerCase() === normalizedRequestedSize)
  return variant ? variant.price : null
}

// Method to check if product has sufficient stock
productSchema.methods.hasStock = function (quantity) {
  return this.stock >= quantity && this.isActive
}

// Method to reduce stock (for order processing)
productSchema.methods.reduceStock = function (quantity) {
  if (!this.hasStock(quantity)) {
    throw new Error('Insufficient stock')
  }
  this.stock -= quantity
  return this.save()
}

// Static method to find active products
productSchema.statics.findActive = function () {
  return this.find({ isActive: true })
}

// Static method to find products by category
productSchema.statics.findByCategory = function (category) {
  return this.find({ category, isActive: true })
}

module.exports = mongoose.model('Product', productSchema)
