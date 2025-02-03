const mongoose = require('mongoose');
const Joi = require('joi');
const {genreSchema} = require('./genre')

const movieSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        minlength: 5,
        maxlength:50
    },
    genre:{
        type: genreSchema,
        required:true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
})

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie){
    const schema = Joi.object({
        title: Joi.string().min(3).max(50).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).max(255).required(),
        dailyRentalRate: Joi.number().min(0).max(255).required(),
    });
    return schema.validate(movie);
}

module.exports = { movieSchema, Movie, validateMovie };