const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
    const user = new User({
        firstName: "Akshay",
        lastName: "Udapure",
        emailId: "akshay@gmail.com",
        password: "aws@123",
        age: 26,
        gender: "Male",
    });

    await user.save();
    res.status(200).send("User registred successfully");
});

connectDB()
    .then(() => {
        console.log("Connection established successfully....");
        app.listen(4500, () => {
            console.log("Server is running on port 4500");
        });
    })
    .catch(() => {
        console.log("Connection cannot connected....");
    });
