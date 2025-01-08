const express = require("express");

const app = express();

app.get("/user", (req, res) => {
    res.send("hello hello ");
});

//this will match all the HTTP method API calls to /test
app.use("/test", (req, res) => {
    res.send("test hello ");
});

// here the  order of the routes matters

app.listen(4500, () => {
    console.log("Server is running on port 4500");
});
