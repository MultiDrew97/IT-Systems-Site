/*
    Requires for different libraries
 */

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const jsBase64 = require('js-base64');
const utils = require('./api/utils/utils');

/*const bodyParser = require('body-parser');*/

let logger = require('morgan');


/*
        App setup functions

*/

let app = express();

    /*Only used for debugging purposes*/

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Load the data for the valid users and the servers
utils.loadData();

app.get('/api/users/login', (req, res) => {
    /*
        Check the login credentials that were sent to the server
     */

    if (req.headers.authorization) {
        let auth = jsBase64.decode(req.headers.authorization.split(' ')[1]);
        let username = auth.split(':')[0];
        let password = auth.split(':')[1];

        if (utils.checkAuth(username, password)) {
            let creds = jsBase64.decode(req.query.credentials).split(':');
            if (utils.checkLogin(creds[0], creds[1])) {
                res.send({valid: true});
            } else {
                res.send({valid: false});
            }
        } else {
            res.status(401);
            res.send();
        }
    } else {
        res.status(401);
        res.send();
    }
})

app.get('/api/users', (req, res) => {
    /*
        Retrieve the entire list of users
     */
    if (req.headers.authorization) {
        let auth = jsBase64.decode(req.headers.authorization.split(' ')[1]);
        let username = auth.split(':')[0];
        let password = auth.split(':')[1];

        if (utils.checkAuth(username, password)) {
            res.json(utils.users);
        } else {
            res.status(401);
            res.send();
        }
    } else {
        res.status(401);
        res.send();
    }
})

app.post('/api/users', (req, res) => {
    /*
        Create a new user if needed. Most likely will never be used, but is here already if needed
     */
    if (req.headers.authorization) {
        let auth = jsBase64.decode(req.headers.authorization.split(' ')[1]);
        let username = auth.split(':')[0];
        let password = auth.split(':')[1];

        if (utils.checkAuth(username, password)) {
            utils.addUser(req.body, res);
        } else {
            res.status(401);
            res.send();
        }
    } else {
        res.status(401);
        res.send();
    }
})

app.delete('/api/users', (req, res) => {
    if (req.headers.authorization) {
        let auth = jsBase64.decode(req.headers.authorization.split(' ')[1]);
        let username = auth.split(':')[0];
        let password = auth.split(':')[1];

        if (utils.checkAuth(username, password)) {
            utils.deleteUser(req.query.username, res);
        } else {
            res.status(401);
            res.send();
        }
    } else {
        res.status(401);
        res.send();
    }
})

app.put('/api/users', (req, res) => {
    /*
        Modify a server's information in the list of servers being watched
     */

    if (req.headers.authorization) {
        let auth = jsBase64.decode(req.headers.authorization.split(' ')[1]);
        let username = auth.split(':')[0];
        let password = auth.split(':')[1];

        if (utils.checkAuth(username, password)) {
            utils.updateUser(req.query.username, req.body, res);
        } else {
            res.status(401);
            res.send();
        }
    } else {
        res.status(401);
        res.send();
    }
})


/*
    Server list based API Methods
 */

app.get('/api/servers', (req, res) => {
    /*
        Get the entire list of all servers currently being watched
        Or specific information about a single server
     */
    if (req.headers.authorization) {
        let auth = jsBase64.decode(req.headers.authorization.split(' ')[1]);
        let username = auth.split(':')[0];
        let password = auth.split(':')[1];

        if (utils.checkAuth(username, password)) {
            if (req.query.ipAddress){
                let index = utils.findServer(req.query.ipAddress);
                if (index > -1) {
                    res.send(utils.servers[index]);
                } else {
                    res.status(404);
                    res.send();
                }
            } else {
                res.json(utils.servers);
            }
        } else {
            res.status(401);
            res.send();
        }
    } else {
        res.status(401);
        res.send();
    }
})

app.post('/api/servers', ((req, res) => {
    /*
        Add a new server to the list of servers
     */

    if (req.headers.authorization) {
        let auth = jsBase64.decode(req.headers.authorization.split(' ')[1]);
        let username = auth.split(':')[0];
        let password = auth.split(':')[1];

        if (utils.checkAuth(username, password)) {
            utils.addServer(req.body, res);

        } else {
            res.status(401);
            res.send();
        }
    } else {
        res.status(401);
        res.send();
    }
}))

app.delete('/api/servers', (req, res) =>{
    /*
        Delete a server from the list of servers being watched
     */

    if (req.headers.authorization) {
        let auth = jsBase64.decode(req.headers.authorization.split(' ')[1]);
        let username = auth.split(':')[0];
        let password = auth.split(':')[1];

        if (utils.checkAuth(username, password)) {
            utils.deleteServer(req.query.ipAddress, res);
        } else {
            res.status(401);
            res.send();
        }
    } else {
        res.status(401);
        res.send();
    }
})

app.put('/api/servers', (req, res) => {
    /*
        Modify a server's information in the list of servers being watched
     */

    if (req.headers.authorization) {
        let auth = jsBase64.decode(req.headers.authorization.split(' ')[1]);
        let username = auth.split(':')[0];
        let password = auth.split(':')[1];

        if (utils.checkAuth(username, password)) {
            utils.updateServer(req.query.ipAddress, req.body, res);
        } else {
            res.status(401);
            res.send();
        }
    } else {
        res.status(401);
        res.send();
    }
})

module.exports = app;
