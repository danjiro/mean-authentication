// app/routes.js

var User = require('./models/user.js');
var Todo = require('./models/todo.js');

module.exports = function (app, passport) {

	// homepage [access: GET @ /]
	// ------------------------------------------
	// app.get('/', function (req, res) {
	// 	// res.render('index.ejs');
	// });

	// get newest 20 todos [access: GET @ /api/public/todos]
	// ------------------------------------------
	app.get('/api/public/todos', function (req, res) {

		Todo.find({}, '-watchers -__v -_id', { sort: { 'submitted': -1 }, limit: 20 })
			.populate({
				path: '_creator',
				select: 'local.username -_id'
			})
			.exec(function (err, todo) {
				if (err) (res.send(err))
					
				res.json(todo);
			});

	});

	// login [access: POST @ /auth/login]
	// ------------------------------------------
	app.post('/auth/login', function (req, res, next) {
		passport.authenticate('local-login', { session: false, failureFlash: true }, function (err, user, info) {
			if (err || !user) {
				res.status(400).send(info);
			}
			else {
				req.logIn(user, function (err) {
					if (err) { return next(err) }
					res.send(user);
				})
			};
		})(req, res, next);
	});

	// logout [access: GET @ /auth/logout]
	// ------------------------------------------
	app.get('/auth/logout', function (req, res) {
		req.logout();
		res.send({ message: 'Logged out' });
	});

	// process signup form
	app.post('/auth/signup', function (req, res, next) {
		passport.authenticate('local-signup', { session: false, failureFlash: true }, function (err, user, info) {
			if (err || !user) {
				res.status(422).send(info);
			}
			else {
				req.logIn(user, function (err) {
					if (err) { return next(err) }
					res.send(user);
				})
			};
		})(req, res, next);
	});	

	// returns current authenticated user [access: GET @ /api/user/me]
	// ------------------------------------------
	app.get('/api/user/me', isLoggedInApi, function (req, res) {
		res.send(req.user);
	});

	// get user's todos [access: GET @ /api/user/todos]
	// ------------------------------------------
	app.get('/api/user/todos', isLoggedInApi, function (req, res) {

		User.findOne({ 'local.email': req.user.local.email })
			.populate({
				path: 'todos',
				select: 'text done submitted'
			})
			.exec(function (err, user) {
				res.json(user.todos);
			});

	});

	// create new todo [access: POST @ /api/user/todos]
	// ------------------------------------------
	app.post('/api/user/todos', isLoggedInApi, function (req, res) {

		// Create new todo
		Todo.create({
			text: req.body.text,
			done: false,
			_creator: req.user._id 
		}, function (err, todo) {
			if (err) { res.send(err); }

			User.findOne({'local.email': req.user.local.email })
				.exec(function (err, user) {
					if (err) { res.send(err) };
					user.todos.push(todo._id);
					user.save(function (err, user) {
						if (err) { res.send(err) }

						Todo.populate(user, { path: 'todos' }, function (err, user) {
							if (err) { res.send(err) }

							var todos = { todos: user.todos };
							res.send(todos);
						});
					});
				});

			// Todo.findOne({ _id: todo._id })
			// 	.populate('_creator')
			// 	.exec(function (err, todo) {
			// 		if(err) { res.send(err) }

			// 		res.send({message: todo._creator.local.email});
			// 	});
		});
	});

	// get todo details [ access: GET @ /api/todos/todo_id ]
	app.get('/api/user/todos/:todo_id', hasAccessToTodo, function(req, res) {
		Todo.findById( req.params.todo_id, function(err, todo) {
			if (err) { res.send(err); }
			res.json(todo);
		});
	})	

	// delete todo [access: DELETE @ /api/user/todos/todo_id]
	// ------------------------------------------

	// delete a todo [ access: DELETE @ /api/todos/todo_id ]
	app.delete('/api/user/todos/:todo_id', hasAccessToTodo, function(req, res) {

		// delete the todo
		Todo.remove({
			_id: req.params.todo_id
		}, function(err, todo) {
			if (err) { res.send(err); }

			// remove the todo from user's todo list
			User.findByIdAndUpdate(req.user._id,
				{ $pull: { todos: req.params.todo_id } }, function (err, user) {
					if (err) { res.send(err) }

					res.send({ message: 'Todo deleted' });

					// repopulate user's todo list
					// Todo.populate(user, 
					// 	{ path: 'todos' }, function (err, user) {
					// 	if (err) { res.send(err) }

					// 	res.send(user.todos);
					// });
				});
			});

	});

	// update a todo [ access: PUT @ /api/todos/todo_id ]
	app.put('/api/user/todos/:todo_id', hasAccessToTodo, function(req, res) {
		// update a todo
		Todo.findByIdAndUpdate(req.params.todo_id, 
			req.body,
			function(err, todo) {
				if (err) { res.send(err); }; 
				res.json(todo);
		});

	});	

};

// route middleware to make sure user is logged in
function hasAccessToTodo(req, res, next) {

	// if user is authenticated, continue
	if (req.isAuthenticated()) {
		Todo.findOne({ '_id': req.params.todo_id })
			.exec(function (err, todo) {

				if (err) { res.send(err) }
				if (req.user._id.equals(todo._creator)) {
					return next();
				}
				else { res.send({ message: 'You do not have access to alter this todo' }); };
			});
	}

	// if not, redirect them to homepage
	else res.send({ message: 'Not authorized to access todo' });

};

function isLoggedInApi(req, res, next) {

	// if user is authenticated, continue
	if (req.isAuthenticated()) {
		return next();
	}

	// if not, redirect them to homepage
	res.status(401).send({ message: 'Not authorized' });

};