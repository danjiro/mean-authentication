angular.module('authService', ['ngResource', 'sessionService', 'ui.router'])

	.factory('AuthService', ['$http', '$resource', '$state', 'SessionService', function($http, $resource, $state, SessionService) {
		
		return {
			isAuthenticated: function() {
				return !!SessionService.id;
			},
			login: function(email, password) {
				return $http.post('/auth/login', {email: email, password: password})
					.success(function (user) {
						SessionService.create(user._id, user.local.username, user.local.email);
						$state.transitionTo('user');
					});
			},
			signup: function(username, email, password) {
				return $http.post('/auth/signup', {username: username, email: email, password: password})
					.success(function (user) {
						SessionService.create(user._id, user.local.username, user.local.email);
						$state.transitionTo('user');
					});
			},
			logout: function() {
				return $http.get('/auth/logout')
					.success(function() { 
						SessionService.destroy();
						$state.transitionTo('index');
					});
			}
		};

	}]);	