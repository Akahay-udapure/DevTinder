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
        const savedUser = await user.save();
        const token = await savedUser.getJWT();
        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000),
        });
        res.json({ message: "User registred successfully", data: savedUser });
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid email id");
        }
        const isPasswordCorrect = await user.validatePassword(password);
        if (isPasswordCorrect) {
            const token = await user.getJWT();
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000),
            });
            res.json({ message: "Login Successfull!!!", data: user });
        } else {
            throw new Error("Invalid password");
        }
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("Logout Successfully!!!");
});

module.exports = authRouter;
