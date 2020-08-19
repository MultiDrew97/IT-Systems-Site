let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
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

module.exports = app;
