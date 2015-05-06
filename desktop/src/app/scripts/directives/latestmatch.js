'use strict';

angular.module('fifatournament')
	.directive('latestmatch', function () {
		return {
            templateUrl: 'app/views/partials/_latestMatch.html',
            restrict: 'E',
		};
});