'use strict';

angular.module('fifatournament')
	.directive('matchs', function () {
		return {
            templateUrl: 'app/views/partials/_matchs.html',
            restrict: 'E',
		};
});