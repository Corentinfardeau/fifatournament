'use strict';

angular.module('fifatournament')
	.controller('MatchsCtrl', function ($scope) {
		var state = 0;
		var translateX = (window.innerWidth / 2) - 296;
		var wrapper = document.getElementById('matchs-wrapper');
		var start_btn = document.getElementById('start-btn');
		var matchs = document.getElementsByClassName('match-card');
		var matchs_active = document.querySelectorAll('.match-card.active');

		$scope.start_match = function() {
			for(var i = 0, l = matchs.length; i < l; i++) {
				matchs[i].classList.add('disabled');
				matchs[i].classList.remove('active');
			}
			matchs[state].classList.remove('disabled');
			matchs[state].classList.add('active');
			document.getElementById('title').classList.add('active');
			start_btn.innerHTML = "Fin du match";
			matchs_active = document.querySelectorAll('.match-card.active');
		}

		$scope.translateR = function() {
			if(matchs_active.length > 0) return;
			state++;
			translateX -= 499.5;
			wrapper.style.webkitTransform = 'translate3D(' + translateX + 'px,0,0)';
		}
		$scope.translateL = function() {
			if(state === 0 || matchs_active.length > 0) return;
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

