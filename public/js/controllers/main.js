angular.module('authController', [])

	.controller('MainCtrl', ['$scope', '$http', function($scope, $http) {


	}])
	.controller('LoginCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
		$scope.login = function(email, password) {
			console.log(email + ' ' + password);
			$http.post('/login', {email: email, password: password})
				.success(function (data) {
					console.log(data);
					$location.path('/profile')
				})
				.error(function (status, data) {
					console.log('error' + status + ' ' + data);
				});
		};

	}])
	.controller('ProfileCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
		$http.get('/profile').success(function (user) {
			$scope.user = user;
			console.log(user);
		});

		$scope.logout = function() {
			$http.get('/logout').success(function (message) {
				console.log(message);
				$location.path('/');
			});
		};

	}]);	