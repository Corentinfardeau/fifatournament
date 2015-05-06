'use strict';

angular.module('fifatournament')
	.directive('card', function () {
		return {
            templateUrl: 'app/views/partials/_card.html',
            restrict: 'E',
		};
});