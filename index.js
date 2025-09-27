const express = require("express");
const path = require("path");
const app = express();
const userDB = require("./models/user");
const {connectDB} = require("./connection.js");
const userRoute = require("./routes/user.js");
const blogRouter = require("./routes/blog.js");
const {verifyToken} = require("./Auth/auth.js")
const parser = require('cookie-parser');

try{
    connectDB("mongodb://127.0.0.1:27017/blogify").then(()=> console.log("Database Connected Successfully"));
}
catch{
    console.log("database connection error");
}

app.use(express.urlencoded({extended: true}));
app.use(parser())

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));
app.use("/user",userRoute);
app.use("/addBlog",blogRouter);

app.get("/",verifyToken,(req,res)=>{
    return res.render("home");
});

app.listen(8000,()=> console.log("Server Started"));    