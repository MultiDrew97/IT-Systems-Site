const mongoose = require('mongoose');

module.exports = mongoose.model('Server', {
    serverName: String,
    dnsName: String,
    ipAddress: String,
    status: String
}, 'Servers')