const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email: {type: String},
    password: {type: String},
    displayname: {type: String},
    agreement: {type:String},
    passwordResetToken: {String},
    passwordResetExpires: {Date},
    emailVerificationToken: {type: String},
    emailVerified: {Boolean},
    facebook: {type: String},
    googleId: {type: String},
    gender: {type: String},

    profile: {
        fname: String,
        lname: String,
        name: String,
        gender: String,
        location: String,
        website: String,
        picture: String,
        role: String
      }
})


module.exports = User = mongoose.model("user", userSchema);