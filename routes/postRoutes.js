const router = require('express').Router();

const Post = require("../database/models/Post.js")
const Comment = require("../database/models/Comment.js")
const User = require("../database/models/User.js")

const path = require('path') // our path directory

  // POST LINKS

  router.get('/view/:id', async(req,res) => {
    const currUser = await User.findOne({username: req.session.username});
    const postId = req.params.id;
    const posts = await Post.findById(postId);
    const comments = await Comment.find({postId: posts._id})
    const popularPosts = await Post.find({}).sort({upvote: -1}).limit(3);
    
    res.render('forum-viewpost', {currUser, posts, comments, popularPosts});
  });

  // CREATE POST

  router.get('/create', async(req,res) => {
    const currUser = await User.findOne({username: req.session.username});
    
    res.render('forum-createpost',{currUser});
  });

  router.post('/submit', async function (req, res) {
    if (req.files && req.files.postcontent) {
      req.files.postcontent.mv(path.resolve(__dirname,'../public/images/fileuploads',req.files.postcontent.name), async (error) => {
          if (error)
          {
              console.log ("Error!")
              // add warning 
          }
          else
          {
            // Extract username from authenticated user's session 
            const currUser = await User.findOne({username: req.session.username});
  
            // Get current UTC date
            const postdate = new Date()
            const postday = postdate.getDate()
            const postmonth = postdate.getMonth() + 1
            const postyear = postdate.getFullYear()
            const posthour = postdate.getHours();
            const postminutes = postdate.getMinutes().toString().padStart(2, '0');
            const postfulldate = getFullDate(postmonth, postday, postyear, posthour, postminutes)
  
            // Create a new Post object with image path
  
            const newPost = {
              username: currUser.username,
              userprofilepic: currUser.profilepic,
              ...req.body,
              postdate: postfulldate,
              image: '/images/fileuploads/' + req.files.postcontent.name,
              upvote: 0,
              downvote: 0,
              edited: false,
              comments: []
            }
  
              await Post.create(newPost);
              res.redirect('/');
          };
      })
    } else {
      // Extract username from authenticated user's session 
      const currUser = await User.findOne({username: req.session.username});
  
      // Get current UTC date
      const postdate = new Date()
      const postday = postdate.getDate()
      const postmonth = postdate.getMonth() + 1
      const postyear = postdate.getFullYear()
      const posthour = postdate.getHours();
      const postminutes = postdate.getMinutes().toString().padStart(2, '0');
      const postfulldate = getFullDate(postmonth, postday, postyear, posthour, postminutes)
  
      // Create a new Post object with image path
  
      const newPost = {
        username: currUser.username,
        userprofilepic: currUser.profilepic,
        ...req.body,
        postdate: postfulldate,
        image: "",
        upvote: 0,
        downvote: 0,
        comments: []
      }
  
        await Post.create(newPost);
        res.redirect('/');
    }
  });

  // EDIT POST

router.get('/edit/:id', async(req,res) => { 
  console.log(req.params)
  const postId = req.params.id;
  
  const posts = await Post.findById(postId);
  const currUser = await User.findOne({username: req.session.username});

  if (posts.username === currUser.username) {
    res.render('forum-editpost', {currUser,posts});
  } else {
    res.redirect('/')
  }
  
});

// SUBMIT EDIT POST

router.post('/submitedit/:id', async function (req, res) {
  console.log(req.params)
  const post = await Post.findById(req.params.id);

  if (req.body && req.body.title) {
    await post.updateOne({title: req.body.title});
    await post.updateOne({edited: true});
  }

  if (req.body && req.body.description) {
    await post.updateOne({description: req.body.description});
    await post.updateOne({edited: true});
  }

  if (req.body && req.body.tag) {
    await post.updateOne({tag: req.body.tag});
    await post.updateOne({edited: true});
  }

  if (req.files && req.files.postcontent) {
    req.files.postcontent.mv(path.resolve(__dirname,'../public/images/fileuploads',req.files.postcontent.name), async (error) => {
        if (error)
        {
            console.log ("Error!")
            // add warning 
        }
        else
        {
          await post.updateOne({image: '/images/fileuploads/' + req.files.postcontent.name});
          await post.updateOne({edited: true});
        };
    })
  }

  res.redirect('/')
});

// DELETE POST

