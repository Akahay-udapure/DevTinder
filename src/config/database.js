require("dotenv").config({ path: "./src/.env" });
const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(process.env.CONNECTION_STRING);
};

module.exports = connectDB;
