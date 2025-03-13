require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const cors = require("cors");

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Ensure PATCH is included
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "X-Requested-With",
            "Access-Control-Allow-Credentials",
        ],
    }),
);

app.use(express.json()); // express middleware to read Json data which is comming in request body
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
    .then(() => {
        console.log("Connection established successfully....");
        app.listen(process.env.PORT, () => {
            console.log("Server is running on port " + process.env.PORT);
        });
    })
    .catch((error) => {
        console.log(error);
        console.log("Connection cannot connected....");
    });
