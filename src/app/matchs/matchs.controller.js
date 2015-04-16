'use strict';

angular.module('fifatournament')
	.controller('MatchsCtrl', function ($scope) {
		var state = 0;
		var translateX = (window.innerWidth / 2) - 296;
		var wrapper = document.getElementById('matchs-wrapper');
		var start_btn = document.getElementById('start-btn');
		var matchs = document.getElementsByClassName('match-card');
		var matchs_active = document.querySelectorAll('.match-card.active');

		$scope.league = JSON.parse(localStorage.getItem('league'));

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
			if(state === $scope.league.aller.length - 1 || matchs_active.length > 0) return;
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
	.directive('matchs',function() {
		return  {
			restrict: 'E',
			template : '<div class="match-card">' +
				'<div class="home">' +
					'<span class="score" style="color: {{match[0].couleur}};">0</span>' +
					'<span class="name">{{match[0].name}}</span>' +
					'<span class="btn" style="background-color: {{match[0].couleur}};">But</span>' +
				'</div>' +
				'<div class="center">' +
					'-' +
				'</div>' +
				'<div class="outdoor">' +
					'<span class="score" style="color: {{match[1].couleur}};">0</span>' +
					'<span class="name">{{match[1].name}}</span>' +
					'<span class="btn" style="background-color: {{match[1].couleur}};">But</span>' +
				'</div>' +
			'</div>',
			link: function ($scope, $element) {
				console.log($scope.league);
			}
		}
	});

