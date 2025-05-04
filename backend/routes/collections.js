const express = require('express');
const router = express.Router();
const { Collection, validateCollection } = require('../models/collection');
const authorize = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', async (req, res, next)=>{
    const collections = await Collection.find().sort('name');
    res.send(collections);
});

router.post('/', authorize, async (req,res)=>{
    const result = validateCollection(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    let collection = new Collection({
        name: req.body.name
    });
    try{
        collection = await collection.save();
        res.status(201).send(collection);
    }
    catch(err){
         return res.status(400).send(Object.values(err.errors).map(error => error.message));
    }
});

router.get('/:id', async (req,res)=>{
    const collection = await Collection.findById(req.params.id);
    if(!collection){
        res.status(404).send(`collection with id: ${req.params.id} not found`);
        return;
    }
    res.status(200).send(`The collection has been found ${collection}`);   
});

router.put('/:id', authorize, async (req,res)=>{
    const { error} = validateCollection(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }
    try{
        const collection = await Collection.findByIdAndUpdate(req.params.id,{ name: req.body.name},{new:true, runValidators: true});
        if(!collection){
            res.status(404).send(`collection with id: ${req.params.id} not found`);
            return;
        }
        res.status(200).send(`The collection has been updated with the name: ${collection.name}`);
    }
    catch(err){
        return res.status(400).send(Object.values(err.errors).map(error => error.message));
   }
});

router.delete('/:id', [authorize,admin], async (req,res)=>{
    const collection = await Collection.findByIdAndDelete(req.params.id);
    if(!collection){
        res.status(404).send(`collection with id: ${req.params.id} not found`);
        return;
    }
    res.status(200).send(`The collection has been deleted successfully! ${collection}`);
});

module.exports = router;