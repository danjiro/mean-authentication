// app/routes.js

var User = require('./models/user.js');
var Todo = require('./models/todo.js');

var auth = function(req, res, next) {
	if(!req.isAuthenticated()) { res.send(401) }
	else { next(); };
}

module.exports = function (app, passport) {

	// homepage
	// ------------------------------------------
	app.get('/', function (req, res) {
		// res.render('index.ejs');
	});

	// login
	// ------------------------------------------
	app.get('/loggedin', function (req, res) {
		res.send(req.isAuthenticated() ? req.user : '0');

		// if(req.isAuthenticated()) { res.redirect('/profile') }
		// res.render('login.ejs', { message: req.flash('loginMessage') }); // pass in flash data if exists
	});

	// process login form
	app.post('/login', passport.authenticate('local-login', {
		// successRedirect: '/profile', // redirect to secure profile page
		// failureRedirect: '/login', // redirect back to login
		failureFlash: true // allow flash message
	}), function (req, res) {
		res.send(req.user);
	});

	// signup
	// ------------------------------------------
	app.get('/signup', function (req, res) {
		if(req.isAuthenticated()) { res.redirect('/profile') }
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile', // redirect to secure profile page
		failureRedirect: '/signup', // redirect back to signup back
		failureFlash: true // allow flash message
	}));

	// profile page
	// ------------------------------------------
	app.get('/profile', isLoggedIn, function (req, res) {
		res.send(req.user);
	});

	// logout
	// ------------------------------------------
	app.get('/logout', function (req, res) {
		req.logout();
		res.send(200, { message: 'logged out' });
		// res.redirect('/');
	});

	// post text to user's profile
	// ------------------------------------------
	app.put('/api/user', isLoggedInApi, function (req, res) {
		// Add text field to current user
		User.findOne( { 'local.email': req.user.local.email }, function (err, user) {
			if(err) { res.send(err) }

			user.text = req.body.text;
			user.save(function (err) { 
				if(err) { res.send(err); } 
				res.send(user);
			});
		});
	});

	// get todos
	// ------------------------------------------
	app.get('/api/user/todo', isLoggedInApi, function (req, res) {
		// Todo.find({ _creator: req.user._id })
		// 	.exec(function (err, todos) {
		// 		if (err) { res.send(err) }

		// 		res.json(todos);
		// 	});

		User.findOne({ 'local.email': req.user.local.email })
			.populate({
				path: 'todos',
				select: 'text done -_id'
			})
			.exec(function (err, user) {
				res.json(user.todos);
			});
	});

	// create new todo
	// ------------------------------------------
	app.post('/api/user/todo', isLoggedInApi, function (req, res) {
		// Create new todo
		Todo.create({
			text: req.body.text,
			done: false,
			_creator: req.user._id 
		}, function (err, todo) {
			if (err) { res.send(err); }

			User.findOne( {'local.email': req.user.local.email })
				.exec(function (err, user) {
					if (err) { res.send(err) };

					user.todos.push(todo._id);
					user.save();
					res.json(user);
				});

			// Todo.findOne({ _id: todo._id })
			// 	.populate('_creator')
			// 	.exec(function (err, todo) {
			// 		if(err) { res.send(err) }

			// 		res.send({message: todo._creator.local.email});
			// 	});
		});
	});

};

// route middleware to make sure user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated, continue
	if (req.isAuthenticated()) {
		return next();
	}

	// if not, redirect them to homepage
	res.redirect('/login');

};

function isLoggedInApi(req, res, next) {

	// if user is authenticated, continue
	if (req.isAuthenticated()) {
		return next();
	}

	// if not, redirect them to homepage
	res.send({ message: 'not authenticated' });

};