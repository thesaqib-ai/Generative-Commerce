const jwt = require('jsonwebtoken');
const config = require('config');

function authorize(req,res,next){
    const token = req.header('x-auth-token');
    if(!token) {
        res.status(401).send('Access denied, no token provided!');
        return;
    }
    try{
        const payload = jwt.verify(token, config.get('jwtPrivateKey'));
        console.log(payload);
        req.user = payload;
        next();
    }
    catch(err){
        res.status(400).send('Access denied, Invalid token provided!');
    }
}

module.exports = authorize;