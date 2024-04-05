const { ObjectId } = require('bson')
const mongoose = require('mongoose')

const ReplySchema = new mongoose.Schema({
  respondentId: ObjectId,
  respondentusername: String,
  respondentprofilepic: String,
  responsetext: String,
  responsedate: String,
  isEdited: Boolean
})

const CommentSchema = new mongoose.Schema({
  postId: ObjectId,
  commenterId: ObjectId,
  commenterusername: String,
  commenterprofilepic: String,
  commenttext: String,
  commentdate: String,
  isEdited: Boolean,
  replies: [ReplySchema]
})

const PostSchema = new mongoose.Schema({
    url: String,
    username: String,
    userprofilepic: String,
    title: String,
    description: String,
    tag: String,
    postdate: String,
    image: String,
    upvote: Number,
    downvote: Number,
    edited: Boolean,
    comments: [CommentSchema]
})

const Post = mongoose.model('Post', PostSchema)

module.exports = Post