angular.module('authController', [])

	.controller('MainCtrl', ['$scope', '$http', function($scope, $http) {
		$scope.formData = {};
		// set default order to show newest todos first
		$scope.reverse = true;	

	}]);