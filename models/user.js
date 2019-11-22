const mongoose = require('mongoose');

module.exports.User = mongoose.model('users', mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    regdate: {
        type: Date,
        default: Date.now
    }
}));

module.exports.Mongo = mongoose;