router.get('/delete/:id', async function (req, res) {
  const currUser = await User.findOne({username: req.session.username});
  const post = await Post.findById(req.params.id);

  console.log(req.params);
  if (currUser.username === post.username)
  {
    try {
      await Post.deleteOne({_id: req.params.id});
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
  res.redirect('/');
});

// SUBMIT COMMENT

/*router.post('/submitcomment', async function (req, res) {
  const postId = req.body.postId
  console.log("Post Id: " + postId)
  const currUser = await User.findOne()
  const post = await Post.findById(postId)

  // GET DATE
  const commentdate = new Date()
  const commentday = commentdate.getDate()
  const commentmonth = commentdate.getMonth() + 1
  const commentyear = commentdate.getFullYear()
  const commenthour = commentdate.getHours()
  const commentminutes = commentdate.getMinutes().toString().padStart(2, '0');
  const commentfulldate = getFullDate(commentmonth, commentday, commentyear, commenthour, commentminutes)

  if (post) {
    const newComment = {
      postId: postId,
      commenter: currUser.username,
      commenterprofilepic: currUser.profilepic,
      commenttext: req.body.commenthere,
      commentdate: commentfulldate,
      commentreplies: []
    }

    post.comments.push(newComment)
    await post.save()
    currUser.comments.push(postId); 
    await currUser.save();

    res.redirect('/post/' + encodeURIComponent(postId));
  } else {
    console.log("Error")
    console.error()
  }
});*/

router.post('/submitcomment', async function (req, res) {
  const postId = req.body.postId
  console.log("Post Id: " + postId)
  const currUser = await User.findOne()
  console.log("User Info: " + currUser)

  try {
    const commentdate = new Date()
    const commentday = commentdate.getDate()
    const commentmonth = commentdate.getMonth() + 1
    const commentyear = commentdate.getFullYear()
    const commenthour = commentdate.getHours()
    const commentminutes = commentdate.getMinutes().toString().padStart(2, '0');
    const commentfulldate = getFullDate(commentmonth, commentday, commentyear, commenthour, commentminutes)
  
    const newComment = {
      postId : postId,
      commenterId : currUser._id,
      commenter : currUser.username,
      commenterprofilepic : currUser.profilepic,
      commenttext : req.body.commenthere,
      commentdate : commentfulldate,
      isEdited : false
    }

    await Comment.create(newComment)
    res.redirect('/post/view/' + encodeURIComponent(postId))
  } catch (err) {
    console.log(err)
  } 
})

router.post('/submitreply', async function (req, res) {
  const currUser = await User.findOne()
  console.log("User Id: " + currUser)
  const postId = req.body.postId
  console.log("Post Id: " + postId)
  const commentId = req.body.commentId
  console.log("Comment Id: " + commentId)

  const post = await Post.findById(postId)

  if (post) {
    const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId)

    if (commentIndex !== -1) {
      const replydate = new Date()
      const replyday = replydate.getDate()
      const replymonth = replydate.getMonth() + 1
      const replyyear = replydate.getFullYear()
      const replyhour = replydate.getHours()
      const replyminutes = replydate.getMinutes().toString().padStart(2, '0');
      const replyfulldate = getFullDate(replymonth, replyday, replyyear, replyhour, replyminutes)
      
      const newReply = {
        respondent: currUser.username,
        respondentprofilepic: currUser.profilepic,
        response: req.body.replyhere,
        responsedate: replyfulldate
      };

      post.comments[commentIndex].commentreplies.push(newReply)
      await post.save()
      
      post.comments[commentIndex].commentreplies.sort((a, b) => new Date(a.responsedate) - new Date(b.responsedate));

      currUser.comments.push(postId); 
      await currUser.save();
      res.redirect('/post/view/' + encodeURIComponent(postId))
    } else {
      console.log("Comment not found")
      res.status(404).send("Comment not found")
    }
  } else {
    console.log("Post not found")
    res.status(404).send("Post not found")
  }
});

// EDIT COMMENT
/*router.post('/editcomment', async function (req, res) {
  const currUser = await User.findOne({username: req.session.username});
  const post = await Post.findById(req.body.postId);
  if (currUser.username === req.body.commenter) {
    try {
        console.log(req.params)
        const commentToEdit = post.comments.find(comment =>
            comment.commenter === req.body.commenter &&
            comment.commentdate.toString() === req.body.date &&
            comment.commenttext === req.body.comment
        );

        if (!commentToEdit) {
            return res.status(404).send('Comment not found or unauthorized');
        }

        if (currUser.username !== commentToEdit.commenter) {
            return res.status(403).send('Unauthorized');
        }

        if (currUser.username === req.body.commenter)
        {
          commentToEdit.commenttext = req.body.newcomment;
          await post.save();
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
  }
  res.redirect('back');
});*/

router.post('/editcomment', async function (req, res) {
  const currUser = await User.findOne()
  console.log("User Info: " + currUser)
  const postId = req.body.postId
  console.log("Post Id: " + postId)
  const commentId = req.body.commentId
  console.log("Comment Id: " + commentId)
  const commenterId = req.body.commenterId
  console.log("Commenter Id: " + commenterId)

  if ((currUser._id).equals(commenterId)) {
      await Comment.findByIdAndUpdate(commentId, {commenttext: req.body.edithere}, {isEdited: true})

      res.redirect('/post/view/' + encodeURIComponent(postId))
  } else {
    console.log('Error')
  }
});

// DELETE COMMENT

/*router.get('/deletecomment/:id', async function (req, res) {
  const currUser = await User.findOne({username: req.session.username});

  if (currUser.username === req.params.username) {
    try {
        const post = await Post.findById(req.params.id);

        const commentToDelete = post.comments.find(comment => 
            comment.commenter === req.params.username &&
            comment.commentdate.toString() === req.params.date &&
            comment.commenttext === req.params.comment
        );

        if (!commentToDelete) {
            return res.status(404).send('Comment not found or unauthorized');
        }

        if (currUser.username !== commentToDelete.commenter) {
            return res.status(403).send('Unauthorized');
        }
          await post.updateOne({ $pull: { comments: commentToDelete } });
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
  }
  res.redirect('back');
});*/

router.get('/deletecomment', async function (req, res) {
  const currUser = await User.findOne()
  console.log("User Info: " + currUser)
  const postId = req.query.postId
  console.log("Post Id: " + postId)
  const commentId = req.query.commentId
  console.log("Comment Id: " + commentId)
  const commenterId = req.query.commenterId
  console.log("Commenter Id: " + commenterId)

  if ((currUser._id).equals(commenterId)){
    await Comment.deleteOne({_id: commentId})

    res.redirect('/post/view/' + encodeURIComponent(postId))
  }
});
  
  // UPVOTE & DOWNVOTE
  
  router.get('/upvote/:id', async (req, res) => {
    const postId = req.params.id;
    console.log(req.params);
    try {
        const post = await Post.findById(postId);
        if (post) {
          const currUser = await User.findOne({username: req.session.username});
          const isPostDownvoted = currUser.downvotedposts.includes(postId);
          const isPostUpvoted = currUser.upvotedposts.includes(postId);
  
          if (!isPostDownvoted && !isPostUpvoted) {
              await Post.updateOne({ _id: postId }, { $inc: { upvote: 1 } });
              currUser.upvotedposts.push(postId); 
          } else if (isPostUpvoted) {
              await Post.updateOne({ _id: postId }, { $inc: { upvote: -1 } });
              currUser.upvotedposts.pull(postId);
          } else if (isPostDownvoted) {
            await Post.updateOne({ _id: postId }, { $inc: { downvote: -1 } });
            currUser.downvotedposts.pull(postId);
            await Post.updateOne({ _id: postId }, { $inc: { upvote: 1 } });
              currUser.upvotedposts.push(postId); 
          }
          await currUser.save();
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
    res.redirect('back');
  });
  
  router.get('/downvote/:id', async(req,res) => { 
    const postId = req.params.id;
    
    try {
        const post = await Post.findById(postId);
        if (post) {
          const currUser = await User.findOne({username: req.session.username});
          const isPostDownvoted = currUser.downvotedposts.includes(postId);
          const isPostUpvoted = currUser.upvotedposts.includes(postId);
  
          if (!isPostDownvoted && !isPostUpvoted) {
              await Post.updateOne({ _id: postId }, { $inc: { downvote: 1 } });
              currUser.downvotedposts.push(postId); 
          } else if (isPostDownvoted) {
              await Post.updateOne({ _id: postId }, { $inc: { downvote: -1 } });
              currUser.downvotedposts.pull(postId);
          } else if (isPostUpvoted) {
            await Post.updateOne({ _id: postId }, { $inc: { upvote: -1 } });
            currUser.upvotedposts.pull(postId);
            await Post.updateOne({ _id: postId }, { $inc: { downvote: 1 } });
            currUser.downvotedposts.push(postId); 
          }
          await currUser.save();
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
    res.redirect('back');
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