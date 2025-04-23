const winston = require('winston');
require('express-async-errors');
const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const auth = require('./routes/auth');
const carts = require('./routes/carts');
const collections = require('./routes/collections');
const orders = require('./routes/orders');
const products = require('./routes/products');
const reviews = require('./routes/reviews');
const wishlists = require('./routes/wishlists');
const home = require('./routes/home');
const users = require('./routes/users');
// const startupDebugger = require('debug')('app:startup')
// const dbDebugger = require('debug')('app:db')
const debug = require('debug')('app:startup')
const app = express();
const config = require('config');
const logError = require('./middleware/error');

winston.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'logfile.log' })  // Correct Syntax
    ]
});

module.exports = logger;

app.set('view engine','pug');
app.set('views','./views');
require('./startup/prod')(app);

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use('/api/carts',carts);
app.use('/api/collections',collections);
app.use('/api/orders',orders);
app.use('/api/products',products);
app.use('/api/reviews',reviews);
app.use('/api/wishlists',wishlists);
app.use('/api/users',users);
app.use('/api/auth',auth)
app.use('/',home);
app.use(logError);

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

const port = process.env.PORT || 3010;
app.listen(port,()=>{
    console.log(`Server is listening on port ${port}....`);
});

mongoose.connect('mongodb://localhost:27017/Generative-Commerce?replicaSet=rs0')
    .then(()=> console.log('Mongodb connected...'))
    .catch(err=>console.error('Cannot connect to mongodb...'));
    