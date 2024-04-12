//const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');
const User = require('../database/models/User.js');
const Post = require('../database/models/Post.js');
const bcrypt = require('bcrypt');

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
                const hash = await bcrypt.hash(password, saltRounds);

                    const newUser = 
                    {
                        username: username,
                        email: email,
                        password: hash,
                        bio: "",
                        profilepic: "/images/fileuploads/user-prof-pic.png",
                        headerpic: "/images/fileuploads/user-cover-pic.png",
                        upvotedposts: [],
                        downvotedposts: []
                    };

                    await User.create(newUser);

                    req.session.username = username;
                    sessionuser = username;

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
        
        try {
            const currUser = await User.findOne({username: username});
            
            if (currUser) {

                    bcrypt.compare(req.body.password, currUser.password, function(err, results){
                        
                        if(err){
                            res.redirect('/');
                        }

                        if (results) {
                            req.session.username = username;
                            sessionuser = username;

                            res.redirect('/');
                        } else {
                            req.flash('error_msg', 'Incorrect password. Please try again.');
                            res.redirect('/login');
                        }
                    })

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
        const {currentPassword, newPassword, confirmPassword } = req.body;
        
        try {
            const currUser = await User.findOne({username: req.session.username});
            
            if (currUser) {

                bcrypt.compare(currentPassword, currUser.password, async function(err, results){

                    if (results) {
                        
                        if (newPassword === confirmPassword) {

                            bcrypt.compare(newPassword, currUser.password, async function(err, results2){
        
                                if (results2) {
                                    
                                    const saltRounds = 10;
                                    const hash2 = await bcrypt.hash(newPassword, saltRounds);

                                    await User.updateOne({ username: currUser.username }, { $set: {password: hash2}});
                                    await currUser.save();
                                    
                                    res.redirect('/user/'+ currUser.username);
                                } else {
                                    req.flash('error_msg', 'Password is the same as previous. Please try again.');
                                    res.redirect('/login');
                                }
                            })

                        } else {
                            req.flash('error_msg', 'New password and confirm password do not match! Please try again.');
                            res.redirect('/editPass');
                        }

                    } else {
                        req.flash('error_msg', 'Current password is incorrect. Please try again.');
                        res.redirect('/editPass');
                    }
                })
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

// EDIT PROFILE

exports.editProfile = async (req, res) => {
    
    const { email, bio} = req.body;
    const path = require('path');

    try {
        const currUser = await User.findOne({username: req.session.username});

        if(currUser) {

             // Handle file uploads
             if (req.files && req.files.profilepic) {
                req.files.profilepic.mv(path.resolve(__dirname, '../public/images/fileuploads', req.files.profilepic.name), async (error) => {
                    if (error) {
                        console.log("Error uploading profile picture:", error);
                        // Handle error
                    } else {
                        await User.updateOne({ username: currUser.username }, { $set: {profilepic: '/images/fileuploads/' + req.files.profilepic.name}});
                        await Post.updateMany({ username: currUser.username }, { $set: {userprofilepic: '/images/fileuploads/' + req.files.profilepic.name}});
                    }
                });
            }

            if (req.files && req.files.headerpic) {
                req.files.headerpic.mv(path.resolve(__dirname, '../public/images/fileuploads', req.files.headerpic.name), async (error) => {
                    if (error) {
                        console.log("Error uploading header picture:", error);
                        // Handle error
                    } else {
                        // Update header picture path in the database
                        await User.updateOne({ username: currUser.username }, { $set: {headerpic: '/images/fileuploads/' + req.files.headerpic.name}});
                    }
                });
            }
            if (email) {
                currUser.email = email;
            }
            if (bio) {
                currUser.bio = bio;
            }

            // Save the updated user profile
            await currUser.save();

            // Redirect to the appropriate page
            res.redirect('/profile');
        } else {
            req.flash('error_msg', 'User not found!');
            res.redirect('/submiteditprofile');
        }
    }catch (err) {
            console.error(err);
            req.flash('error_msg', 'Something went wrong!');
            res.redirect('/submiteditprofile');
        }
  }