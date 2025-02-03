const express = require('express');
const router = express.Router();
const {Movie, validateMovie} = require('../models/movie');
const {Genre} = require('../models/genre');
const authorize = require('../middleware/auth');

router.get('/', async (req,res) => {
    const movies = await Movie.find().sort('-dailyRentalRate');
    if(!movies){
        res.status(200).send({message:'There are no movies in the database!'})
    }
    res.status(200).send(movies);
});

router.post('/', authorize, async (req, res) => {
    const result = validateMovie(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const genre = await Genre.findById(req.body.genreId);
    if(!genre){
        res.status(400).send('Invalid genre!');
    }
    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    })
    try{
        await movie.save();
        res.status(201).send(movie);
    }
    catch(err){
         return res.status(400).send(Object.values(err.errors).map(error => error.message));
    }
});

module.exports = router;