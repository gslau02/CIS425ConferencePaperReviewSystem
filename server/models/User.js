const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: [String],
        required: true,
        default: []
    },
    email: {
        type: String,
        unique: true
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    title: {
        type: String,
    },
    affiliation: {
        type: String,
    },
});

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;
