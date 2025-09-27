const secretKey = "P@$sW0rD3230"
const jwt = require('jsonwebtoken');

function createToken(payload){
    const token = jwt.sign(
        payload,secretKey);
    return token;
};


function verifyToken(req,res,next){
    const header = (req.headers.Authorization);
    if(!header){
        res.redirect('/user/signin');
    }
    const token = header.split(' ')[1];
    if(!token){
        res.status(401).send("Access token required");
    }
    jwt.verify(token, secretKey, (err,decoded) => {
        if(err){
            return res.send('Token is invalid');
        }
    });

    next()
};

module.exports = {verifyToken,createToken};