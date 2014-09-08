// js/core.js

angular.module('authApp', ['ngRoute', 'authController' /* , 'authService' */])

	.config(['$routeProvider', '$locationProvider', 
		function($routeProvider, $locationProvider) {
			$routeProvider
				.when('/', {
					templateUrl: '/partials/main.html',
					controller: 'MainCtrl',
					controllerAs: 'main'
				}).
				.when('/login', {
					templateUrl: '/partials/login.html'/*,
					controller: 'MainCtrl',
					controllerAs: 'main' */
				})
				.when('/signup', {
					templateUrl: '/partials/signup.html'/*,
					controller: 'MainCtrl',
					controllerAs: 'main' */
				});								
				// .when('/todo/:todo_id', {
				// 	templateUrl: '/partials/todoDetails.html',
				// 	controller: 'TodoDetailsCtrl'
				// });
				// .otherwise({
				// 	redirectTo: '/'
				// });

			$locationProvider.html5Mode(true);
	}]);