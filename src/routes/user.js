const userRouter = require("express").Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const USER_DATA = "firstName lastName age gender about skills";

userRouter.get("/getAllUser", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

userRouter.get("/getUserByEmail", async (req, res) => {
    try {
        const user = await User.findOne({ emailId: req.body.emailId });
        res.send(user);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

userRouter.delete("/deleteUser", async (req, res) => {
    try {
        await User.findByIdAndDelete({ _id: req.body.userId });
        res.send("User Deleted Successfully");
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

userRouter.patch("/updateUserById/:userId", async (req, res) => {
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

userRouter.patch("/updateUserByEmail", async (req, res) => {
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

userRouter.get("/user/request/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connections = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", USER_DATA);

        if (connections) {
            res.json({
                message: "Data fetch successfully!!",
                data: connections,
            });
        } else {
            res.json({
                message: "No Connections found",
            });
        }
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connections = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" },
            ],
        })
            .populate("fromUserId", USER_DATA)
            .populate("toUserId", USER_DATA);

        const data = connections.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({ message: "Connection fetched successfully!!!", data });
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;

        const skip = (page - 1) * limit;
        console.log(skip);

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id },
            ],
        }).select("fromUserId toUserId");

        const hideUsers = new Set(); // this set datastructure include uniuque ids and remove duplicates

        connectionRequest.forEach((req) => {
            hideUsers.add(req.fromUserId.toString());
            hideUsers.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsers) } },
                {
                    _id: { $ne: loggedInUser._id },
                },
            ],
        })
            .select(USER_DATA)
            .skip(skip)
            .limit(limit);

        res.send(users);
    } catch (error) {
        res.status(400).send("ERROR :-" + error.message);
    }
});
module.exports = userRouter;
