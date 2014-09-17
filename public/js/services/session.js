angular.module('sessionService', [])

	.service('SessionService', function() {

		this.create = function(id, username, email) {
			this.id = id;
			this.username = username;			
			this.email = email;
		};
		this.destroy = function() {
			this.id = null;
			this.username = null;
			this.email = null;
		};

		return this;

	});	