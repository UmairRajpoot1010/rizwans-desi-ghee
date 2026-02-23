const mongoose = require('mongoose')
const Product = require('../models/Product')

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id)

// Fixed prices for each size (normalized keys)
const FIXED_PRICES = {
  '500g': 1500,
  '1kg': 3000,
  '2kg': 6000,
}

const getPriceForSize = (size) => {
  if (!size) return null
  const normalized = size.replace(/\s/g, '').toLowerCase()
  return FIXED_PRICES[normalized] || null
}

const sendResponse = (res, statusCode, { success, message, data, meta }) => {
  const payload = { success, message }
  if (data !== undefined) payload.data = data
  if (meta !== undefined) payload.meta = meta
  return res.status(statusCode).json(payload)
}

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res, next) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      inStock,
      page = 1,
      limit = 10,
      sort = '-createdAt',
    } = req.query

    const query = { isActive: true }

    if (category) {
      query.category = category
    }

    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }

    if (inStock === 'true') {
      query.stock = { $gt: 0 }
    }

    const pageNum = parseInt(page, 10) || 1
    const limitNum = parseInt(limit, 10) || 10
    const skip = (pageNum - 1) * limitNum

    const [products, total] = await Promise.all([
      Product.find(query).sort(sort).skip(skip).limit(limitNum),
      Product.countDocuments(query),
    ])

    return sendResponse(res, 200, {
      success: true,
      message: 'Products fetched successfully',
      data: products,
      meta: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
        count: products.length,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!isValidObjectId(id)) {
      return sendResponse(res, 400, {
        success: false,
        message: 'Invalid product id',
      })
    }

    const product = await Product.findById(id)

    if (!product || !product.isActive) {
      return sendResponse(res, 404, {
        success: false,
        message: 'Product not found',
      })
    }

    return sendResponse(res, 200, {
      success: true,
      message: 'Product fetched successfully',
      data: product,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
exports.searchProducts = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 10 } = req.query

    if (!q || q.trim() === '') {
      return sendResponse(res, 400, {
        success: false,
        message: 'Search query is required',
      })
    }

    const pageNum = parseInt(page, 10) || 1
    const limitNum = parseInt(limit, 10) || 10
    const skip = (pageNum - 1) * limitNum

    const query = {
      isActive: true,
      $text: { $search: q },
    }

    const [products, total] = await Promise.all([
      Product.find(query, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(query),
    ])

    return sendResponse(res, 200, {
      success: true,
      message: 'Products search successful',
      data: products,
      meta: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
        count: products.length,
        query: q,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin)
// Images: v1.0 accepts only uploads (no URLs).
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, images, category, stock, isActive, variants } = req.body

    if (!name || !variants || !Array.isArray(variants) || variants.length === 0) {
      return sendResponse(res, 400, {
        success: false,
        message: 'Product name and at least one product size are required',
      })
    }

    if (stock !== undefined && stock < 0) {
      return sendResponse(res, 400, {
        success: false,
        message: 'Stock cannot be negative',
      })
    }

    const existing = await Product.findOne({ name: name.trim() })
    if (existing) {
      return sendResponse(res, 400, {
        success: false,
        message: 'Product with this name already exists',
      })
    }

    // Convert variant sizes to variant objects with fixed prices
    let variantList = variants
      .map((size) => ({
        original: size,
        price: getPriceForSize(size)
      }))
      .filter((v) => v.price !== null)
      .map((v) => ({
        size: v.original,
        price: v.price,
      }))

    if (variantList.length === 0) {
      return sendResponse(res, 400, {
        success: false,
        message: 'Invalid product sizes. Available sizes: 500g, 1kg, 2kg',
      })
    }

    const product = await Product.create({
      name: name.trim(),
      description,
      images,
      category,
      variants: variantList,
      stock: stock || 0,
      isActive: isActive !== undefined ? isActive : true,
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
// @route   PUT /api/products/:id
// @access  Private (Admin)
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, description, images, category, stock, isActive, variants } = req.body

    if (!isValidObjectId(id)) {
      return sendResponse(res, 400, {
        success: false,
        message: 'Invalid product id',
      })
    }

    if (stock !== undefined && stock < 0) {
      return sendResponse(res, 400, {
        success: false,
        message: 'Stock cannot be negative',
      })
    }

    const product = await Product.findById(id)

    if (!product) {
      return sendResponse(res, 404, {
        success: false,
        message: 'Product not found',
      })
    }

    if (name !== undefined) product.name = name
    if (description !== undefined) product.description = description
    if (images !== undefined) product.images = images
    if (category !== undefined) product.category = category
    if (stock !== undefined) product.stock = stock
    if (isActive !== undefined) product.isActive = isActive

    if (variants !== undefined && Array.isArray(variants)) {
      let variantList = variants
        .map((size) => ({
          original: size,
          price: getPriceForSize(size)
        }))
        .filter((v) => v.price !== null)
        .map((v) => ({
          size: v.original,
          price: v.price,
        }))
      if (variantList.length > 0) {
        product.variants = variantList
      }
    }

    if (product.stock < 0) {
      return sendResponse(res, 400, {
        success: false,
        message: 'Stock cannot be negative',
      })
    }

    await product.save()

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
// @route   DELETE /api/products/:id
// @access  Private (Admin)
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!isValidObjectId(id)) {
      return sendResponse(res, 400, {
        success: false,
        message: 'Invalid product id',
      })
    }

    const product = await Product.findById(id)

    if (!product) {
      return sendResponse(res, 404, {
        success: false,
        message: 'Product not found',
      })
    }

    const hardDelete = req.query.hard === 'true'

    if (hardDelete) {
      await Product.findByIdAndDelete(id)
      return sendResponse(res, 200, {
        success: true,
        message: 'Product deleted permanently',
        data: { id: product._id },
      })
    }

    product.isActive = false
    await product.save()

    return sendResponse(res, 200, {
      success: true,
      message: 'Product deactivated successfully',
      data: { id: product._id },
    })
  } catch (error) {
    next(error)
  }
}
