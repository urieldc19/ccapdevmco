const router = require('express').Router();

const Post = require("../database/models/Post.js")
const User = require("../database/models/User.js")

// TAGS

  router.get('/technology', async(req,res) => {
    const currUser = await User.findOne({username: req.session.username});
    const posts = await Post.find({tag: 'Technology'}).sort({ postdate: -1 });
    const popularPosts = await Post.find({}).sort({upvote: -1}).limit(3);
    console.log(posts)
    res.render('forum-home',{currUser, posts, popularPosts})
  });
  
  router.get('/fashion', async(req,res) => {
    const currUser = await User.findOne({username: req.session.username});
    const posts = await Post.find({tag: 'Fashion'}).sort({ postdate: -1 });
    const popularPosts = await Post.find({}).sort({upvote: -1}).limit(3);
    console.log(posts)
    res.render('forum-home',{currUser, posts, popularPosts})
  });
  
  router.get('/gaming', async(req,res) => {
    const currUser = await User.findOne({username: req.session.username});
    const posts = await Post.find({tag: 'Gaming'}).sort({ postdate: -1 });
    const popularPosts = await Post.find({}).sort({upvote: -1}).limit(3);
    console.log(posts)
    res.render('forum-home',{currUser, posts, popularPosts})
  });
  
  router.get('/news', async(req,res) => {
    const currUser = await User.findOne({username: req.session.username});
    const posts = await Post.find({tag: 'News'}).sort({ postdate: -1 });
    const popularPosts = await Post.find({}).sort({upvote: -1}).limit(3);
    console.log(posts)
    res.render('forum-home',{currUser, posts, popularPosts})
  });
  
  router.get('/television', async(req,res) => {
    const currUser = await User.findOne({username: req.session.username});
    const posts = await Post.find({tag: 'Television'}).sort({ postdate: -1 });
    const popularPosts = await Post.find({}).sort({upvote: -1}).limit(3);
    console.log(posts)
    res.render('forum-home',{currUser, posts, popularPosts})
  });
  
  router.get('/music', async(req,res) => {
    const currUser = await User.findOne({username: req.session.username});
    const posts = await Post.find({tag: 'Music'}).sort({ postdate: -1 });
    const popularPosts = await Post.find({}).sort({upvote: -1}).limit(3);
    console.log(posts)
    res.render('forum-home',{currUser, posts, popularPosts})
  });
  
  router.get('/animals', async(req,res) => {
    const currUser = await User.findOne({username: req.session.username});
    const posts = await Post.find({tag: 'Animals'}).sort({ postdate: -1 });
    const popularPosts = await Post.find({}).sort({upvote: -1}).limit(3);
    console.log(posts)
    res.render('forum-home',{currUser, posts, popularPosts})
  });
  
  router.get('/art', async(req,res) => {
    const currUser = await User.findOne({username: req.session.username});
    const posts = await Post.find({tag: 'Art'}).sort({ postdate: -1 });
    const popularPosts = await Post.find({}).sort({upvote: -1}).limit(3);
    console.log(posts)
    res.render('forum-home',{currUser, posts, popularPosts})
  });

  function getFullDate(month, day, year, hour, minutes) {
    var sMonth
    var fulldate
  
    switch(month) {
      case 1: sMonth = "January"; break
      case 2: sMonth = "February"; break
      case 3: sMonth = "March"; break
      case 4: sMonth = "April"; break
      case 5: sMonth = "May"; break
      case 6: sMonth = "June"; break
      case 7: sMonth = "July"; break
      case 8: sMonth = "August"; break
      case 9: sMonth = "September"; break
      case 10: sMonth = "October"; break
      case 11: sMonth = "November"; break
      case 12: sMonth = "December"; break
    }
  
    fulldate = sMonth + " " + day + ", " + year + " " + hour + ":" + minutes
  
    return fulldate
  }

module.exports = router;