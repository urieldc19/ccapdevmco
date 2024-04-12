const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, minlength: 8, required: true },
    date: { type: Date, default: Date.now },
});

UserSchema.statics.createAndSave = async function(userData) {
    try {
        const newUser = new this(userData);
        const savedUser = await newUser.save();
        return savedUser;
    } catch (error) {
        throw error;
    }
};

UserSchema.statics.getById = async function(userId) {
    try {
        const user = await this.findById(userId);
        return user;
    } catch (error) {
        throw error;
    }
};

UserSchema.statics.getOne = async function(query) {
    try {
        const user = await this.findOne(query);
        return user;
    } catch (error) {
        throw error;
    }
};

const user = mongoose.model('user', UserSchema);
module.exports = user;
