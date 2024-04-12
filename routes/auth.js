const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const {registerValidation, loginValidation, signoutUser, securityValidation} = require('../validators.js');
const {isPub, isPriv} = require('../middlewares/checkAuth.js');


router.get('/login',isPub, (req, res) => {
    res.render('forum-login', {
        pageTitle: 'Log In',
    });
});

router.get('/register', isPub, (req, res) => {
    res.render('forum-register', {
        pageTitle: 'Registration'
    });
}); 

router.get('/editPass', isPriv, (req, res) => {
    res.render('forum-security-settings', {
        pageTitle: 'Security Setting'
    });
}); 

router.get('/submiteditprofile', isPriv, (req, res) => {
    res.render('forum-editprofile', {
        pageTitle: 'Edit Profile',
    });
});



router.post('/register', isPub, registerValidation, userController.registerUser);
router.post('/login', isPub, loginValidation, userController.loginUser);
router.get('/signout', isPriv, userController.signoutUser);
router.post('/editPass', isPriv, securityValidation, userController.changePassword);
router.post('/submiteditprofile', isPriv, userController.editProfile);

module.exports = router;