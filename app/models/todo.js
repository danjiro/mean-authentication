// app/models/todo.js

	// require mongoose because creating mongoose model
	var mongoose = require('mongoose');

	var todoSchema = mongoose.Schema({
		text: String,
		done: Boolean,
		submitted: { type: Date, default: Date.now },
		_creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		watchers: [{ type: Number, ref: 'User '}]
	});
	module.exports = mongoose.model('Todo', todoSchema);