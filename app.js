/*
    Requires for different libraries
 */

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const jsBase64 = require('js-base64');
const fs = require('fs');
const utils = require('./api/utils/utils');
const Timer = require('./api/utils/timer');
/*const bodyParser = require('body-parser');*/


/*
    Some variables for the server applications
 */
let currentInterval = 2;

/*
    Logger file setup
 */

let logger = require('morgan');
const logStream = fs.createWriteStream(path.join(__dirname, 'logs/systems_api.log'), {flags: 'a'});
let temp;

try {
    temp = fs.opendirSync(path.join(__dirname, 'logs'));
    console.log('Directory already exists');
} catch (ex) {
    fs.mkdirSync(path.join(__dirname, 'logs'));
    try {
        temp = fs.opendirSync(path.join(__dirname, 'logs'));
    } catch (ex) {
        throw Error('Failed to create the directory');
    }
} finally {
    temp.closeSync();
}

/*try {
    fs.accessSync(path.join(__dirname, 'logs/systems_api.log'));
} catch (ex) {
}*/

/*
        App setup functions

*/

let app = express();

    /*Only used for debugging purposes*/

app.use(logger('tiny', {
    stream: logStream
}));

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

app.put('/api/users/login', (req, res) => {
    if (req.headers.authorization) {
        let auth = jsBase64.decode(req.headers.authorization.split(' ')[1]);
        let username = auth.split(':')[0];
        let password = auth.split(':')[1];

        if (utils.checkAuth(username, password)) {
            utils.changePassword(req.query.p0, jsBase64.decode(req.body.newPassword));
        } else {
            res.status(401);
            res.send();
        }
    } else {
        res.status(401);
        res.send();
    }
})

app.get('/api/users/reset', (req, res) => {
    if (req.headers.authorization) {
        let auth = jsBase64.decode(req.headers.authorization.split(' ')[1]);
        let username = auth.split(':')[0];
        let password = auth.split(':')[1];

        if (utils.checkAuth(username, password)) {
            utils.reset(req.body.email).then((err, info) => {
                if (err)
                    res.sendStatus(400);

                res.sendStatus(200);
            });
            res.sendStatus(200);
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
            if (req.query.p0){
                let index = utils.findServer(req.query.p0);
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
            utils.deleteServer(req.query.p0, res);
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
            utils.updateServer(req.query.p0, req.body, res);
        } else {
            res.status(401);
            res.send();
        }
    } else {
        res.status(401);
        res.send();
    }
})

app.get('/api/servers/checked', (req, res) => {
    if (req.headers.authorization) {
        let auth = jsBase64.decode(req.headers.authorization.split(' ')[1]);
        let username = auth.split(':')[0];
        let password = auth.split(':')[1];

        if (utils.checkAuth(username, password)) {
            res.json({date: utils.lastChecked});
        } else {
            res.status(401);
            res.send();
        }
    } else {
        res.status(401);
        res.send();
    }
})

app.get('/api/servers/timer', (req, res) => {
    if (req.headers.authorization) {
        let auth = jsBase64.decode(req.headers.authorization.split(' ')[1]);
        let username = auth.split(':')[0];
        let password = auth.split(':')[1];

        if (utils.checkAuth(username, password)) {
            res.send({interval: currentInterval});
        } else {
            res.status(401);
            res.send();
        }
    } else {
        res.status(401);
        res.send();
    }
})

app.put('/api/servers/timer', (req, res) => {
    if (req.headers.authorization) {
        let auth = jsBase64.decode(req.headers.authorization.split(' ')[1]);
        let username = auth.split(':')[0];
        let password = auth.split(':')[1];

        if (utils.checkAuth(username, password)) {
            if (req.body.interval > 0) {
                timer.reset(utils.convertToMinutes(req.body.interval));
            } else {
                timer.stop();
            }

            res.sendStatus(200);
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
    Password Reset Link Handles
 */

app.get('/login/reset', (req, res) => {
    let info = req.query;
    console.log(JSON.parse(jsBase64.decode(req.query.p0)));
    res.sendStatus(200);
})

let timer = new Timer(function() {
    utils.checkServers();
}, utils.convertToMinutes(currentInterval))

module.exports = app;
