// config/passport.js

var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/user.js');

module.exports = function(passport) {

	// passport session setup
	// ------------------------------------------
	// required for persistent login sessions
	// passport needs ability to serialize and deserialize users out of session

	// serialize user for the session
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	// deserialize user
	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});

	// local signup
	// ------------------------------------------
	// using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'
	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true // lets us pass the entire request to the callback
		}, function (req, email, password, done) {
			// asynchronous
			// User.findOne wont fire until data is sent back
			process.nextTick(function() {
				User.findOne({ 'local.email': email }, function (err, user) {
					if(err) { return done(err) };

					// user's email already exists in the database
					if (user) {
						return done(null, false, { message: 'That email is already taken.' });
					}

					else {
						// check to see if username is taken
						// since we want to use the username as an url parameter
						// for access profiles, it needs to be unique
						User.findOne({ 'local.username': req.body.username }, function (err, user) {
							if (err) { return done(err) };

							if (user) { 
								return done(null, false, { message: 'That username is already taken.' } ); 
							}

							else {
								// if no user with that email or username, create the user
								var newUser = new User();

								// set user's local credentials
								newUser.local.username = req.body.username;
								newUser.local.email = email;
								newUser.local.password = newUser.generateHash(password);

								// save the new user
								newUser.save(function (err) {
									if (err) { throw err };
									return done(null, newUser);
								});								
							};
						});
					};
				});
			});
		}
	));

	// local login
	// ------------------------------------------
	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
		}, function (req, email, password, done) {
			User.findOne( {'local.email': email }, function (err, user) {
				if(err) { return done(err) };

				// user's email doesn't exist in the database
				if (!user) {
					return done(null, false, { message: 'User does not exist.' });
				}
				// user's password doesn't match password in database
				if (!user.validPassword(password)) {
					return done(null, false, { message: 'Sorry, incorrect password.' });
				}

				// email and password are correct, return successful user
				return done(null, user);
			});
		}
	));

};