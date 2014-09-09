// js/core.js
'use strict';

angular.module('authApp', ['ngRoute', 'authController' /* , 'authService' */])

	.config(['$routeProvider', '$locationProvider', '$httpProvider', 
		function($routeProvider, $locationProvider, $httpProvider) {

			var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {
				var deferred = $q.defer(); // initialize new promise

				// make ajax call to see if user is logged in or not
				$http.get('/loggedin').success(function (user) {
					if (user !== '0') { $timeout(deferred.resolve, 0) } // authenticated
					else { // not authenticated
						$rootScope.message = 'You need to log in.';
						$timeout(function(){ deferred.reject(); }, 0);
						$location.url('/login');
					};
				});

				return deferred.promise;
			};

			$httpProvider.responseInterceptors.push(function($q, $location) {
				return function (promise) {
					return promise.then(function (response) {
						return response;
					}, function (response) {
						if (response.status === 401) {
							$location.url('/login');
							console.log('401');
						}
						return $q.reject(response);
					});
				}
			});

			$routeProvider
				.when('/', {
					templateUrl: '/partials/main.html',
					controller: 'MainCtrl'
				})
				.when('/login', {
					templateUrl: '/partials/login.html',
					controller: 'LoginCtrl'
				})
				.when('/signup', {
					templateUrl: '/partials/signup.html'
					/*controller: 'MainCtrl',
					controllerAs: 'main' */
				})
				.when('/profile', {
					templateUrl: '/partials/profile.html',
					controller: 'ProfileCtrl',
					resolve: {
						loggedin: checkLoggedin
					}
					/*controller: 'MainCtrl',
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