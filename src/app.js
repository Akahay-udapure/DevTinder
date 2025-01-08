const express = require("express");

const app = express();

app.use("/", (req, res) => {
    console.log("Hello World from server");
});

app.listen(4500, () => {
    console.log("Server is running on port 4500");
});
