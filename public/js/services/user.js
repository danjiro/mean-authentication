angular.module('userService', [])

	.factory('UserService', ['$http', '$resource', function($http, $resource) {
		
		return {
			getUser: function() {
				return $http.get('/api/user/me');
			}
			// getTodos: function() {
			// 	return $http.get('/api/user/todos');
			// },
			// createTodo: function(todoData) {
			// 	return $http.post('/api/user/todos', todoData);
			// },
			// getTodoDetails: function(todo_id) {
			// 	return $http.get('/api/user/todos/' + todo_id);
			// },
			// updateTodoDetails: function(todo_id, update) {
			// 	return $http.put('/api/user/todos/' + todo_id, update);
			// },
			// deleteTodo: function(todo_id) {
			// 	return $http.delete('/api/user/todos/' + todo_id);
			// }
		};


	}]);	