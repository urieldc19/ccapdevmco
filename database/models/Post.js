const { ObjectId } = require('bson')
const mongoose = require('mongoose')

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
    edited: Boolean
})

const Post = mongoose.model('Post', PostSchema)

module.exports = Post