const express = require("express");

const app = express();

app.use(
    "/user",
    (req, res, next) => {
        console.log("response1 log");
        // res.send("Response1");
        next();
    },
    (req, res, next) => {
        console.log("response2 log");
        // res.send("Response2");
        next();
    },
    (req, res, next) => {
        console.log("response3 log");
        // res.send("Response3");
        next();
    },
    (req, res, next) => {
        console.log("response4 log");
        res.send("Response4");
        // next();
    },
);

app.listen(4500, () => {
    console.log("Server is running on port 4500");
});
