const express = require("express");
const path = require("path");
const app = express();
const userDB = require("./models/user");
const {connectDB} = require("./connection.js");
const userRoute = require("./routes/user.js");

try{
    connectDB("mongodb://127.0.0.1:27017/blogify").then(()=> console.log("Database Connected Successfully"));
}
catch{
    console.log("database connection error");
}

app.use(express.urlencoded({extended: true}));

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));
app.use("/user",userRoute);

app.get("/",(req,res)=>{
    return res.render("home");
});


app.listen(3000,()=> console.log("Server Started"));    