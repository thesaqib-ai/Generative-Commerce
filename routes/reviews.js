const express = require('express');
const router = express.Router();
const { Review, validateReview } = require('../models/review');
const { Product } = require('../models/product');
const authorize = require('../middleware/auth');

// GET: All reviews for a product
router.get('/:productId', async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId })
                                    .populate('userId', 'name'); // changed from userId
        res.status(200).send(reviews);
    } catch (err) {
        res.status(500).send('Could not fetch reviews.');
    }
});

// POST: Create a review
router.post('/', authorize, async (req, res) => {
    const { error } = validateReview(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const product = await Product.findById(req.body.productId);
    if (!product) return res.status(400).send('Invalid product.');

    // Prevent multiple reviews per user per product
    const existing = await Review.findOne({
        productId: req.body.productId,
        userId: req.user._id // changed from req.user._id
    });
    if (existing) return res.status(400).send('You have already reviewed this product.');

    const review = new Review({
        userId: req.user._id, // changed from userId
        productId: req.body.productId,
        rating: req.body.rating,
        comment: req.body.comment
    });

    try {
        await review.save();
        res.status(201).send(review);
    } catch (err) {
        res.status(400).send('Failed to save review.');
    }
});

// DELETE: Remove a review (admin or owner)
router.delete('/:reviewId', authorize, async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);
        if (!review) return res.status(404).send('Review not found.');

        if (review.userId.toString() !== req.user._id && !req.user.isAdmin) {
            return res.status(403).send('Access denied.');
        }

        await review.remove();
        res.status(200).send({ message: 'Review deleted.' });
    } catch (err) {
        res.status(500).send('Failed to delete review.');
    }
});

module.exports = router;
