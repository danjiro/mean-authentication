// server.js

// set up
// ----------------------------------------------
var express = require('express');
var app = express();
var port = process.env.PORT || 1337;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/databases.js');

// configuration
// ----------------------------------------------
mongoose.connect(configDB.url);

require('./config/passport')(passport);

app.use(morgan('dev')); // log all requests to console
app.use(cookieParser()); // read cookie-parser
app.use(bodyParser()); // get information from html forms
// app.use(express.static(__dirname + '/public')); // set files directory to /public
app.use('/bower_components', express.static(__dirname + '/bower_components')); // set bower components folder to static location

app.set('view engine', 'ejs'); // set up ejs for templating

// passport stuff
app.use(session({ secret: 'testtest' })); // session secret
app.use(passport.initialize());
app.use(passport.session());  // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes
// ----------------------------------------------
require('./app/routes.js')(app, passport);

// launch
// ----------------------------------------------
app.listen(port);
console.log('Listening on ' + port);