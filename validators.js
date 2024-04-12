const { body } = require('express-validator');

const registerValidation = [
    body('email').not().isEmpty().withMessage("Email is required.")
    .isEmail().withMessage("Please provide a valid email."),
    body('username').not().isEmpty().withMessage("Username is required."),

    body('confirmpassword').isLength({min:0}).withMessage("")
    .custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error ("Passwords must match.");
        }
        return true;
    })
];

const loginValidation = [
    body('username').not().isEmpty().withMessage("Username is required."),
    body('password').not().isEmpty().withMessage("Password is required.")
];

const securityValidation = [

    body('currentPassword').not().isEmpty().withMessage("Current password is required."),
    body('newPassword').not().isEmpty().withMessage("New password is required."),
    body('confirmPassword').isLength({min:0}).withMessage("Confirm password is required")
    .custom((value, {req}) => {
        if (value !== req.body.newPassword) {
            throw new Error ("Passwords must match.");
        }
        return true;
    })
];


module.exports = {registerValidation, loginValidation, securityValidation};
