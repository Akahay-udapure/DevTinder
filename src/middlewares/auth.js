const adminAuth = (req, res, next) => {
    console.log("Admin auth is getting checked");
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if (!isAdminAuthorized) res.status(401).send("Unauthorized admin access");
    else next();
};

const userAuth = (req, res, next) => {
    console.log("User auth is getting checked");
    const token = "xyz";
    const isUserAuthorized = token === "xyz";
    if (!isUserAuthorized) res.status(401).send("Unauthorized user access");
    else next();
};

module.exports = { adminAuth, userAuth };
