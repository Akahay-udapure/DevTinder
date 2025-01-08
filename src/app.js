const express = require("express");

const app = express();

app.get("/user/:userId/:name", (req, res) => {
    res.send("hello hello ");
});

app.listen(4500, () => {
    console.log("Server is running on port 4500");
});
