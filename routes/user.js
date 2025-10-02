const express = require("express");
const router = express.Router();
const userDB = require("../models/user");
const {createHmac, randomBytes} = require('crypto');
const {createToken, verifyToken} = require("../Auth/auth")

router.get("/signup", (req,res)=>{
    return res.render("signup");
});

router.get("/signin", (req,res)=>{
    return res.render("signin")
});

router.post("/signin",async (req,res)=>{ 

    const {email,password} = req.body;
    var user;
    try{
        user = await userDB.matchPassword(email,password);
        const payload = {
            "name": user._doc.fullName,
            "email":user._doc.email,
            "role":user._doc.role,
            "id":user._doc._id
        };
        const token = createToken(payload);
        res.cookie('token',token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24*60*60*1000 
        });
    }
    catch(err){
        return res.redirect("/user/signin");
    };

    return res.redirect("/");   
    
});

router.post("/signup",async (req,res)=>{
    const {fullName,email,password} = req.body;
    const user = await userDB.create({
        fullName,
        email,
        password
    });
    res.user = user;
    res.redirect("/user/signin");
})

module.exports = router;
