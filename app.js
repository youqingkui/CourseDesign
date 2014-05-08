var express = require('express');
var connect = require('connect');
var MongoStore = require('connect-mongo')(connect);
var settings = require('./settings');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var fllors = require('./routes/fllors');
var holders = require('./routes/holders');
var costs = require('./routes/costs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//链接到mongodb session
app.use(connect.session({
    secret: settings.cookieSecret,
    store: new MongoStore({
    db: settings.db
    })
}));

app.use(function(req, res, next){
    res.locals.user = req.session.user;
    res.locals.err = req.session.error;
    req.session.error = null;
                                                    
    // console.log("err" ,  req.session.error);
                                                    
    next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/fllors', fllors);
app.use('/holders', holders);
app.use('/costs', costs);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
