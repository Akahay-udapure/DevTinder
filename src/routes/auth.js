const authRouter = require("express").Router();
const { validateSignupData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid Crenttials");
        }
        const isPasswordCorrect = await user.validatePassword(password);
        if (isPasswordCorrect) {
            const token = await user.getJWT();
            res.cookie("token", token);
            res.send("Login Successfull!!!");
        } else {
            throw new Error("Invalid Crenttials");
        }
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});

module.exports = authRouter;
