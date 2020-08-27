const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const xhttp = new XMLHttpRequest();
/*
    Only needed for debugging purposes

let logger = require('morgan');

*/

/*
        Routing is handled by appRoutes

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');

*/

let app = express();

/*
    Only used for debugging purposes

app.use(logger('dev'));

*/
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*
        Routing is handled by appRoutes

app.use('/', indexRouter);
app.use('/users', usersRouter);

*/


// TODO: Place any API routes in this file

app.post('/api/users', function(req, res) {
    xhttp.open('GET', './res/data/login.xml');
    let xmlDoc;

    xhttp.onreadystatechange = () => {
        if (this.readystate === 4 && (this.status === 200 || this.status === 304)) {
            xmlDoc = this.responseXML;
        }
    }

    xhttp.onload = () => {
        const users = xmlDoc.getElementsByTagName('Users')[0];

        users.appendChild(req.body)
    }
})

app.route('/api/users/valid').get(function(req, res) {
    if (req.body.username === 'admin' && req.body.password === 'password')
        res.send({message: 'Login valid', valid: true})
})

module.exports = app;
