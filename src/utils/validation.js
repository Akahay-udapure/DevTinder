const validator = require("validator");

const validateSignupData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Name is not valid");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password");
    }
};

const validateEditUserData = (req) => {
    const allowedEditField = [
        "firstName",
        "lastName",
        "age",
        "gender",
        "photoUrl",
        "about",
        "skills",
    ];

    if (req.body.skills.length > 10) {
        throw new Error("Skills can not be more than 10");
    }

    const isAllowFieldToEdit = Object.keys(req.body).every((field) =>
        allowedEditField.includes(field),
    );

    return isAllowFieldToEdit;
};

module.exports = { validateSignupData, validateEditUserData };
