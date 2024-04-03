const { ObjectId } = require('bson')
const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    postId : ObjectId,
    commenterId : ObjectId,
    commenter : String,
    commenterprofilepic : String,
    commenttext : String,
    commentdate : String,
    isEdited : Boolean
})

const Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment