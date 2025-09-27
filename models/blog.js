const mongoose = require("mongoose");

const blogDB = new mongoose.Schema({
    title: {
        type: String,
        required : true,
    },
    image_url : {
        type: String,
        required : true,
    },
    content : {
        type: String,
        required : true,
    },
});