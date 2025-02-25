const profileRouter = require("express").Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditUserData } = require("../utils/validation");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditUserData(req)) {
            throw new Error("Invalid Edit Request");
        }

        const loggedInUser = req.user;

        Object.keys(req.body).forEach(
            (field) => (loggedInUser[field] = req.body[field]),
        );

        loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName}, your profile updated successfully!!`,
            data: loggedInUser,
        });
    } catch (error) {
        console.log(error);

        res.status(400).send("ERROR : " + error.message);
    }
});

profileRouter.patch("/profile/forgotPassword", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        if (req.body.password) {
            const passwordHash = await bcrypt.hash(req.body.password, 10);
            loggedInUser["password"] = passwordHash;
            loggedInUser.save();
            res.send("Password updation successfull!!!!");
        } else {
            res.status(400).send(
                "Something went wrong while updating password",
            );
        }
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});

module.exports = profileRouter;
