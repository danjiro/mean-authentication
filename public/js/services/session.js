angular.module('sessionService', [])

	.service('SessionService', ['$window', function($window) {

		this.create = function() {
			this.sessionOwner = JSON.parse($window.sessionStorage.sessionOwner);
		};
		this.destroy = function() {
			this.sessionOwner = null;
		};
		this.sessionOwner = $window.sessionStorage.sessionOwner ? JSON.parse($window.sessionStorage.sessionOwner) : null;

		return this;

	}]);	