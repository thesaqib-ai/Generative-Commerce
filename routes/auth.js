const _ = require('lodash');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const jwt = require('jsonwebtoken');
const config = require('config');

router.post('/', async (req,res) => {
    const result = validate(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    let user = await User.findOne({
        email: req.body.email
    });
    if(!user){
        res.status(400).send('User not found - Invalid email or password!');
        return;
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword){
        res.status(400).send('User not found - Invalid email or password!');
        return;
    }
    const token = user.generateAuthToken();
    res.status(200).send(token);
});

function validate(user){
    const complexityOptions = {
        min: 8,
        max: 30,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
        requirementCount: 4
    }
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: passwordComplexity(complexityOptions)
    });
    return schema.validate(user);
}
module.exports = router;