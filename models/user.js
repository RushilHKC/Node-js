const mongoose = require("mongoose");
const {createHmac, randomBytes} = require('crypto');

const userSchema = new mongoose.Schema({
    fullName : {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt : {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageURL : {
        type: String,
        default: "/images/default.jpg",
    },
    role: {
        type: String,
        enum: ["USER","ADMIN"],
        default: "USER",
    }
},{timestamps: true});


userSchema.pre('save', function(next) {

    const user = this;

    if(!user.isModified('password')) return;

    const salt = randomBytes(16).toString();
    const  hashedPass = createHmac("sha256",salt).update(user.password).digest("hex");


    user.fullName = this.fullName;
    user.email = this.email;
    user.salt = salt;
    user.password = hashedPass;

    next();

});

userSchema.static("matchPassword",async function(email,password){
    const user = await this.findOne({email});
    if(!user) return resizeBy.status(404).send("user not found");

    const salt = user.salt;
    const hashedPassword = user.password;
    const userProvidedHash = createHmac("sha256",salt).update(password).digest('hex');

    if(hashedPassword != userProvidedHash) return resizeBy.status(404).send("Incorrect Password");
    console.log();

    return {...user,slat:undefined,password:undefined};
});

const userModel = mongoose.model('user',userSchema);


module.exports = userModel;