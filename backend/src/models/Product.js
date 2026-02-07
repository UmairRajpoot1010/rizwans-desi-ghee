const mongoose = require('mongoose')

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
      validate: {
        validator: function (value) {
          return value >= 0
        },
        message: 'Price must be a positive number',
      },
    },
    images: {
      type: [String],
      required: [true, 'At least one product image is required'],
      validate: {
        validator: function (value) {
          return value && value.length > 0
        },
        message: 'At least one product image is required',
      },
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: 'Stock must be an integer',
      },
    },
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

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text' }) // Text search index
productSchema.index({ category: 1 }) // Category index
productSchema.index({ isActive: 1 }) // Active products filter
productSchema.index({ price: 1 }) // Price sorting
productSchema.index({ createdAt: -1 }) // Latest products

// Virtual for checking if product is in stock
productSchema.virtual('inStock').get(function () {
  return this.stock > 0
})

// Method to check if product has sufficient stock
productSchema.methods.hasStock = function (quantity) {
  return this.stock >= quantity && this.isActive
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
