const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Reviewer name is required'],
            trim: true,
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot exceed 5'],
        },
        comment: {
            type: String,
            required: [true, 'Review comment is required'],
            trim: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        category: {
            type: String,
            default: 'Desi Ghee',
            trim: true,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Review', reviewSchema)
