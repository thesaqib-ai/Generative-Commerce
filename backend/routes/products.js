const express = require('express');
const router = express.Router();
const { Product, validateProduct } = require('../models/product');
const { Collection } = require('../models/collection');
const authorize = require('../middleware/auth');

// GET: All products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort('-price');
        if (!products || products.length === 0) {
            return res.status(200).send({ message: 'There are no products in the database!' });
        }
        res.status(200).send(products);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

// GET: Single product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send('Product not found.');
        res.status(200).send(product);
    } catch (err) {
        res.status(400).send('Invalid Product ID.');
    }
});

// POST: Add a new product
router.post('/', authorize, async (req, res) => {
    const { error } = validateProduct(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const collection = await Collection.findById(req.body.collection);
    if (!collection) return res.status(400).send('Invalid collection.');

    const product = new Product({
        name: req.body.name,
        brand: req.body.brand,
        collection: req.body.collection,
        category: req.body.category,
        gender: req.body.gender,
        variants: req.body.variants,
        price: req.body.price,
        discount: req.body.discount,
        description: req.body.description,
        isFeatured: req.body.isFeatured
    });

    try {
        await product.save();
        res.status(201).send(product);
    } catch (err) {
        res.status(400).send(Object.values(err.errors).map(e => e.message));
    }
});

router.put('/:id', authorize, async (req, res) => {
    const { error } = validateProduct(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const collection = await Collection.findById(req.body.collection);
    if (!collection) return res.status(400).send('Invalid collection.');

    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                brand: req.body.brand,
                collection: req.body.collection,
                category: req.body.category,
                gender: req.body.gender,
                variants: req.body.variants,
                price: req.body.price,
                discount: req.body.discount,
                description: req.body.description,
                isFeatured: req.body.isFeatured
            },
            { new: true, runValidators: true }
        );

        if (!product) return res.status(404).send('Product not found.');
        res.status(200).send(product);
    } catch (err) {
        res.status(400).send(err.message);
    }
});


// DELETE: Remove a product
router.delete('/:id', authorize, async (req, res) => {
    try {
        const product = await Product.findByIdAndRemove(req.params.id);
        if (!product) return res.status(404).send('Product not found.');
        res.status(200).send({ message: 'Product deleted successfully.', product });
    } catch (err) {
        res.status(400).send('Invalid Product ID.');
    }
});

module.exports = router;