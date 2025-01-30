const mongoose = require("mongoose");
const validator = require("validator");
const userModel = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
        },
        emailId: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            validate: (value) => {
                if (!validator.isEmail(value)) {
                    throw new Error("Invalid email address: " + value);
                }
            },
        },
        password: {
            type: String,
            required: true,
            validate: (value) => {
                if (!validator.isStrongPassword(value)) {
                    throw new Error("Please enter strong password: " + value);
                }
            },
        },
        age: {
            type: Number,
            min: 18,
        },
        gender: {
            type: String,
            validate: (value) => {
                if (!["male", "female", "others"].includes(value)) {
                    throw new Error("Gender data is not valid");
                }
            },
        },
        photoUrl: {
            type: String,
            default: "dd",
        },
        about: {
            type: String,
        },
        skills: {
            type: [String],
        },
    },
    {
        timestamps: true,
    },
);

const User = mongoose.model("User", userModel);

module.exports = User;
