const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name']
    },
    email: {
        type: String,
        unique: true, // unique index and unique constraint
        required: [true, 'Please enter your email'],
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email']
    },
    role : {
        type: String,
        required: true,
        default: 'NORMAL',
    },
    password: {
        type: String,
        require: [true, 'Please enter your password'],
        minlength: 8,
        select: false // not return password when query
    },
},
{timestamps: true}
);

// userSchema.pre("save", async function(next) {
//     if (!this.isModified("password")) return next();
  
//     this.password = await bcrypt.hash(this.password, 12);
//     this.passwordConfirm = undefined;
//     next();
//   });
  
//   userSchema.methods.correctPassword = async function(
//     candidatePassword,
//     userPassword
//   ) {
//     return await bcrypt.compare(candidatePassword, userPassword);
//   };

const user = mongoose.model("user", userSchema);

module.exports = user;