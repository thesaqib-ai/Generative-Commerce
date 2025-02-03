const express = require('express');
const router = express.Router();
const { Course, validateCourse } = require('../models/course');
const authorize = require('../middleware/auth');

router.get('/', async (req,res)=>{
    const courses = await Course.find().sort('name');
    res.send(courses);
    }
);

router.post('/', authorize, async (req,res)=>{
    const result = validateCourse(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    let course = new Course({
        name: req.body.name
    });
    try{
        course = await course.save();
        res.status(201).send(course)
    }
    catch(err){
         return res.status(400).send(Object.values(err.errors).map(error => error.message));
    }
});

router.get('/:id', async (req,res)=>{
    const course = await Course.findById(req.params.id);
    if(!course){
        res.status(404).send(`Course with id: ${req.params.id} not found`);
        return;
    }
    res.status(200).send(`The course has been found ${course}`);   
});

router.put('/:id', authorize, async (req,res)=>{
    const { error} = validateCourse(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }
    try{
        const course = await Course.findByIdAndUpdate(req.params.id,{ name: req.body.name},{new:true, runValidators: true});
        if(!course){
            res.status(404).send(`Course with id: ${req.params.id} not found`);
            return;
        }
        res.status(200).send(`The course has been updated with the name: ${course.name}`);
    }
    catch(err){
        return res.status(400).send(Object.values(err.errors).map(error => error.message));
   }
});

router.delete('/:id', authorize, async (req,res)=>{
    const course = await Course.findByIdAndDelete(req.params.id);
    if(!course){
        res.status(404).send(`Course with id: ${req.params.id} not found`);
        return;
    }
    res.status(200).send(`The course has been deleted successfully! ${course}`);
});

module.exports = router;