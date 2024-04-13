const router = require('express').Router();

const Post = require("../database/models/Post.js")
const User = require("../database/models/User.js")

const path = require('path') // our path directory

  // POST LINKS

  router.get('/view/:id', async(req,res) => {
    const currUser = await User.findOne({username: req.session.username});
    const postId = req.params.id;
    const popularPosts = await Post.find({}).sort({upvote: -1}).limit(3);
    const posts = await Post.findById(postId);

    if (posts) {
      res.render('forum-viewpost', {posts, currUser, popularPosts});
    } else {
      res.redirect('/')
    }
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

  if (currUser) {
      if (posts.username === currUser.username) {
      res.render('forum-editpost', {currUser,posts});
      } else {
        res.redirect('/post/view/' + encodeURIComponent(postId))
      }
  }
  else {
    res.redirect('/post/view/' + encodeURIComponent(postId))
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
  const postId = post._id;

  console.log(req.params);
  if (currUser) {
    if (currUser.username === post.username)
    {
      try {
        await Post.deleteOne({_id: req.params.id});
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
    } else {
      res.redirect('/post/view/' + encodeURIComponent(postId))
    }
  } else {
    res.redirect('/post/view/' + encodeURIComponent(postId))
  }
});

// SUBMIT COMMENT

router.post('/submitcomment', async function (req, res) {
  const currUser = await User.findOne({username: req.session.username})
  console.log("User Info: " + currUser)
  const postId = req.body.postId
  console.log("Post Id: " + postId)
  const post = await Post.findById(postId)

  if (post) {
    if (currUser) {
      const commentdate = new Date()
      const commentday = commentdate.getDate()
      const commentmonth = commentdate.getMonth() + 1
      const commentyear = commentdate.getFullYear()
      const commenthour = commentdate.getHours()
      const commentminutes = commentdate.getMinutes().toString().padStart(2, '0');
      const commentfulldate = getFullDate(commentmonth, commentday, commentyear, commenthour, commentminutes)

      const newComment = {
        postId: postId,
        commenterId: currUser._id,
        commenterusername: currUser.username,
        commenterprofilepic: currUser.profilepic,
        commenttext: req.body.commenthere,
        commentdate: commentfulldate,
        isEdited: false,
        replies: []
      }

      post.comments.push(newComment)
      await post.save()
      currUser.comments.push(postId)
      await currUser.save()

      res.redirect('/post/view/' + encodeURIComponent(postId))
    } else {
      res.redirect('/post/view/' + encodeURIComponent(postId))
    }
  } else {
    console.log('Post not found')
    console.error()
  }
});

// SUBMIT REPLY

router.post('/submitreply', async function (req, res) {
  const currUser = await User.findOne({username: req.session.username});
  console.log("User Info: " + currUser)
  const postId = req.body.postId
  const post = await Post.findById(postId);
  console.log("Post Info: " + post)
  const commentId = req.body.commentId
  console.log("Comment Id: " + commentId)

  if (post) {
    const commentToReply = await post.comments.id(commentId)

    try {
      if (commentToReply) {
        if (currUser !== null) {
          const replydate = new Date()
          const replyday = replydate.getDate()
          const replymonth = replydate.getMonth() + 1
          const replyyear = replydate.getFullYear()
          const replyhour = replydate.getHours()
          const replyminutes = replydate.getMinutes().toString().padStart(2, '0');
          const replyfulldate = getFullDate(replymonth, replyday, replyyear, replyhour, replyminutes)
          
          const newReply = {
            respondentId: currUser._id,
            respondentusername: currUser.username,
            respondentprofilepic: currUser.profilepic,
            responsetext: req.body.replyhere,
            responsedate: replyfulldate,
            isEdited: false
          }

          commentToReply.replies.push(newReply)
          commentToReply.replies.sort((a, b) => new Date(a.responsedate) - new Date(b.responsedate))
          await post.save()

          currUser.comments.push(postId); 
          await currUser.save();
          res.redirect('/post/view/' + encodeURIComponent(postId))
        } else {
          res.redirect('/post/view/' + encodeURIComponent(postId));
        }
      } else {
        res.redirect('/post/view/' + encodeURIComponent(postId))
      }
    } catch (err) {
      console.error(err)
      res.status(500).send('Internal Server Error')
    }
  } else {
    console.log("Post not found")
    res.status(404).send("Post not found")
  }
});

// EDIT COMMENT
router.post('/editcomment', async function (req, res) {
  const currUser = await User.findOne({username: req.session.username});
  console.log("User Info: " + currUser)
  const post = await Post.findById(req.body.postId);
  const postId = req.body.postId;
  console.log("Post Info: " + post)
  const commentId = req.body.commentId
  console.log("Comment Id: " + commentId)

  try {
    if (post) {
      const commentToEdit = await post.comments.id(commentId)

        if (commentToEdit) {
          if ((currUser._id).equals(commentToEdit.commenterId)) {
            commentToEdit.commenttext = req.body.edithere
            commentToEdit.isEdited = true;
            await post.save()

            res.redirect('/post/view/' + encodeURIComponent(postId))
          } else {
            res.redirect('/post/view/' + encodeURIComponent(postId))
          }
        } else {
          res.redirect('/post/view/' + encodeURIComponent(postId))
        }
    }
  } catch (err) {
    res.redirect('/post/view/' + encodeURIComponent(postId))
  }
});

// DELETE COMMENT
router.get('/deletecomment/', async function (req, res) {
  const currUser = await User.findOne({username: req.session.username})
  const post = await Post.findById(req.query.postId)
  const postId = req.query.postId;
  const commentId = req.query.commentId

  if (post) {
    const commentToDelete = await post.comments.id(commentId)

    try {
      if (commentToDelete) {
        if ((currUser._id).equals(commentToDelete.commenterId)) {
          await Post.updateOne({_id: post._id}, {$pull: {comments: {_id: commentToDelete._id}}})
          await post.save()
          res.redirect('/post/view/' + encodeURIComponent(postId))
        } else {
          res.redirect('/post/view/' + encodeURIComponent(postId))
        } 
      } else {
        res.redirect('/post/view/' + encodeURIComponent(postId))
      }
    } catch (err) {
      res.redirect('/post/view/' + encodeURIComponent(postId))
    }
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

        if (currUser) {

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
          res.redirect('/post/view/' + encodeURIComponent(postId))       
        } else {
          res.redirect('/post/view/' + encodeURIComponent(postId))
        }
      } else {
        res.redirect('/post/view/' + encodeURIComponent(postId))
      }
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
});

router.get('/downvote/:id', async(req,res) => { 
  const postId = req.params.id;
  
  try {
      const post = await Post.findById(postId);
      if (post) {
        const currUser = await User.findOne({username: req.session.username});
    
        if (currUser) {

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
          res.redirect('/post/view/' + encodeURIComponent(postId))          
        } else {
          res.redirect('/post/view/' + encodeURIComponent(postId))
        }
      } else {
        res.redirect('/post/view/' + encodeURIComponent(postId))
      }
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
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