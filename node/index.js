const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const path = require("path");
const {Server} = require("socket.io");
const io = new Server(server);

io.on("connection",(socket)=>{
    console.log("new user joined", socket.id);

    socket.on("user-message",(message)=>{
        console.log(message);
        io.emit("msg",message);
    }); 

    socket.on("disconnect",()=>{
        console.log("user disconnected",socket.id);
    })
});

app.get("/",(req,res) => {
    res.sendFile(path.resolve(__dirname+'\\index.html'));
});

server.listen(3000, ()=>{
    console.log("Server started Successfully");
});


