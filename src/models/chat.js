const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
); // thia schema for storing messages and sender id of the user

const chatSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    ],
    messages: [messageSchema],
    // Add the following code snippet to the chatSchema object
}); /// this schema for creating room for chat between two users

const Chat = mongoose.model("Chat", chatSchema);
module.exports = { Chat };
