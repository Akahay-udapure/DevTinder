const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
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
            default:
                "http://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-male-user-profile-vector-illustration-isolated-background-man-profile-sign-business-concept_157943-38764.jpg?semt=ais_hybrid",
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

userSchema.index({ firstName: 1, lastName: 1 });

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790");
    return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const hashPassword = user.password;
    const isPasswordCorrect = await bcrypt.compare(
        passwordInputByUser,
        hashPassword,
    );
    return isPasswordCorrect;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
