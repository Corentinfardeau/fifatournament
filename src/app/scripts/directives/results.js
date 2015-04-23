'use strict';

angular.module('fifatournament')
	.directive('results', function () {
		return {
            templateUrl: 'app/views/partials/_results.html',
            restrict: 'E',
		};
});