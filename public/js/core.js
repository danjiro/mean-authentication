// js/core.js
'use strict';

angular.module('authApp', ['ui.router', 'ngResource', 'authController', 'authService', 'userService', 'publicService', 'todoService', 'ui.bootstrap' ])

	.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', 
		function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

			$stateProvider
				.state('index', {
					url: '/',
					templateUrl: '/partials/main.html',
					controller: 'IndexCtrl'
				})
				.state('login', {
					url: '/login',
					templateUrl: '/partials/login.html',
					controller: 'LoginCtrl'
				})
				.state('signup', {
					url: '/signup',
					templateUrl: '/partials/signup.html',
					controller: 'SignupCtrl', 
				})
				.state('user', {
					// abstract: true,					
					url: '/user',
					templateUrl: '/partials/user.html',
					// resolve: { // need to resolve $scope.user so todos can be inserted (better way to do this?)
					// 	getUser: function(UserService) {
					// 		return UserService.getUser();
					// 	}
					// },					
					controller: 'UserCtrl',
					authenticate: true
				})
					.state('user.admin', {
						url: '/admin',
						templateUrl: '/partials/user.admin.html',
						controller: 'UserAdminCtrl',
						authenticate: true
					})
					.state('user.todos', {
						url: '/todos',
						templateUrl: '/partials/user.todos.html',
						// resolve: { // test to get rid of empty data fields before ajax content is returned
						// 		getTodos: function(UserService) {
						// 			return UserService.getTodos();
						// 		}
						// },
						controller: 'UserTodoCtrl',
						authenticate: true
					})
					.state('user.todoDetails', {
						url: '/todo/details/:todo_id',
						templateUrl: '/partials/user.todoDetails.html',
						controller: 'UserTodoDetailsCtrl',
						authenticate: true
					});												

			$locationProvider.html5Mode(true);
	}])

	.run(['$rootScope', '$state', 'AuthService', function ($rootScope, $state, AuthService) {
		$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if (toState.authenticate && !AuthService.isAuthenticated()) {
				// not authenticated
				$state.transitionTo('login');
				event.preventDefault();
			}
		});
	}]);