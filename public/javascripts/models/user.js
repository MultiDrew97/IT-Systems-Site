const mongoose = require('mongoose');

module.exports = mongoose.model('User', {
    displayName: String,
    user: String,
    pass: String,
    email: String
}, 'Users')