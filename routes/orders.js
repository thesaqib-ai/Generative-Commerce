const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { Order, validateOrder } = require('../models/order');
const { Product } = require('../models/product');
const { User } = require('../models/user');
const authorize = require('../middleware/auth');

// GET all orders
router.get('/', async (req, res) => {
    const orders = await Order.find().sort('-date');
    if (!orders || orders.length === 0) {
        return res.status(400).send('No orders found in the database!');
    }
    res.status(200).send(orders);
});

// POST new order
router.post('/', authorize, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const result = validateOrder(req.body);
        if (result.error) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).send(result.error.details[0].message);
        }

        const user = await User.findById(req.body.user_id).session(session);
        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).send('Invalid user!');
        }

        const orderItems = [];
        let totalAmount = 0;

        for (const item of req.body.items) {
            const product = await Product.findById(item.product_id).session(session);
            if (!product) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).send(`Invalid product with ID: ${item.product_id}`);
            }

            const colorVariant = product.colors.find(c => c.colorName === item.colorName);
            if (!colorVariant) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).send(`Color ${item.colorName} not found for product ${product.name}`);
            }

            const sizeEntry = colorVariant.sizes.find(s => s.size === item.size);
            if (!sizeEntry || sizeEntry.stock < item.qty) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).send(`Insufficient stock for size ${item.size} of ${item.colorName} color`);
            }

            // Decrease stock
            sizeEntry.stock -= item.qty;
            await product.save({ session });

            orderItems.push({
                product_id: product._id,
                name: product.name,
                colorName: item.colorName,
                size: item.size,
                qty: item.qty,
                price: item.price
            });

            totalAmount += item.price * item.qty;
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

        await session.commitTransaction();
        session.endSession();

        res.status(201).send(order);
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).send(err.message);
    }
});

module.exports = router;