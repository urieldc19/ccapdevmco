const { envPort, dbURL ,sessionKey } = require('./config');

const mongoose = require('mongoose')
mongoose.connect(dbURL)

const express = require('express')
const app = new express()

const fileUpload = require('express-fileupload')
const hbs = require('hbs');
app.set('view engine','hbs');

const tagRouter = require('./routes/tagRoutes');
const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/auth.js');

const Post = require("./database/models/Post.js")
const Comment = require("./database/models/Comment.js")
const User = require("./database/models/User.js")
const path = require('path') // our path directory
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash')
const bcrypt = require('bcrypt');

app.use(express.json()) // use json
app.use(express.urlencoded( {extended: false} )); // files consist of more than strings
app.use(express.static('public')) // we'll add a static directory named "public"
app.use(fileUpload()) // for fileuploads
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const fs = require('fs');
const { loginUser, changePassword } = require('./controllers/userController.js')

const partial = fs.readFileSync('./views/partials/messages.hbs', 'utf8');
hbs.registerPartial('messages', partial);

app.use(session({
  name: 'MCO3',
  secret: sessionKey, //sample
  store: new session.MemoryStore(),
  resave: false,
  saveUninitialized: false,
  cookie: {secure: false, maxAge: 1000 * 60 * 60 * 24 * 7}
}));

app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
}); 

app.use('/post', postRouter);
app.use('/tag', tagRouter);
app.use('/user', userRouter);
app.use('/', authRouter);


// LINKS
app.get('/', async function (req, res) {
  let postnum = await User.find({}).count();
  const saltRounds = 10;

  if (!req.session.username) {
    req.session.username = ""
  }

  if (postnum < 1)
  {
      const hash = await bcrypt.hash("aaa", saltRounds);
      const user1 = {
      username: "thedogist",
      email: "thedogist@mail.com",
      password: hash,
      bio: "I love dogs!",
      profilepic: "/images/fileuploads/profile.jpg",
      headerpic: "/images/fileuploads/user-cover-pic.png",
      upvotedposts: [],
      downvotedposts: []
    }

    await User.create(user1);

    const hash2 = await bcrypt.hash("bbb", saltRounds);
    const user2 = {
      username: "thehobbyist",
      email: "thehobbyist@mail.com",
      password: hash2,
      bio: "My hobby is playing games",
      profilepic: "/images/fileuploads/user1.jpg",
      headerpic: "/images/fileuploads/skull.jpg",
      upvotedposts: [],
      downvotedposts: []
    }

    await User.create(user2);

    const hash3 = await bcrypt.hash("ccc", saltRounds);
    const user3 = {
      username: "facethemusic",
      email: "facethemusic@mail.com",
      password: hash3,
      bio: "Music rocks!",
      profilepic: "/images/fileuploads/user2.jpg",
      headerpic: "/images/fileuploads/music.jpg",
      upvotedposts: [],
      downvotedposts: []
    }

    await User.create(user3);

    const hash4 = await bcrypt.hash("ddd", saltRounds);
    const user4 = {
      username: "foodie",
      email: "foodie@mail.com",
      password: hash4,
      bio: "FOOD is LIFE!",
      profilepic: "/images/fileuploads/user3.png",
      headerpic: "/images/fileuploads/food.png",
      upvotedposts: [],
      downvotedposts: []
    }
    
    await User.create(user4);

    const hash5 = await bcrypt.hash("sss", saltRounds);
    const user5 = {
      username: "girlboss",
      email: "slayable@mail.com",
      password: hash5,
      bio: "On fire and feeling fine",
      profilepic: "/images/fileuploads/user4.jpg",
      headerpic: "/images/fileuploads/kiss.jpg",
      upvotedposts: [],
      downvotedposts: []
    }

    await User.create(user5);
  }

  const postdate = new Date()
  const postday = postdate.getDate()
  const postmonth = postdate.getMonth() + 1
  const postyear = postdate.getFullYear()
  const posthour = postdate.getHours()
  const postminutes = postdate.getMinutes().toString().padStart(2, '0');
  const postfulldate = getFullDate(postmonth, postday, postyear, posthour, postminutes)

  const post1 = await Post.find({title: "Is AI art real art?"}).count();

  if (!post1) {
      const newPost1 = {
      username: "thehobbyist",
      userprofilepic: "/images/fileuploads/user1.jpg",
      title: "Is AI art real art?",
      description: "^title",
      tag: "Art",
      postdate: postfulldate,
      image: '/images/fileuploads/skull.jpg',
      upvote: 0,
      downvote: 0,
      edited: false
    }
    await Post.create(newPost1);
  }

  const post2 = await Post.find({title: "Where can I buy vinyl records in Manila?"}).count();

  if (!post2) {
      const newPost2 = {
      username: "facethemusic",
      userprofilepic: "/images/fileuploads/user2.jpg",
      title: "Where can I buy vinyl records in Manila?",
      description: "I need some good recomendations please :)",
      tag: "Music",
      postdate: postfulldate,
      image: '',
      upvote: 0,
      downvote: 0,
      edited: false
    }
    
    await Post.create(newPost2);
  } 

  const post3 = await Post.find({title: "Do you know the breed of this cute dog?"}).count();

  if (!post3) {
      const newPost3 = {
      username: "thedogist",
      userprofilepic: "/images/fileuploads/profile.jpg",
      title: "Do you know the breed of this cute dog?",
      description: "I just can't my eyes off of this dog <3",
      tag: "Animals",
      postdate: postfulldate,
      image: '/images/fileuploads/dog.jpg',
      upvote: 0,
      downvote: 0,
      edited: false
    }
    
    await Post.create(newPost3);
  } 

  const post4 = await Post.find({title: "New cafe in taft!"}).count();

  if (!post4) {
      const newPost4 = {
      username: "foodie",
      userprofilepic: "/images/fileuploads/user3.png",
      title: "New cafe in taft!",
      description: "Don't missed out this new cafe! I heard their spanish latte is good! :)",
      tag: "News",
      postdate: postfulldate,
      image: '/images/fileuploads/cafe.jpg',
      upvote: 0,
      downvote: 0,
      edited: false
    }
    
    await Post.create(newPost4);
  } 

  const post5 = await Post.find({title: "New shades of Rhode Skin Peptide Lip Treatment!!"}).count();

  if (!post5) {
      const newPost5 = {
      username: "girlboss",
      userprofilepic: "/images/fileuploads/user4.jpg",
      title: "New shades of Rhode Skin Peptide Lip Treatment!!",
      description: "Approve or not?! WDYT girlies? ;)",
      tag: "Fashion",
      postdate: postfulldate,
      image: '/images/fileuploads/lippie.jpg',
      upvote: 0,
      downvote: 0,
      edited: false
    }
    
    await Post.create(newPost5);
  } 

    const currUser = await User.findOne({username: req.session.username});
    const posts = await Post.find({}).sort({ postdate: -1 });
    const popularPosts = await Post.find({}).sort({upvote: -1}).limit(3);
    
    res.render('forum-home',{posts, currUser, popularPosts});
});

