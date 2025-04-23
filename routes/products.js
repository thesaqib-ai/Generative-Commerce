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

    const collection = await Collection.findById(req.body.collectionId);
    if (!collection) return res.status(400).send('Invalid collection.');

    const product = new Product({
        title: req.body.title,
        collection: {
            _id: collection._id,
            name: collection.name
        },
        price: req.body.price,
        description: req.body.description,
        numberInStock: req.body.numberInStock,
        colors: req.body.colors, // assuming colors is an array of objects
        sizes: req.body.sizes,   // assuming sizes is an array if applicable
        images: req.body.images,
        isFeatured: req.body.isFeatured || false,
        tags: req.body.tags
    });

    try {
        await product.save();
        res.status(201).send(product);
    } catch (err) {
        res.status(400).send(Object.values(err.errors).map(e => e.message));
    }
});

// PUT: Update a product
router.put('/:id', authorize, async (req, res) => {
    const { error } = validateProduct(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const collection = await Collection.findById(req.body.collectionId);
        if (!collection) return res.status(400).send('Invalid collection.');

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                collection: {
                    _id: collection._id,
                    name: collection.name
                },
                price: req.body.price,
                description: req.body.description,
                numberInStock: req.body.numberInStock,
                colors: req.body.colors,
                sizes: req.body.sizes,
                images: req.body.images,
                isFeatured: req.body.isFeatured || false,
                tags: req.body.tags
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