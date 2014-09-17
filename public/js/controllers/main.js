// js/controllers/main.js

'use strict'

angular.module('authController', ['ui.router', 'authService', 'userService', 'publicService', 'ui.bootstrap'])
	
	// main app controller. encompasses entire app
	// ------------------------------------------
	.controller('AppCtrl', ['$scope', '$state', 'SessionService', 'AuthService', function($scope, $state, SessionService, AuthService) {
		
		$scope.$watch(AuthService.isAuthenticated, function() {
			if (AuthService.isAuthenticated) {
				$scope.sessionOwner = SessionService.username;
			}
		});


		// route changes with resolves to change until resolve is
		// completed so show spinner to indicate loading. 
		$scope.spinner = false;

		$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
		    if (toState.resolve) {
		        $scope.spinner = true;
		    }
		});
		$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
		    if (toState.resolve) {
		        $scope.spinner = false;
		    }
		});

	}])

	// navigation controller
	// ------------------------------------------
	.controller('NavigationCtrl', ['$scope', 'AuthService', function($scope, AuthService){
		
		$scope.logout = function() { AuthService.logout(); };

		$scope.userNavStatus = {
			isOpen: false
		};

	}])

	// index page controller
	// ------------------------------------------
	.controller('IndexCtrl', ['$scope', 'PublicService', function($scope, PublicService) {
		
		PublicService.getTodos()
			.success(function (todos) { 
				$scope.newestTodos = todos;
			});

	}])

	// login page controller
	// ------------------------------------------
	.controller('LoginCtrl', ['$scope', 'AuthService', function($scope, AuthService) {

		$scope.login = function(email, password) {
			AuthService.login(email, password)
				.error(function (message) {
					$scope.message = message.message;
				});
		};

	}])
	.controller('SignupCtrl', ['$scope', 'AuthService', function($scope, AuthService) {

		$scope.signup = function(username, email, password) {
			AuthService.signup(username, email, password)
				.error(function (message) {
					$scope.message = message.message;
				});
		};

	}])	
	.controller('UserCtrl', ['$scope', '$state', 'UserService', 'getUser', function($scope, $state, UserService, getUser) {
		
		$scope.formData = {};
		$scope.reverse = true;

		$scope.user = getUser.data;
		// UserService.getUser()
		// 	.success(function (user) { $scope.user = user; })
		// 	.error(function (err) { $state.transitionTo('login'); });

		$scope.createTodo = function() {
			if (!$.isEmptyObject($scope.formData)) {
				UserService.createTodo($scope.formData).success(function (todos) {
					$scope.formData = {};
					$scope.user.todos = todos;
				});				
			}
		};

		// update todo
		// --------------------------------------
		$scope.updateTodo = function(id, fields, item) {
			UserService.updateTodoDetails(id, fields)
				.success(function(data) {
					// pass whole todo object through and use indexOf(item) because 
					// angular's orderby filter points $index to the ordered list
					$scope.user.todos[$scope.user.todos.indexOf(item)] = data;
				});
		};		

	}])
	.controller('TodoDetailsCtrl', ['$scope', '$state', '$stateParams', 'UserService', function($scope, $state, $stateParams, UserService){
			UserService.getTodoDetails($stateParams.todo_id).success(function (details) {
				$scope.todoDetails = details;
				
				// save copy of original text in case user cancels updating
				$scope.originalText = $scope.todoDetails.text;
			});

			$scope.updateTodoDetails = function(fields) {
				UserService.updateTodoDetails($stateParams.todo_id, fields).success(function(data) {
					$scope.todoDetails = data;
					$scope.originalText = $scope.todoDetails.text;
				});
			};

			// DELETE=================================
			$scope.deleteTodo = function() {
				UserService.deleteTodo($stateParams.todo_id).success(function(data) {
					$state.transitionTo('user.todos');
				});
			};	
	}]);