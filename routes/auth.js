const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const {registerValidation, loginValidation, signoutUser} = require('../validators.js');
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

router.post('/register', isPub, registerValidation, userController.registerUser);
router.post('/login', isPub, loginValidation, userController.loginUser);
router.get('/signout', isPriv, userController.signoutUser);

module.exports = router;