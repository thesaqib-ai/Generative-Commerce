const express = require('express');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { Cart, validateCart } = require('../models/cart');
const authorize = require('../middleware/auth'); // Auth middleware for logged-in users
const router = express.Router();

// GET cart (by logged-in user OR guest cart token)
router.get('/', async (req, res) => {
    const { userId, cartToken } = req.query;

    let cart;
    if (userId) {
        cart = await Cart.findOne({ user_id: user})
            .populate('user_id', 'name email phone address');
    } else if (cartToken) {
        cart = await Cart.findOne({ cart_token: cartToken });
    }

    if (!cart) return res.status(404).send('Cart not found');
    res.send(cart);
});

// POST: Create a new cart (for guest or logged-in user)
router.post('/', async (req, res) => {
    const { error } = validateCart(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { user_id, cart_token, email, phone, items } = req.body;

    let existingCart;
    if (user_id) {
        existingCart = await Cart.findOne({ user_id });
    } else if (cart_token) {
        existingCart = await Cart.findOne({ cart_token });
    }

    if (existingCart) {
        return res.status(400).send('Cart already exists. Use PUT to update.');
    }

    const newCart = new Cart({
        cart_token: cart_token || uuidv4(),
        user_id: user_id || null,
        email: email || null,
        phone: phone || null,
        items
    });

    await newCart.save();
    res.status(201).send(newCart);
});

// PUT: Update cart (for guest or logged-in user)
router.put('/', async (req, res) => {
    const { error } = validateCart(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { user_id, cart_token, email, phone, items } = req.body;

    let cart;
    if (user_id) {
        cart = await Cart.findOne({ user_id });
    } else if (cart_token) {
        cart = await Cart.findOne({ cart_token });
    }

    if (!cart) return res.status(404).send('Cart not found');

    cart.items = items;
    cart.email = email || cart.email;
    cart.phone = phone || cart.phone;
    cart.updatedAt = new Date();

    await cart.save();
    res.send(cart);
});

// DELETE: Remove specific item from cart (requires auth)
router.delete('/item/:productId', authorize, async (req, res) => {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user_id: req.user._id });
    if (!cart) return res.status(404).send('Cart not found');

    const itemIndex = cart.items.findIndex(item =>
        item.product_id.toString() === productId
    );

    if (itemIndex === -1) return res.status(404).send('Product not found in cart');

    cart.items.splice(itemIndex, 1);
    cart.updatedAt = new Date();
    await cart.save();

    res.send(cart);
});

// Assign guest cart to logged-in user after login
router.post('/assign', authorize, async (req, res) => {
    const { cart_token } = req.body;
    if (!cart_token) return res.status(400).send('Cart token is required');

    const cart = await Cart.findOne({ cart_token });
    if (!cart) return res.status(404).send('Cart not found');

    // Assign user as owner
    cart.user_id = req.user._id;
    await cart.save();

    res.send(cart);
});

module.exports = router;