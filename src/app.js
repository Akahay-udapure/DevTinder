const express = require("express");

const app = express();

app.use("/", (req, res) => {
    res.send("Hello World from server");
});

app.use("/hello", (req, res) => {
    res.send("hello hello ");
});

app.use("/test", (req, res) => {
    res.send("test hello ");
});

// here the  order of the routes matters

app.listen(4500, () => {
    console.log("Server is running on port 4500");
});
