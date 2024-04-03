const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const UserSchema = new Schema({
    username: String,
    email: String,
    password: String,
    bio: String,
    profilepic: String,
    headerpic: String,
    comments: [{ type: Types.ObjectId, ref: 'Post' }], // References to Post
    upvotedposts: [{ type: Types.ObjectId, ref: 'Post' }], // References to Post
    downvotedposts: [{ type: Types.ObjectId, ref: 'Post' }] // References to Post
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
