const mongoose = require('mongoose')

const LogSchema = new mongoose.Schema({
    loggedin: Boolean,
    username: String
})

const Log = mongoose.model('Log', LogSchema)

module.exports = Log