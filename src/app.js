const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json()); // express middleware to read Json data which is comming in request body

app.post("/signup", async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.status(200).send("User registred successfully");
    } catch (error) {
        res.status(400).send("Error while saving the user " + error.message);
    }
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
