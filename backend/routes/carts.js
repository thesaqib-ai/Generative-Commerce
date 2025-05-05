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
router.post('/', authorize, async (req, res) => {
    const { error } = validateCart(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Extract the required fields from the request body
    const { cart_token, email, phone, items } = req.body;

    // Get the user_id from the JWT token (from the 'authorize' middleware)
    const user_id = req.user._id;

    // Check if the cart already exists for the logged-in user or guest (based on cart_token)
    let existingCart;
    if (user_id) {
        // Check if a cart already exists for the logged-in user
        existingCart = await Cart.findOne({ user_id });
    } else if (cart_token) {
        // Check if a cart exists for the guest user using the cart_token
        existingCart = await Cart.findOne({ cart_token });
    }

    // If a cart already exists, return an error
    if (existingCart) {
        return res.status(400).send('Cart already exists. Use PUT to update.');
    }

    // Create a new cart object
    const newCart = new Cart({
        cart_token: cart_token || uuidv4(), // Use the provided cart_token or generate a new one
        user_id: user_id || null,            // Set the user_id from the JWT token (null for guest)
        email: email || null,
        phone: phone || null,
        items
    });

    // Save the new cart to the database
    await newCart.save();
    res.status(201).send(newCart);
});


// PUT: Update cart (for guest or logged-in user)
router.put('/', authorize, async (req, res) => {
    const { error } = validateCart(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { cart_token, email, phone, items } = req.body;
    const user_id = req.user._id; // Get the user_id from the JWT token

    let cart;
    
    // Check if user_id is available and find cart using user_id or cart_token
    if (user_id) {
        cart = await Cart.findOne({ user_id });
    } else if (cart_token) {
        cart = await Cart.findOne({ cart_token });
    }

    // If no cart is found, return a 404 error
    if (!cart) return res.status(404).send('Cart not found');

    // Merge incoming items into the existing cart
    items.forEach(newItem => {
        const existingIndex = cart.items.findIndex(
            item => item.product_id.toString() === newItem.product_id.toString()
        );

        if (existingIndex !== -1) {
            // Item exists → increase quantity
            cart.items[existingIndex].qty += newItem.qty;
        } else {
            // New item → push to cart
            cart.items.push(newItem);
        }
    });

    // Update other cart fields like email and phone
    cart.email = email || cart.email;
    cart.phone = phone || cart.phone;
    cart.updatedAt = new Date();

    // Save the updated cart and send the response
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