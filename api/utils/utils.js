const env = require('../../bin/environment');
const fs = require('fs');
const backup1 = './api/data/data_1.json';
const backup2 = './api/data/data_2.json';
utils = {
    users: [],
    servers: [],
    path: './api/data/data.json',
    loadData: function(){
        /*
            Load the data from the data file and store them in the servers and users arrays
         */
        fs.readFile(this.path, (err, data) => {
            const json = JSON.parse(data.toString());
            this.users = json.Users;
            this.servers = json.Servers;
        })
    },
    checkAuth : function(username, password) {
        /*
            Check the validation of the credentials given for API authorization

            @param username The username passed for authorization
            @param password The password passed for authorization

            @return Whether the credentials are valid
         */
        for (let user = 0; user < env.apiAuth.length; user++) {
            if (username === env.apiAuth[user].username && password === env.apiAuth[user].password) {
                return true;
            }
        }

        return false;
    },
    checkLogin: function(username, password) {
        /*
            Check the validation of the login credentials passed for the website itself

            @param username The username passed for login
            @param password The password passed for login

            @return Whether the credentials are valid
         */
        for (let i = 0; i < this.users.length; i++) {
            if (username === this.users[i].username && password === this.users[i].password) {
                return true;
            }
        }

        return false;
    },
    saveData: function(res, statusCode = {good: 204, bad: 400}) {
        /*
            Save the information to the data file

            @param statusCode Object of good and bad status codes
            @param res The response object to handle the responding when done
         */

        let temp = {Users: this.users, Servers: this.servers};

        /*
            Adds a "logging" feature to the saving of the data file. It will keep up to 2 backups of the data file,
            which will be created everytime the file is changed

            Currently untested in the fact of if it completely works as intended
        fs.access(this.path, err => {
            if (err)
                return err;

            fs.access(backup1, err => {
                if (err) {
                    //copy the contents of the main file to backup1
                    return err;
                }
                fs.copyFile(backup1, backup2, err => {
                    //copy the contents of backup1 into backup2, then save the main file
                    fs.writeFile(this.path, temp, err => {
                        if (err)
                            return err
                    })
                })
            })
        })*/

        fs.writeFile(this.path, JSON.stringify(temp), (err) => {
            if (err){
                res.status(statusCode.bad);
                res.send(err)
                return
            }

            res.status(statusCode.good);
            res.send();
        });
    },
    findServer: function(ipAddress) {
        /*
            Locate the index of a server in the list by IP Address

            @param ipAddress The IP Address of the server to be found

            @return The index in the servers array which holds the information for the desired server. Returns -1 if not found
         */
        for (let i = 0; i < this.servers.length; i++) {
            if (this.servers[i].ipAddress === ipAddress) {
                return i;
            }
        }

        return -1;
    },
    addServer: function(newServer, res) {
        /*
            Add a server to the list

            @param newServer The new server being added to the list
            @param res The response object to handle responding correctly
         */
        /*let server = {};
        server.serverName = newServer.serverName;
        server.ipAddress = newServer.ipAddress;
        server.dnsName = newServer.dnsName;
        server.status = newServer.status;*/

        if (this.uniqueServer(newServer.ipAddress)) {
            this.servers.push(newServer);
            this.saveData(res, {good: 201, bad: 400});
        } else {
            if (this.servers.includes(newServer)) {
                let index = this.findServer(newServer.ipAddress);

                this.servers[index] = newServer;

                this.saveData(res, {good: 201, bad: 400});
            } else {
                res.status(400);
                res.send({unique: false});
            }
        }

    },
    uniqueServer: function(ipAddress) {
        /*
            Check if the new server is already in the list or if the IP Address is already being used

            @param ipAddress The IP Address of the server being added

            @return Whether the server is new
         */

        //TODO: Add where it will return the object that has the IP Address as well
        for (let i = 0; i < this.servers.length; i++) {
            if (this.servers[i].ipAddress === ipAddress) {
                return false;
            }
        }

        return true;
    },
    uniqueUsername: function(username) {
        /*
            Check if the new user is already in the list or if the username is already being used

            @param username The username of the user being added

            @return Whether the user is new
         */

        for (let i = 0; i < this.users.length; i++) {
            if (username === this.users[i].username) {
                return false;
            }
        }

        return true;
    },
    addUser: function(newUser, res) {
        /*
            Add a new user to the list and data file

            @param newUser The new user being added
            @param res The response object to handle responding correctly
         */
        /*let user = {};
        user.username = newUser.username;
        user.password = newUser.password;
        user.displayName = newUser.displayName;*/

        if (this.uniqueUsername(newUser.username)) {
            this.users.push(newUser);
            this.saveData(res, {good: 201, bad: 400});
        } else {
            res.status(400);
            res.send({unique: false});
        }
    },
    findUser: function(username) {
        /*
            Locate the index of a user in the list by username

            @param username The username of the user to be found

            @return The index in the users array which holds the information for the desired User. Returns -1 if not found
         */
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].username === username) {
                return i;
            }
        }

        return -1;
    },
    deleteUser: function(username, res) {
        /*
            Remove the user from the list and data file

            @param username The username of the user to be removed
            @param res The response object to handle responding correctly

            @return The user object from the list
         */
        let index = this.findUser(username);

        if (index > -1) {
            res.body = this.users.splice(index, 1);
            this.saveData(res);
        } else {
            res.status(404);
            res.send();
        }
    },
    deleteServer: function(ipAddress, res) {
        /*
            Remove the server from the list and data file

            @param ipAddress The IP Address of the server to be removed
            @param res The response object to handle responding correctly

            @return The server object from the list
         */

        let index = this.findServer(ipAddress);

        if (index > -1) {
            res.body = this.servers.splice(index, 1);
            this.saveData(res)
        } else {
            res.status(404);
            res.send();
        }
    },
    updateServer: function(ipAddress, newInfo, res) {
        /*
            Update the information for a specific server

            @param ipAddress The IP Address of the server that is being updated
            @param newInfo JSON containing the new information for the specified server
            @param res The response object to handle responses correctly
         */
        let index = this.findServer(ipAddress);

        if (index > -1) {
            this.servers[index] = newInfo
            this.saveData(res)
        } else {
            res.status(404);
            res.send();
        }
    },
    updateUser: function(username, newInfo, res) {
        /*
            Update the information for a specific server

            @param username The username of the user that is being updated
            @param newInfo JSON containing the new information for the specified user
            @param res The response object to handle responses correctly
         */
        let index = this.findServer(username);

        if (index > -1) {
            this.users[index] = newInfo
            this.saveData(res)
        } else {
            res.status(400);
            res.send();
        }
    }
}

module.exports = utils;