/*
    Requires for different libraries
 */

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const convert = require('./api/utils/convert')
/*const crypto = require('./api/utils/crypto.js')*/
const crypto = require('crypto')

/*
    Constants for pathing
 */
const credPath = './api/data/login.xml';
const serverPath = './api/data/servers.xml';
let logins = [];
/*const bodyParser = require('body-parser');*/
/*    Only needed for debugging purposes*/

let logger = require('morgan');


/*
        Routing is handled by appRoutes

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');

*/

let app = express();

    /*Only used for debugging purposes*/

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*
        Routing is handled by appRoutes

app.use('/', indexRouter);
app.use('/users', usersRouter);

*/


// TODO: Place any API routes in this file

app.post('/api/users/login', (req, res) => {
    if (req.body.username === 'admin' && req.body.password === 'password') {
        res.json({status: 200, message: 'Access Granted'});
    } else {
        res.json({status: 420, message: 'Access Denied'});
    }
})

app.get('/api/servers', (res) => {
    res.send()
})

app.post('/api/servers', ((req, res) => {
    console.log(window.atob(req.headers.authorization));
    res.send('Post received');
}))

function loadCredentials() {
    const xhttp = new XMLHttpRequest()

    xhttp.onreadystatechange = ()=>{
        if (this.readyState === 4 && (this.status === 200 || this.status === 304)) {
            logins = convert.prototype.convertLoginXML(xhttp.responseXML.getElementsByTagName('User'));
        }
    }

    xhttp.open('GET', credPath, true);
    xhttp.send();
}

function loadServers() {

}

module.exports = app;
