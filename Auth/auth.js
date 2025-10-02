const secretKey = "P@$sW0rD3230"
const jwt = require('jsonwebtoken');

function createToken(payload){
    const token = jwt.sign(
        payload,secretKey);
    return token;
};


function verifyToken(req,res,next){
    const token = req.cookies.token;
    if(!token){
        return res.status(401).send("Access Denied");
    }

    jwt.verify(token,secretKey, (err,decoded) => {
        if(err){
            return res.status(400).send("INVALID TOKEN");
        }
        req.user = decoded;
    })
    
    
    next()
}

module.exports = {verifyToken,createToken};