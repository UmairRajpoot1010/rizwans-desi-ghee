const Product = require('../models/Product')

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

    // Build query
    const query = { isActive: true }

    // Filter by category
    if (category) {
      query.category = category
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }

    // Filter by stock availability
    if (inStock === 'true') {
      query.stock = { $gt: 0 }
    }

    // Calculate pagination
    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const skip = (pageNum - 1) * limitNum

    // Execute query
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)

    // Get total count for pagination
    const total = await Product.countDocuments(query)

    res.json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: products,
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
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    // Only return active products for public access
    if (!product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    res.json({
      success: true,
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
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      })
    }

    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const skip = (pageNum - 1) * limitNum

    // Text search using MongoDB text index
    const query = {
      isActive: true,
      $text: { $search: q },
    }

    const products = await Product.find(query, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(limitNum)

    const total = await Product.countDocuments(query)

    res.json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      query: q,
      data: products,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin)
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, images, category, stock, isActive } = req.body

    // Create product
    const product = await Product.create({
      name,
      description,
      price,
      images,
      category,
      stock: stock || 0,
      isActive: isActive !== undefined ? isActive : true,
    })

    res.status(201).json({
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
    const { name, description, price, images, category, stock, isActive } = req.body

    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    // Update fields
    if (name !== undefined) product.name = name
    if (description !== undefined) product.description = description
    if (price !== undefined) product.price = price
    if (images !== undefined) product.images = images
    if (category !== undefined) product.category = category
    if (stock !== undefined) product.stock = stock
    if (isActive !== undefined) product.isActive = isActive

    await product.save()

    res.json({
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
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    // Soft delete by setting isActive to false (recommended)
    // Or hard delete by removing from database
    const deleteMethod = req.query.hard === 'true' ? 'findByIdAndDelete' : 'updateOne'

    if (deleteMethod === 'findByIdAndDelete') {
      await Product.findByIdAndDelete(req.params.id)
      return res.json({
        success: true,
        message: 'Product deleted permanently',
      })
    } else {
      product.isActive = false
      await product.save()
      return res.json({
        success: true,
        message: 'Product deactivated successfully',
      })
    }
  } catch (error) {
    next(error)
  }
}
