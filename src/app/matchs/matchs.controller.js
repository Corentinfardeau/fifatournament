'use strict';

angular.module('fifatournament')
	.controller('MatchsCtrl', function ($scope) {
		var state = 0;
		var translateX = (window.innerWidth / 2) - 296;
		var wrapper = document.getElementById('matchs-wrapper');

		$scope.translateR = function() {
			state++;
			translateX -= 499.5;
			wrapper.style.webkitTransform = 'translate3D(' + translateX + 'px,0,0)';
		}
		$scope.translateL = function() {
			if(state === 0) return;
			state--;
			translateX += 499.5;
			wrapper.style.webkitTransform = 'translate3D(' + translateX + 'px,0,0)';
		}
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

