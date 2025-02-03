const mongoose = require('mongoose');
const Joi = require('joi');
const Customer = mongoose.model('Customer',new mongoose.Schema({
    name: {
        type: String, 
        min:5, 
        max:50, 
        required: true
    },
    isGold: {
        type: Boolean, 
        required: true, 
        default: false
    },
    phone: {
        type: String, 
        required: true
    }
}));

function validateCustomer(customer){
    const schema = Joi.object({
        name: Joi.string().min(5).required(),
        isGold: Joi.boolean(),
        phone: Joi.string().required()
    });
    return schema.validate(customer);
}


module.exports = {Customer, validateCustomer};