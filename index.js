const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const courses = require('./routes/courses');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const genres = require('./routes/genres');
const rentals = require('./routes/rentals');
const home = require('./routes/home');
const users = require('./routes/users');
const auth = require('./routes/auth');
// const startupDebugger = require('debug')('app:startup')
// const dbDebugger = require('debug')('app:db')
const debug = require('debug')('app:startup')
const app = express();
const config = require('config');

app.set('view engine','pug');
app.set('views','./views');
require('./startup/prod')(app);

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(helmet());
app.use('/api/courses',courses);
app.use('/api/customers',customers);
app.use('/api/movies',movies);
app.use('/api/genres',genres);
app.use('/api/rentals',rentals);
app.use('/api/users',users);
app.use('/api/auth',auth)
app.use('/',home);

if(!config.get('jwtPrivateKey')){
    console.error('FATAL ERROR: jwtPrivateKey is not defined');
    process.exit(1);
}

// app.use(logger);
// app.use(auth);

// console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

// console.log('Application Name: '+ config.get('name'));
// console.log('Mail Server: '+ config.get('mail.host'));
// console.log('Mail Password: '+ config.get('mail.password'));



if(process.env.NODE_ENV === 'development'){
    app.use(morgan('tiny'));
    debug('Morgan enabled...');
}

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Server is listening on port ${port}....`);
});

mongoose.connect('mongodb://localhost:27017/vidly?replicaSet=rs0')
    .then(()=> console.log('Mongodb connected...'))
    .catch(err=>console.error('Cannot connect to mongodb...'));
    