// js/controllers/main.js

'use strict'

angular.module('authController', [])
	
	// main app controller. encompasses entire app
	// ------------------------------------------
	.controller('AppCtrl', ['$scope', '$state', 'SessionService', 'AuthService', function($scope, $state, SessionService, AuthService) {

		$scope.$watch(AuthService.isAuthenticated, function() {
			if (AuthService.isAuthenticated) {
				$scope.sessionOwner = SessionService.sessionOwner;
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

	.controller('UserCtrl', ['$scope', '$state', 'UserService', 'SessionService', function($scope, $state, UserService, SessionService) {

	}])

	.controller('UserAdminCtrl', ['$scope', '$state', 'UserService', function($scope, $state, UserService){
		UserService.getUser()
			.success(function (user) { $scope.user = user; })
			.error(function (err) { $state.transitionTo('login'); });			
	}])

	.controller('UserTodoCtrl', ['$scope', '$state', 'Todo', function($scope, $state, Todo){
		$scope.todos = Todo.query();
		$scope.todo = new Todo();
		$scope.reverse = true;							

		$scope.createTodo = function() {
			if ($scope.todo.text) {
				$scope.todo.$save(function(user) { 
					$scope.todos = user.todos;
					$scope.todo = new Todo();
				});				
			}
		};

		// update todo
		// --------------------------------------
		$scope.updateTodo = function(id, fields, item) {
			Todo.update({ id: id }, fields, function(todo) {
				// pass whole todo object through and use indexOf(item) because 
				// angular's orderby filter points $index to the ordered list				
				$scope.todos[$scope.todos.indexOf(item)] = todo;									
			});
		};			
	}])

	.controller('UserTodoDetailsCtrl', ['$scope', '$state', '$stateParams', 'Todo', function($scope, $state, $stateParams, Todo){

			$scope.todoDetails = Todo.get({ id: $stateParams.todo_id }, function() {
				$scope.originalText = $scope.todoDetails.text;
			});

			// DELETE=================================
			$scope.deleteTodo = function() {
				Todo.delete({ id: $stateParams.todo_id }, function() {
					$state.transitionTo('user.todos');
				});
			};	

			$scope.updateTodoDetails = function(fields) {
				$scope.todoDetails = Todo.update({ id: $stateParams.todo_id }, fields, function() {
					$scope.originalText = $scope.todoDetails.text;
				});
			};					

	}]);