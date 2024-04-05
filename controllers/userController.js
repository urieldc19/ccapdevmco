//const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');
const User = require('../database/models/User.js');

exports.registerUser = async (req, res) => {

    const errors = validationResult(req);

    if(errors.isEmpty())
    {
        const {email, username, password} = req.body;

        try {
            const accountemail = await User.findOne({email: email});
            const accountusername = await User.findOne({username: username});

            if (accountemail || accountusername) {
                req.flash('error_msg', 'User already exists. Please login.');
                res.redirect('/register');
            } 
            else 
            {
                const saltRounds = 10;

                
                    const newUser = 
                    {
                        username: username,
                        email: email,
                        password: password,
                        bio: "",
                        profilepic: "/images/fileuploads/user-prof-pic.png",
                        headerpic: "/images/fileuploads/user-cover-pic.png",
                        upvotedposts: [],
                        downvotedposts: []
                    };

                    await User.create(newUser);

                    req.session.username = username;
                    sessionuser = username;

                    console.log(req.session);

                    res.redirect('/');
                
            }
        } catch {
    
        }
    }
};

exports.loginUser = async (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) 
    {
        const { username, password } = req.body;
        //console.log("Username received:", username);
        try {
            const currUser = await User.findOne({username: username});
            
            if (currUser) {
                    if(password === currUser.password){
                        req.session.username = username;
                        sessionuser = username;
                        console.log(req.session);

                        res.redirect('/');
                    } else {
                        req.flash('error_msg', 'Incorrect password. Please try again.');
                        res.redirect('/login');
                    }

            } else {
                req.flash('error_msg', 'Username does not exist. Please register.');
                res.redirect('/login');
            }
        } catch {

        }
    } else {
      const messages = errors.array().map((item) => item.msg);
    
      req.flash('error_msg', messages.join(' '));
      res.redirect('/login');
    }
}

exports.signoutUser = (req, res) => {
    if(req.session) {
        req.session.destroy();
    }

    res.redirect('/');
};

exports.changePassword = async (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        const { username, password, currentPassword, newPassword, confirmPassword } = req.body;
        console.log("Username received:", username);
        try {
            const currUser = await User.findOne({username: req.session.username});
            
            if (currUser) {
                if (currentPassword === currUser.password) {
                    if (newPassword === confirmPassword && newPassword !== currUser.password) {
                        currUser.password = newPassword;
                        await currUser.save(); 

                        req.flash('success_msg', 'Password changed successfully');
                        res.redirect('/user/'+ currUser.username);
                    } else {
                        req.flash('error_msg', 'New password and confirm password do not match! Please try again.');
                        res.redirect('/editPass');
                    }
                } else {
                    req.flash('error_msg', 'Current password is incorrect. Please try again.');
                    res.redirect('/editPass');
                }
            } else {
                req.flash('error_msg', 'User not found!');
                res.redirect('/editPass');
            }
        } catch (err) {
            console.error(err);
            req.flash('error_msg', 'Something went wrong!');
            res.redirect('/editPass');
        }
    } else {
        const messages = errors.array().map((item) => item.msg);
        req.flash('error_msg', messages.join(' '));
        res.redirect('/editPass');
    }
};