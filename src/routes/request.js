const requestRouter = require("express").Router();
const ConnectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const { isValidObjectId } = require("mongoose");

requestRouter.post(
    "/request/send/:status/:toUserId",
    userAuth,
    async (req, res) => {
        try {
            const fromUserId = req.user._id;
            const toUserId = req.params.toUserId;
            const status = req.params.status;

            const allowStatus = ["ignored", "interested"];
            if (!allowStatus.includes(status)) {
                return res.status(400).json({
                    message: "invalid status type : " + status,
                });
            }
            if (!isValidObjectId(toUserId)) {
                return res.status(400).json({
                    message: "Invalid user id",
                });
            }
            const toUser = await User.findById(toUserId);
            if (!toUser) {
                return res.status(400).json({
                    message: "User does not exist",
                });
            }

            const connectionRequestExist = await ConnectionRequest.findOne({
                $or: [
                    { fromUserId, toUserId },
                    { fromUserId: toUserId, toUserId: fromUserId },
                ],
            });

            if (connectionRequestExist) {
                return res.status(400).json({
                    message: "Connection request already exist!!!",
                });
            }
            const connection = new ConnectionRequest({
                fromUserId,
                toUserId,
                status,
            });

            const data = await connection.save();
            const message =
                status == "interested"
                    ? req.user.firstName +
                      " is interested in " +
                      toUser.firstName
                    : req.user.firstName +
                      " is not interested in " +
                      toUser.firstName;
            res.json({
                message: message,
                data,
            });
        } catch (error) {
            res.status(400).send("ERROR : " + error.message);
        }
    },
);

requestRouter.post(
    "/request/review/:status/:requestId",
    userAuth,
    async (req, res) => {
        try {
            const loggedInUser = req.user;
            const { status, requestId } = req.params;
            const allowedStatus = ["accepted", "rejected"];
            if (!allowedStatus.includes(status)) {
                return res
                    .status(400)
                    .json({ message: "Invalid status : " + status });
            }
            if (!isValidObjectId(requestId)) {
                return res
                    .status(400)
                    .json({ message: "Invalid requestId !!!" });
            }

            const connection = await ConnectionRequest.findOne({
                _id: requestId,
                toUserId: loggedInUser._id,
                status: "interested",
            });

            if (!connection) {
                return res
                    .status(400)
                    .json({ message: "Connection request not found!!" });
            }

            connection.status = status;
            const data = await connection.save();
            res.json({
                message: `Connection request ${status} successfully`,
                data: data,
            });
        } catch (error) {
            res.status(400).send("ERROR : " + error.message);
        }
    },
);

module.exports = requestRouter;
