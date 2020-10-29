const mongoose = require('mongoose');
const dbEnv = require('../../bin/env').db;
const server = require('../../public/javascripts/models/server');
const user = require('../../public/javascripts/models/user');

class Database {
    constructor(options = {useNewUrlParser: true, useUnifiedTopology: true}) {
        mongoose.connect(dbEnv.connection(dbEnv.auth.user, dbEnv.auth.pass), options, (err) => {
            if (err)
                throw new Error('Failed to create a connection to the database');
        })
    }

    getServers() {
        return server.find({});
    }

    addServer(newServ) {
        let newServer = new server();

        newServer.serverName = newServ.serverName;
        newServer.ipAddress = newServ.ipAddress;
        newServer.dnsName = newServ.dnsName;
        newServer.status = newServ.status;

        return newServer.save();
    }

    getServer = function (ip) {
        return server.findOne({ipAddress: ip});
    }

    deleteServer = function (ip) {
        return server.findOneAndRemove({ipAddress: ip}, {useFindAndModify: false});
    }

    updateServer = function(ip, serv) {
        return server.updateOne({ipAddress: ip}, serv);
    }

    getUsers = function () {
        return user.find({});
    }

    getUser = function (username) {
        return user.findOne({user: username})
    }

    addUser = function (newUser) {
        let newUs = new user();

        newUs.user = newUser.user;
        newUs.pass = newUser.pass;
        newUs.email = newUser.email;
        newUs.displayName = newUser.displayName;

        return newUs.save();
    }

    deleteUser = function (username) {
        return user.findOneAndRemove({user: username}, {useFindAndModify: false});
    }

    changePassword = function (userInfo) {
        return user.updateOne({user: userInfo.user}, {pass: userInfo.pass})
    }

    resetRequest = function(email) {
        return user.findOne({email: email})
    }
}


module.exports = Database;

