angular.module('authService', ['sessionService', 'ui.router'])

	.factory('AuthService', ['$http', '$state', '$window', 'SessionService', function($http, $state, $window, SessionService) {
		
		return {
			isAuthenticated: function() {
				return !!SessionService.sessionOwner;
			},
			login: function(email, password) {
				return $http.post('/auth/login', {email: email, password: password})
					.success(function (user) {
						$window.sessionStorage.sessionOwner = JSON.stringify({username: user.local.username, email: user.local.email});
						SessionService.create();
						$state.transitionTo('user');
					});
			},
			signup: function(username, email, password) {
				return $http.post('/auth/signup', {username: username, email: email, password: password})
					.success(function (user) {
						$window.sessionStorage.sessionOwner = JSON.stringify({username: user.local.username, email: user.local.email});
						SessionService.create();
						$state.transitionTo('user');
					});
			},
			logout: function() {
				return $http.get('/auth/logout')
					.success(function() { 
						SessionService.destroy();
						delete $window.sessionStorage.sessionOwner;
						$state.transitionTo('index');
					});
			}
		};

	}]);	