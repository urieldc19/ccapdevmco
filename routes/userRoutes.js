const router = require('express').Router();

const Post = require("../database/models/Post.js")
const User = require("../database/models/User.js")

router.get('/:username', async(req,res) => {
    let currUser = await User.findOne({username: req.session.username});

    if (currUser &&  (currUser === req.params.username)) {
      res.redirect('/profile')
    } 
    else {
      const visitedUser = await User.findOne({username: req.params.username});
      console.log(visitedUser)
      const posts = await Post.find({username: req.params.username});

      if (!currUser) {
        currUser = {
          username: ""
        }
      }

      res.render('forum-viewprofile', {currUser, visitedUser, posts});
    }
});

// UPVOTED POSTS BY USER 

router.get('/:username/upvotedposts', async (req, res) => {
  let currUser = await User.findOne({username: req.session.username});

  if (!currUser) {
    currUser = {
      username: ""
    }
  }

  const visitedUser = await User.findOne({ username: req.params.username });
  
  const posts = await Post.find({ _id: { $in: visitedUser.upvotedposts } });
  
  res.render('forum-viewprofile', { currUser, visitedUser, posts });
});

// DOWNVOTED POSTS

router.get('/:username/downvotedposts', async (req, res) => {
  let currUser = await User.findOne({username: req.session.username});

  if (!currUser) {
    currUser = {
      username: ""
    }
  }

  const visitedUser = await User.findOne({ username: req.params.username });
  
  const posts = await Post.find({ _id: { $in: visitedUser.downvotedposts } });
  
  res.render('forum-viewprofile', { currUser, visitedUser, posts });
});

// COMMENTED POSTS

router.get('/:username/commentedposts', async (req, res) => {
  let currUser = await User.findOne({username: req.session.username});

  if (!currUser) {
    currUser = {
      username: ""
    }
  }
  
  const visitedUser = await User.findOne({ username: req.params.username });
  
  const posts = await Post.find({ _id: { $in: visitedUser.comments } });
  
  res.render('forum-viewprofile', { currUser, visitedUser, posts });
});

module.exports = router;

