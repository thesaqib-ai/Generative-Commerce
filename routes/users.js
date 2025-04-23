const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');
const _ = require('lodash');
const { User, validateUser } = require('../models/user');
const authorize = require('../middleware/auth');

// Role-based registration endpoint
router.post('/', authorize, async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Prevent duplicate email
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    // Default role is 'customer'
    const role = req.body.role || 'customer';

    /// Only admin can create staff roles
    const staffRoles = ['admin', 'marketing', 'support', 'fulfillment'];
    if (staffRoles.includes(role) && (!req.user || req.user.role !== 'admin')) {
        return res.status(403).send('Only admin can register staff users.');
}

    user = new User(_.pick(req.body, ['name', 'email', 'password', 'phone', 'address', 'role']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).status(201).send(_.pick(user, ['_id', 'name', 'email', 'role']));
});

router.post('/login', async (req, res) => {
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid password.');

    const token = user.generateAuthToken();
    res.send({ token });
});

module.exports = router;


// Get currently logged in user
router.get('/me', authorize, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).send('User not found.');
    res.send(user);
});

// Get all users (admin only)
router.get('/', authorize, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).send('Access denied.');
    const users = await User.find().select('-password');
    res.send(users);
});

// Update a user by ID
router.put('/:id', authorize, async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Admin can update any user; others can only update themselves
    if (req.user.role !== 'admin' && req.user._id !== req.params.id) {
        return res.status(403).send('Access denied.');
    }

    const updateFields = _.pick(req.body, ['name', 'email', 'phone', 'address', 'role']);

    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        updateFields.password = await bcrypt.hash(req.body.password, salt);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateFields, { new: true }).select('-password');
    if (!user) return res.status(404).send('User not found.');

    res.send(user);
});

// Delete a user by ID (admin only)
router.delete('/:id', authorize, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).send('Access denied.');

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send('User not found.');

    res.send({ message: 'User deleted successfully.' });
});

module.exports = router;
