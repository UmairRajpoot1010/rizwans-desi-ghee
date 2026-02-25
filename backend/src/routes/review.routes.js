const express = require('express')
const router = express.Router()

const {
    getAllReviews,
    createReview,
} = require('../controllers/review.controller')

/**
 * Review Routes
 * Base path: /api/reviews
 * Shared across all products
 */

router.get('/', getAllReviews)
router.post('/', createReview)

module.exports = router
