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
const logs = new (require('./api/utils/logger'))();
/*let log = new logClass('IT-Systems-Site-Console.log', 'IT-Systems-Site-Error.log');*/

/*const bodyParser = require('body-parser');*/


/*
    Some variables for the server applications
 */
let currentInterval = 2;

/*
    Access logger file setup
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
        logs.error('Failed to create the directory', ex);
        throw Error('Failed to create the directory');
    }
} finally {
    temp.closeSync();
}

/*
    Create connection to DB
 */

let db;

try {
    logs.log('Connecting to Database');
    console.log('Connecting to Database');
    db = new (require('./api/utils/db'))();
    logs.log('Connected to Database');
} catch (ex) {
    console.log(ex);
    logs.error('Failed to connect to the database', ex);
}

/*db.getServers().then(servers => {
    if (servers) {
        utils.checkServers(servers);
    }
})*/

/*try {
    fs.accessSync(path.join(__dirname, 'logs/systems_api.log'));
} catch (ex) {
}*/

/*
        App setup functions

*/

let app = express();

/*
    Used to create a log of access to the website and what is being sent with what status codes and when
*/

app.use(logger('tiny', {
    stream: logStream
}));

app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html');
app.set('views', `${__dirname}/public/views`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*
        User based api handles
 */
app.get('/api/users/login', (req, res) => {
    /*
        Check the login credentials that were sent to the server
     */

    if (req.headers.authorization) {
        let auth = (jsBase64.decode(req.headers.authorization.split(' ')[1])).split(':');

        if (utils.checkAuth(auth)) {
            let creds = jsBase64.decode(req.query.p0).split(':');
            db.getUser(creds[0]).then(user => {
                if (user) {
                    if (jsBase64.decode(user.pass) === creds[1]) {
                        logs.log('Successful login for following user', user);
                        res.sendStatus(200);
                    } else {
                        logs.log(`Failed to login ${creds[0]}. Incorrect password`);
                        res.sendStatus(401);
                    }
                } else {
                    logs.log(`Failed to login ${creds[0]}. User doesn't exist`);
                    res.sendStatus(401);
                }
            });
            /*if (utils.checkLogin(creds[0], creds[1])) {
                res.send({valid: true});
            } else {
                res.send({valid: false});
            }*/
        } else {
            unAuth(res, auth);
        }
    } else {
        noAuth(res);
    }
})

app.get('/api/users', (req, res) => {
    /*
        Retrieve the entire list of users
     */
    if (req.headers.authorization) {
        let auth = (jsBase64.decode(req.headers.authorization.split(' ')[1])).split(':');

        if (utils.checkAuth(auth)) {
            db.getUsers().then(users => {
                if (users) {
                    logs.log((users.length > 1) ? `Found ${users.length} users in the database` : 'Found 1 user in the database')
                    res.send(users)
                } else {
                    logs.log('No users were found in the database')
                    res.sendStatus(404);
                }
            }, fail => {
                logs.error('Failed to access the database', fail);
                res.sendStatus(500);
            })
            /*res.json(utils.users);*/
        } else {
            unAuth(res, auth);
        }
    } else {
        noAuth(res);
    }
})

app.post('/api/users', (req, res) => {
    /*
        Create a new user if needed. Most likely will never be used, but is here already if needed
     */
    if (req.headers.authorization) {
        let auth = (jsBase64.decode(req.headers.authorization.split(' ')[1])).split(':');

        if (utils.checkAuth(auth)) {
            db.addUser(req.body).then(() => {
                logs.log('Created a new user with following info', JSON.stringify(req.body));
                res.sendStatus(201);
            }, fail => {
                logs.error('Failed to access the database', fail);
                res.sendStatus(500);
            })
            /*utils.addUser(req.body, res);*/
        } else {
            unAuth(res, auth);
        }
    } else {
        noAuth(res);
    }
})

app.delete('/api/users', (req, res) => {
    if (req.headers.authorization) {
        let auth = (jsBase64.decode(req.headers.authorization.split(' ')[1])).split(':');

        if (utils.checkAuth(auth)) {
            db.deleteUser(req.body.user).then(() => {
                logs.log(`Removed ${req.body.user} from the database`);
                res.sendStatus(200);
            }, fail => {
                logs.error('Failed to access the database', fail);
                res.sendStatus(500);
            })
            /*utils.deleteUser(req.query.username, res);*/
        } else {
            unAuth(res, auth);
        }
    } else {
        noAuth(res);
    }
})

/*
    Password Reset Link Handles
 */

app.put('/api/users/login', (req, res) => {
    if (req.headers.authorization) {
        let auth = (jsBase64.decode(req.headers.authorization.split(' ')[1])).split(':');

        if (utils.checkAuth(auth)) {
            logs.log('Received body to change password', JSON.stringify(req.body));
            db.changePassword(req.body).then(() => {
                /*if (user) {
                    user.pass = res.body.pass;
                    user.
                } else {
                    res.sendStatus(404);
                }*/
                logs.log(`Changed password for ${req.body.username}`);
                res.sendStatus(200);
            }, fail => {
                console.log(fail);
                res.sendStatus(500);
            })
            utils.changePassword(req.body)
            res.sendStatus(200);
        } else {
            unAuth(res, auth);
        }
    } else {
        noAuth(res);
    }
})

app.get('/login/reset', (req, res) => {
    logs.log('Serving the password reset page');
    res.status(200).render('forgot.html');
})

app.get('/login/reset/success', (req, res) => {
    logs.log('Serving the reset success page');
    res.status(200).render('success.html');
})

app.get('/api/users/reset', (req, res) => {
    if (req.headers.authorization) {
        let auth = (jsBase64.decode(req.headers.authorization.split(' ')[1])).split(':');

        if (utils.checkAuth(auth)) {
            /*utils.reset(req.query.email).then((err, info) => {
                if (err)
                    res.sendStatus(400);

                res.sendStatus(200);
            });*/
            db.resetRequest(req.query.p0).then((user) => {
                if (user) {
                    utils.reset(user.email);
                    logs.log(`Sent reset email to ${req.query.p0}`);
                    res.sendStatus(200);
                } else {
                    logs.log(`Could not find a user with email: ${req.query.p0}`);
                    res.sendStatus(404);
                }
            }, fail => {
                logs.error('Failed to send reset email', fail)
                res.sendStatus(500);
            })
        } else {
            unAuth(res, auth);
        }
    } else {
        noAuth(res);
    }
})

/*
        Token related api handles
 */

app.get('/api/token/valid', (req, res) => {
    if (req.headers.authorization) {
        let auth = (jsBase64.decode(req.headers.authorization.split(' ')[1])).split(':');

        if (utils.checkAuth(auth)) {
            if (utils.validToken(req.query.p0)) {
                logs.log(`Token ${req.query.p0} was valid`);
                res.sendStatus(200)
            } else {
                logs.log(`Token ${req.query.p0} is invalid`);
                res.sendStatus(401);
            }
        } else {
            unAuth(res, auth);
        }
    } else {
        noAuth(res);
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
        let auth = (jsBase64.decode(req.headers.authorization.split(' ')[1])).split(':');

        if (utils.checkAuth(auth)) {
            if (req.query.p0){
                /*let index = utils.findServer(req.query.p0);
                if (index > -1) {
                    res.send(utils.servers[index]);
                } else {
                    res.status(404);
                    res.send();
                }*/
                db.getServer(req.query.p0).then((server) => {
                    if (server) {
                        logs.log(`${server.serverName} info retrieved`, server);
                        res.send(server);
                    } else {
                        logs.log(`Server with IP Address ${req.query.p0} could not be found`)
                        res.sendStatus(404);
                    }
                }, fail => {
                    logs.error('Failed to access the database', fail);
                    res.sendStatus(400);
                });
            } else {
                /*res.json(utils.servers);*/
                db.getServers().then(servers => {
                    if (servers) {
                        logs.log((servers.length > 1) ? `Found ${servers.length} servers in database` : 'Found 1 server in the database');
                        res.send(servers);
                    } else {
                        logs.log('No servers found in the database')
                        res.sendStatus(404)
                    }
                }, fail => {
                    logs.error('Failed to retrieve info from database', fail)
                })
            }
        } else {
            unAuth(res, auth);
        }
    } else {
        noAuth(res);
    }
})

app.post('/api/servers', ((req, res) => {
    /*
        Add a new server to the list of servers
     */

    if (req.headers.authorization) {
        let auth = (jsBase64.decode(req.headers.authorization.split(' ')[1])).split(':');

        if (utils.checkAuth(auth)) {
            /*utils.addServer(req.body, res);*/
            db.getServer(req.body.ipAddress).then(server => {
                if (server) {
                    logs.log('Server with IP Address already exists in database', server);
                    res.sendStatus(400);
                } else {
                    db.addServer(req.body).then(() => {
                        logs.log('Added a server to the database with following info', JSON.stringify(req.body));
                        res.sendStatus(201);
                    }, fail => {
                        logs.error('Failed to retrieve info from database', fail);
                        res.sendStatus(400);
                    })
                }
            }, fail => {
                logs.error('Failed to retrieve info from database', fail);
                res.sendStatus(500);
            })
        } else {
            unAuth(res, auth);
        }
    } else {
        noAuth(res);
    }
}))

app.delete('/api/servers', (req, res) =>{
    /*
        Delete a server from the list of servers being watched
     */

    if (req.headers.authorization) {
        let auth = (jsBase64.decode(req.headers.authorization.split(' ')[1])).split(':');

        if (utils.checkAuth(auth)) {
            /*utils.deleteServer(req.query.p0, res);*/
            db.deleteServer(req.query.p0).then(()=> {
                logs.log(`Removed server from database with IP: ${req.query.p0}`);
                res.sendStatus(200);
            }, fail => {
                logs.error('Failed to retrieve info from database', fail);
                res.sendStatus(404);
            });
        } else {
            unAuth(res, auth);
        }
    } else {
        noAuth(res);
    }
})

app.put('/api/servers', (req, res) => {
    /*
        Modify a server's information in the list of servers being watched
     */

    if (req.headers.authorization) {
        let auth = (jsBase64.decode(req.headers.authorization.split(' ')[1])).split(':');

        if (utils.checkAuth(auth)) {
            db.updateServer(req.query.p0, req.body).then(() => {
                logs.log(`Updated server with IP: ${req.query.p0} with following information`, JSON.stringify(req.body));
                res.sendStatus(200)
            }, fail => {
                logs.error('Failed to retrieve info from database', fail)
                res.sendStatus(500)
            })
            /*utils.updateServer(req.query.p0, req.body, res);*/
        } else {
            unAuth(res, auth);
        }
    } else {
        noAuth(res);
    }
})

app.get('/api/servers/checked', (req, res) => {
    if (req.headers.authorization) {
        let auth = (jsBase64.decode(req.headers.authorization.split(' ')[1])).split(':');

        if (utils.checkAuth(auth)) {
            logs.log(`Retrieved last checked date: ${(new Date(utils.lastChecked)).toLocaleString()}`);
            res.json({date: utils.lastChecked});
        } else {
            unAuth(res, auth);
        }
    } else {
        noAuth(res);
    }
})

app.get('/api/servers/timer', (req, res) => {
    if (req.headers.authorization) {
        let auth = (jsBase64.decode(req.headers.authorization.split(' ')[1])).split(':');

        if (utils.checkAuth(auth)) {
            logs.log(`Retrieved the current checking interval: ${currentInterval}`);
            res.send({interval: currentInterval});
        } else {
            unAuth(res, auth);
        }
    } else {
        noAuth(res);
    }
})

app.put('/api/servers/timer', (req, res) => {
    if (req.headers.authorization) {
        let auth = (jsBase64.decode(req.headers.authorization.split(' ')[1])).split(':');

        if (utils.checkAuth(auth)) {
            let oldInterval = currentInterval;
            if (req.body.interval > 0) {
                currentInterval = req.body.interval
                timer.reset(utils.convertTime(req.body.interval, 'minutes'));
            } else {
                timer.stop();
            }
            logs.log(`Changed server checking interval from ${oldInterval} to ${currentInterval}`)
            res.sendStatus(200);
        } else {
            unAuth(res, auth)
        }
    } else {
        noAuth(res);
    }
})

let timer;

db.getServers().then(servers => {
    if (servers) {
        utils.checkServers(servers);
        timer = new Timer(function() {
            utils.checkServers(servers);
        }, utils.convertTime(currentInterval, 'minutes'))
    }
})

function unAuth(res, creds) {
    logs.log('Unauthorized user attempted to access API', creds);
    res.sendStatus(401);
}

function noAuth(res) {
    logs.log('Access without proper authorization');
    res.sendStatus(401);
}

module.exports = app;
