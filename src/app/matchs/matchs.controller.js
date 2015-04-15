'use strict';

angular.module('fifatournament')
	.controller('MatchsCtrl', function ($scope) {

	})
	.directive('macths',function() {
		return  {
			restrict: 'E',
			template : '<div class="card-edit">' + 
			
			'</div>',
			link: function ($scope, $element) {
				console.log($scope.config.alea);
			}
		}
	});

