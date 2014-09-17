/**
* PublicService Module
*
* Service to access public data through the API
*/
angular.module('publicService', [])

	.factory('PublicService', ['$http', function($http){

		return {
			getTodos: function() {
				return $http.get('/api/public/todos');
			}
		};
		
	}]);