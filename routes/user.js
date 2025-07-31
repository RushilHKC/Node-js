const express = require("express");
const router = express.Router();
const userDB = require("../models/user");
const {createHmac, randomBytes} = require('crypto');

router.get("/signup", (req,res)=>{
    return res.render("signup");
});

router.get("/signin", (req,res)=>{
    return res.render("signin")
})

router.post("/signin",async (req,res)=>{ 

    const {email,password} = req.body;

    const user = userDB.matchPassword(email,password);

    console.log("User : ",user);

    return res.redirect("/");
    
})

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
