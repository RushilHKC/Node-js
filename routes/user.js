const express = require("express");
const router = express.Router();
const userDB = require("../models/user");
const {createHmac, randomBytes} = require('crypto');
const {createToken} = require("../Auth/auth")

router.get("/signup", (req,res)=>{
    return res.render("signup");
});

router.get("/signin", (req,res)=>{
    console.log("Hello");``
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
        };
        const token = createToken(payload);
        res.header('Authorization',`Bearer ${token}`);
    }
    catch(err){
        return res.redirect("/user/signin");
    };

    return res.render("home",{
        User: user
    });
    
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
