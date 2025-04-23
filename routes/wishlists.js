const express = require('express');
const router = express.Router();
const { Wishlist, validateWishlist } = require('../models/wishlist');
const { Product } = require('../models/product');
const authorize = require('../middleware/auth');

// GET: Wishlist for logged-in user
router.get('/', authorize, async (req, res) => {
    try {
        const wishlist = await Wishlist.find({ userId: req.user._id }).populate('productId');
        res.status(200).send(wishlist);
    } catch (err) {
        res.status(500).send('Failed to fetch wishlist.');
    }
});

// POST: Add product to wishlist
router.post('/', authorize, async (req, res) => {
    const { error } = validateWishlist(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const product = await Product.findById(req.body.productId);
    if (!product) return res.status(400).send('Invalid product.');

    // Prevent duplicates
    const existing = await Wishlist.findOne({ userId: req.user._id, productId: product._id });
    if (existing) return res.status(200).send({ message: 'Product is already in wishlist.' });

    const wishlistItem = new Wishlist({
        userId: req.user._id,
        productId: product._id
    });

    try {
        await wishlistItem.save();
        res.status(201).send(wishlistItem);
    } catch (err) {
        res.status(400).send('Failed to save to wishlist.');
    }
});

// DELETE: Remove product from wishlist
router.delete('/:productId', authorize, async (req, res) => {
    try {
        const removed = await Wishlist.findOneAndDelete({ 
            userId: req.user._id, 
            productId: req.params.productId 
        });

        if (!removed) return res.status(404).send('Product not found in wishlist.');
        res.status(200).send({ message: 'Product removed from wishlist.', productId: req.params.productId });
    } catch (err) {
        res.status(400).send('Failed to remove item.');
    }
});

module.exports = router;