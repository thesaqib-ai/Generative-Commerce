const express = require('express')
const router = express.Router();
const { Customer, validateCustomer} = require('../models/customer');

router.get('/', async (req,res)=>{
    const customers = await Customer.find();
    res.status(200).send(customers);
});

router.get('/:id', async (req,res)=>{
    const customer = await Customer.findById(req.params.id);
    if(!customer){
        res.status(404).send(`Customer with id: ${req.params.id} doesn't exists!`);
        return;
    }
    res.status(200).send(customer);
});

router.post('/', async (req,res)=>{
    const result = validateCustomer(req.body);
    if(result.error){
        res.status(401).send(result.error.details[0].message);
        return;
    }
    let customer = new Customer(req.body);
    try{
        customer = await customer.save();
        res.status(200).send(customer);
    }
    catch(err){
        res.status(401).send(Object.values(err.errors).map(error => error.message));
    }
});

router.put('/:id', async (req,res)=>{
    const result = validateCustomer(req.body);
    if(result.error){
        res.status(401).send(result.error.details[0].message);
        return;
    }
    try{
        const customer = await Customer.findByIdAndUpdate(
            req.params.id,req.body,{new: true, runValidators: true}
        )
        if(!customer){
            res.status(404).send(`Customer with id: ${req.params.id} doesn't exists!`);
            return;
        }
        res.status(201).send(`Customer record with id: ${req.params.id} has been updated!\n${customer}`)
    }catch(err){
        res.status(401).send(Object.values(err.errors).map(error => error.message));
    }
});

router.delete('/:id', async (req,res)=>{
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if(!customer){
        res.status(404).send(`Customer with id: ${req.params.id} doesn't exists!`);
        return;
    }
    res.status(201).send(`Customer with id: ${req.params.id} has been deleted!`)
});

module.exports = router;