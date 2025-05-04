const mongoose = require('mongoose');
const Joi = require('joi');

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        maxlength: 1000
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Review = mongoose.model('Review', reviewSchema);

function validateReview(data) {
    const schema = Joi.object({
        productId: Joi.string().required(),
        rating: Joi.number().min(1).max(5).required(),
        comment: Joi.string().max(1000).allow('')
    });
    return schema.validate(data);
}

module.exports = { Review, validateReview };
