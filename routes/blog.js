const express = require('express');
const router = express.Router()
const {verifyToken} = require("../Auth/auth.js")
const blogDB = require("../models/blog.js");
const multer = require('multer');


router.get("/",verifyToken,(req,res)=>{
    return res.render("addBlog");
});

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,'blog_images/');
    },
    filename: (req,file,cb)=>{
        cb(null,Date.now()+"_"+file.originalname);
    }
});

const upload = multer({storage:storage});

router.post("/",upload.single('inputFile'),async (req,res)=>{
    const {title,textArea,inputFile} = req.body;
    
    const blog = await blogDB.create({
        title: title,
        image_url: req.file.originalname,
        content: textArea
    })

    return res.redirect("/");
    
});

module.exports = router;