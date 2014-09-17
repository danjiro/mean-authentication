// app/models/user.js

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define user schema or user models
// ----------------------------------------------
var userSchema = mongoose.Schema({

	local: {
		username: String,
		email: String,
		password: String
	},
	facebook: {
		id: String,
		token: String,
		email: String,
		name: String
	},
	twitter: {
		id: String,
		token: String,
		displayName: String,
		username: String
	},
	google: {
		id: String,
		token: String,
		email: String,
		name: String
	},
	todos: [{type: mongoose.Schema.Types.ObjectId, ref: 'Todo'}]

});

// user schema methods
// ----------------------------------------------
// generate hash
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// check if password is valid
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

// create user model with user schema and export
// ----------------------------------------------
module.exports = mongoose.model('User', userSchema);