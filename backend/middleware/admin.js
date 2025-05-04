async function checkAdmin(req,res,next){
    if(req.user.isAdmin){
        next();
        return;
    }
    res.status(403).send("User don't have access to the resource!")
}

module.exports = checkAdmin;