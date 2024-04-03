const bcrypt = require('bcrypt');
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
                res.redirect('/login');
            } 
            else 
            {
                const saltRounds = 10;

                bcrypt.hash(password, saltRounds, async (err, hashed) => 
                {
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
                });
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