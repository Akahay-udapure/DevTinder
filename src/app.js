const express = require("express");
const { userAuth, adminAuth } = require("./middlewares/auth");

const app = express();

app.get("/user/data", userAuth, (req, res) => {
    res.send("User Data send");
});

app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req, res) => {
    res.send("Get All Admin Data");
});

app.get("/admin/deleteAdmin", (req, res) => {
    res.send("delete admin data");
});

app.listen(4500, () => {
    console.log("Server is running on port 4500");
});
