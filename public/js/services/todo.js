/**
* todoService Module
*
* Todo CRUD
*/
angular.module('todoService', [])

	.factory('Todo', ['$resource', function($resource){

		return $resource('/api/user/todos/:id', { id: '@_id' }, {
			// 'save': { method: 'POST', isArray: false }
			// 'query': { method:'get', isArray: true, cache: true },
			'update': { method: 'put' }
		});

	}]);			