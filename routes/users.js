const _ = require('lodash');
const { User, validateUser } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const authorize = require('../middleware/auth');

router.post('/', async (req,res) => {
    const result = validateUser(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    let user = await User.findOne({
        email: req.body.email
    });
    if(user){
        res.status(400).send('User already exists! Please go to login page.');
        return;
    }
    user = new User(_.pick(req.body, ['name','email','password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    const token = user.generateAuthToken();
    res.status(201).header('x-auth-token',token).send(_.pick(user, ['_id', 'name', 'email']));
});

router.get('/me', authorize, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).send(user);
});
module.exports = router;