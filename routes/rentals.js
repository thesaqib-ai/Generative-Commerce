const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { Rental, validateRental} = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const authorize = require('../middleware/auth');

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    if(!rentals){
        res.status(400).send('No rentals found in the database!');
        return;
    }
    res.status(200).send(rentals)
});

router.post('/', authorize, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const result = validateRental(req.body);
        if(result.error){
            await session.abortTransaction();
            session.endSession();
            res.status(400).send(result.error.details[0].message);
            return;
        }
        const customer = await Customer.findById(req.body.customerId).session(session);
        if(!customer){
            res.status(400).send('Invalid Customer!');
            await session.abortTransaction();
            session.endSession();
            return;
        }
        const movie = await Movie.findById(req.body.movieId).session(session);
        if(!movie){
            await session.abortTransaction();
            session.endSession();
            res.status(400).send('Invalid Movie!');
            return;
        }
        // const genre = await movie.genre.id(req.body.movieId);
        // if(!movie){
        //     res.status(400).send('Invalid Movie!');
        //     return;
        // }

        if(movie.numberInStock === 0){
            await session.abortTransaction();
            session.endSession();
            res.status(400).send('Movie out of stock!');
            return;
        }
        let rental = new Rental({
            customer: {
                _id: customer._id,
                name: customer.name,
                isGold: customer.isGold,
                phone: customer.phone
            },
            movie: {
                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate,
                // genre: movie.genre.name
            },
        });
        await rental.save({session});
        movie.numberInStock--;
        await movie.save({session});

        await session.commitTransaction();
        session.endSession();
        res.status(201).send(rental);
    }
    catch(err){
        await session.abortTransaction();
        session.endSession();
        res.status(400).send(err.message);
    }
});

module.exports = router;