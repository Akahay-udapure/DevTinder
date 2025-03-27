const chatRouter = require("express").Router();
const { userAuth } = require("../middlewares/auth");
const { Chat } = require("../models/chat");

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
    try {
        const targetUserId = req?.params?.targetUserId;
        const userId = req.user._id;
        let chats = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
        }).populate({
            path: "messages.senderId",
            select: "firstName lastName",
        });
        if (!chats) {
            chats = new Chat({
                participants: [userId, targetUserId],
                messages: [],
            });
            await chats.save();
        }
        res.json(chats);
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});

module.exports = chatRouter;
