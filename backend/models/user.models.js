const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    assistantName: {
        type: String,
    },
    assistantImage: {
        type: String,
    },
    password:{
        type:String,
        required:true
    },
    history:[ {
        type: String,
    }]
}, { timestamps: true })

const User =mongoose.model("User", userSchema)
module.exports = User;