const express = require('express');
const router = express.Router();
const { Genre, validateGenre } = require('../models/genre');
const authorize = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', async (req,res)=>{
    const genres = await Genre.find().sort('name');
    res.send(genres);
    }
);

router.post('/', authorize, async (req,res)=>{
    const result = validateGenre(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    let genre = new Genre({
        name: req.body.name
    });
    try{
        genre = await genre.save();
        res.status(201).send(genre);
    }
    catch(err){
         return res.status(400).send(Object.values(err.errors).map(error => error.message));
    }
});

router.get('/:id', async (req,res)=>{
    const genre = await Genre.findById(req.params.id);
    if(!genre){
        res.status(404).send(`genre with id: ${req.params.id} not found`);
        return;
    }
    res.status(200).send(`The genre has been found ${genre}`);   
});

router.put('/:id', authorize, async (req,res)=>{
    const { error} = validateGenre(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }
    try{
        const genre = await Genre.findByIdAndUpdate(req.params.id,{ name: req.body.name},{new:true, runValidators: true});
        if(!genre){
            res.status(404).send(`genre with id: ${req.params.id} not found`);
            return;
        }
        res.status(200).send(`The genre has been updated with the name: ${genre.name}`);
    }
    catch(err){
        return res.status(400).send(Object.values(err.errors).map(error => error.message));
   }
});

router.delete('/:id', [authorize,admin], async (req,res)=>{
    const genre = await Genre.findByIdAndDelete(req.params.id);
    if(!genre){
        res.status(404).send(`genre with id: ${req.params.id} not found`);
        return;
    }
    res.status(200).send(`The genre has been deleted successfully! ${genre}`);
});

module.exports = router;