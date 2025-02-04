const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const app = express();

app.use(express.json()); // express middleware to read Json data which is comming in request body

app.post("/signup", async (req, res) => {
    try {
        validateSignupData(req);
        const { firstName, lastName, emailId, password } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });
        await user.save();
        res.status(200).send("User registred successfully");
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});

app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const isUserExit = await User.findOne({ emailId: emailId });
        if (!isUserExit) {
            throw new Error("Invalid Crenttials");
        }
        const isPasswordCorrect = await bcrypt.compare(
            password,
            isUserExit.password,
        );
        if (!isPasswordCorrect) {
            throw new Error("Invalid Crenttials");
        }
        res.send("Login Successfull!!!");
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});

app.get("/getAllUser", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

app.get("/getUserByEmail", async (req, res) => {
    try {
        const user = await User.findOne({ emailId: req.body.emailId });
        res.send(user);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

app.delete("/deleteUser", async (req, res) => {
    try {
        await User.findByIdAndDelete({ _id: req.body.userId });
        res.send("User Deleted Successfully");
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

app.patch("/updateUserById/:userId", async (req, res) => {
    try {
        const ALLOWED_UPDATES = [
            "about",
            "skills",
            "age",
            "photoUrl",
            "gender",
            "firstName",
            "lastName",
        ];
        const isUpdatesAllowd = Object.keys(req.body).every((k) =>
            ALLOWED_UPDATES.includes(k),
        );
        if (!isUpdatesAllowd) {
            throw new Error("unknow data not allowed to update");
        }
        if (req.body.skills.length > 10) {
            throw new Error("Skills can not be more than 10");
        }
        await User.findByIdAndUpdate({ _id: req.params.userId }, req.body, {
            returnDocument: "after",
            runValidators: true,
        }); // here by default options for returnDocument is before
        res.send("User Updated Successfully");
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

app.patch("/updateUserByEmail", async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { emailId: req.body.emailId },
            req.body,
            {
                returnDocument: "after",
                runValidators: true,
            },
        ); // here by default options for returnDocument is before
        res.send("User Updated Successfully");
    } catch (error) {
        res.status(400).send({ message: error.message });
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
