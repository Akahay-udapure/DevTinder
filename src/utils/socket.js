const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");

const getSecretRoomId = (userId, targetUserId) => {
    return crypto
        .createHash("sha256")
        .update([userId, targetUserId].sort().join("$"))
        .digest("hex");
};

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
            const room = getSecretRoomId(userId, targetUserId); // Create a room for the users to chat
            console.log(firstName, "joined the chat room: ", room);
            socket.join(room);
        });

        socket.on(
            "sendMessage",
            async ({ firstName, lastName, userId, targetUserId, text }) => {
                try {
                    const room = getSecretRoomId(userId, targetUserId); // Create a room for the users to chat
                    console.log(firstName, "sent a message to room: ", room);

                    let chat = await Chat.findOne({
                        participants: { $all: [userId, targetUserId] },
                    });

                    if (!chat) {
                        chat = new Chat({
                            participants: [userId, targetUserId],
                            messages: [],
                        });
                    }
                    chat.messages.push({ senderId: userId, text });
                    await chat.save();
                    io.to(room).emit("messageReceived", {
                        firstName,
                        lastName,
                        text,
                        time: new Date(),
                    });
                } catch (err) {
                    console.log(err);
                }
            },
        );

        socket.on("disconnect", () => {});
    });
};

module.exports = initializeSocket;
