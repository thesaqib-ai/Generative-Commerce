const mongoose = require('mongoose');
const Joi = require('joi');

const Course = mongoose.model('Course',new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
    },
}));

function validateCourse(course){
    const schema = Joi.object({
        name: Joi.string().min(5).required(),
    });
    return schema.validate(course);
}

module.exports = {Course, validateCourse};