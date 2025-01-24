const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://akshayudapure:InoQ3DTwRhdKdZE0@namastenodejs.hqam4.mongodb.net/Devtinder",
    );
};

module.exports = connectDB;
