const Review = require('../models/Review')

const sendResponse = (res, statusCode, { success, message, data, meta }) => {
    const payload = { success, message }
    if (data !== undefined) payload.data = data
    if (meta !== undefined) payload.meta = meta
    return res.status(statusCode).json(payload)
}

// @desc    Get all reviews (shared across products)
// @route   GET /api/reviews
// @access  Public
exports.getAllReviews = async (req, res, next) => {
    try {
        const { category = 'Desi Ghee' } = req.query
        const reviews = await Review.find({ category }).sort({ date: -1 })

        // Calculate aggregate stats
        const count = reviews.length
        const avgRating = count > 0
            ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / count
            : 0

        return sendResponse(res, 200, {
            success: true,
            message: 'Reviews fetched successfully',
            data: {
                reviews,
                stats: {
                    averageRating: Number(avgRating.toFixed(1)),
                    totalReviews: count
                }
            },
        })
    } catch (error) {
        next(error)
    }
}

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Public
exports.createReview = async (req, res, next) => {
    try {
        const { name, rating, comment, date, category } = req.body

        if (!name || !rating || !comment) {
            return sendResponse(res, 400, {
                success: false,
                message: 'Name, rating and comment are required',
            })
        }

        const review = await Review.create({
            name,
            rating: Number(rating),
            comment,
            date: date || new Date(),
            category: category || 'Desi Ghee'
        })

        return sendResponse(res, 201, {
            success: true,
            message: 'Review added successfully',
            data: review,
        })
    } catch (error) {
        next(error)
    }
}