// SEARCH
  
app.get('/search', async(req,res) => {
    
  if(req.query.search != '') {
    let currUser = await User.findOne({username: req.session.username});
    const posts = await Post.find({$or:[{title: {$regex : req.query.search, $options: 'i'}}, {description: {$regex : req.query.search, $options: 'i'}}]}).sort({ postdate: -1 });
    const popularPosts = await Post.find({}).sort({upvote: -1}).limit(3);

    if (currUser) {
      res.render('forum-home',{posts, currUser, popularPosts});
    } else {
      let currUser = {
        username: ""
      }
      res.render('forum-home',{posts, currUser, popularPosts});
    }
  } else {
    res.redirect('/')
  }
});

app.get('/profile', async(req,res) => {
  const currUser = await User.findOne({username: req.session.username});
  const visitedUser = await User.findOne({username: req.session.username});

  if (currUser) {
    const posts = await Post.find({username: currUser.username});
    res.render('forum-viewprofile', {posts, currUser, visitedUser});
  } else {
    res.redirect('/')
  }
});

app.get('/editprofile', async(req,res) => {
  const currUser = await User.findOne({username: req.session.username});

  if (currUser) {
    res.render('forum-editprofile',{currUser});
  } else {
    res.redirect('/')
  }
  
});

app.get('/register', async(req, res) => {
  registerUser(req, res);
});

app.get('/security-settings', async(req, res) => {
  const currUser = await User.findOne({username: req.session.username});

  if (currUser) {
    res.render('forum-security-settings', {currUser});
  } else {
    res.redirect('/')
  }
  
})

app.get('/editPass', async(req,res) => {
  changePassword(req, res);
})


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

app.listen(envPort, () => {
  console.log(`Server started on port ${envPort}`);
});

hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this)
})