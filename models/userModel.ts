import { verify } from "crypto";
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    fname: {
        type: String,
        required: [true, "Please provide a First Name"],
    },
    lname: {
        type: String,
        required: [true, "Please provide a Last Name"],
    },
    phone: {
        type: Number,
        required: [true, "Please provide a Valid Phone Number"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Please provide a valid Email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    username: {
        type: String,
        unique: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    forgetPasswordToken: String,
    forgetPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
});

// Pre-save middleware to generate a unique username
userSchema.pre('save', async function(next) {
    if (!this.isModified('fname') && !this.isModified('lname')) {
        return next();
    }

    let username = `${this.fname.toLowerCase()}${this.lname.toLowerCase()}`;
    let userExists = await mongoose.models.users.findOne({ username });
    let suffix = 0;

    while (userExists) {
        suffix = Math.floor(Math.random() * 10000);
        username = `${this.fname.toLowerCase()}${this.lname.toLowerCase()}${suffix}`;
        userExists = await mongoose.models.users.findOne({ username });
    }

    this.username = username;
    next();
});

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
