const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { Order } = require('../models/order');
const { Product } = require('../models/product');
const { User } = require('../models/user');
const { Cart } = require('../models/cart');
const authorize = require('../middleware/auth');

// POST new order
router.post('/', authorize, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const user = await User.findById(req.user._id).session(session);
        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).send('Invalid user!');
        }

        const cart = await Cart.findOne({ user_id: user._id }).session(session);
        if (!cart || cart.items.length === 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).send('Cart is empty!');
        }

        const orderItems = [];
        let totalAmount = 0;

        for (const item of cart.items) {
            const product = await Product.findById(item.product_id).session(session);
            if (!product) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).send(`Invalid product with ID: ${item.product_id}`);
            }

            if (!item.color) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).send('Color not specified for product ' + product.name);
            }

            const colorVariant = product.variants.find(c => c.colorName === item.color);
            if (!colorVariant) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).send(`Color ${item.color} not found for product ${product.name}`);
            }

            const sizeEntry = colorVariant.sizes.find(s => s.size === item.size);
            if (!sizeEntry || sizeEntry.stock < item.qty) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).send(`Insufficient stock for size ${item.size} of ${item.color} color`);
            }

            // Debug log
            console.log(`Processing ${product.name}, Color: ${item.color}, Size: ${item.size}, Stock: ${sizeEntry.stock}, Requested: ${item.qty}`);

            // Atomically update stock
            const updateResult = await Product.updateOne(
                {
                    _id: product._id,
                    'variants.colorName': item.color,
                    'variants.sizes.size': item.size
                },
                {
                    $inc: { 'variants.$[v].sizes.$[s].stock': -item.qty }
                },
                {
                    arrayFilters: [
                        { 'v.colorName': item.color },
                        { 's.size': item.size }
                    ],
                    session
                }
            );

            if (updateResult.modifiedCount === 0) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).send(`Failed to update stock for ${product.name}, ${item.color}, size ${item.size}`);
            }

            const price = item.price || product.price;

            orderItems.push({
                product_id: product._id,
                name: product.name,
                colorName: item.color,
                size: item.size,
                qty: item.qty,
                price: price
            });

            totalAmount += price * item.qty;
        }

        const order = new Order({
            user_id: user._id,
            order_id: `ORD-${Date.now()}`,
            date: new Date(),
            items: orderItems,
            total: totalAmount,
            status: 'Pending'
        });

        await order.save({ session });

        // Clear cart
        await Cart.deleteOne({ user_id: user._id }).session(session);

        await session.commitTransaction();
        session.endSession();

        res.status(201).send(order);
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error occurred while processing the order:', err);
        res.status(500).send('Internal server error: ' + err.message);
    }
});

module.exports = router;
