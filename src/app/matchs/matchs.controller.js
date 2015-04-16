'use strict';

angular.module('fifatournament')
	.controller('MatchsCtrl', function ($scope) {
		var state = 0;
		var translateX = (window.innerWidth / 2) - 296;
		var wrapper = document.getElementById('matchs-wrapper');
		var start_btn = document.getElementById('start-btn');
		var stop_btn = document.getElementById('stop-btn');
		var matchs = document.getElementsByClassName('match-card');
		var live = false;

		$scope.league = JSON.parse(localStorage.getItem('league'));

		$scope.calcMatchs = function() {
			$scope.nbMatchsAller = 0;
			$scope.nbMatchsRetour = 0;
			for(var i = 0, l = $scope.league.aller.length; i < l; i++) {
			}
		}

		$scope.start_match = function() {
			for(var i = 0, l = matchs.length; i < l; i++) {
				matchs[i].classList.add('disabled');
				matchs[i].classList.remove('active');
			}
			matchs[state].classList.remove('disabled');
			matchs[state].classList.add('active');
			document.getElementById('title').classList.add('active');
			document.getElementById('btn-wrapper').classList.add('active');
			live = true;
		}

		$scope.stop_match = function() {
			for(var i = 0, l = matchs.length; i < l; i++) {
				matchs[i].classList.remove('disabled');
				matchs[i].classList.remove('active');
			}
			document.getElementById('title').classList.remove('active');
			document.getElementById('btn-wrapper').classList.remove('active');
			live = false;
		}

		$scope.translateR = function() {
			if(state === $scope.league.aller.length - 1 || live) return;
			state++;
			translateX -= 499.5;
			wrapper.style.webkitTransform = 'translate3D(' + translateX + 'px,0,0)';
		}
		$scope.translateL = function() {
			if(state === 0 || live) return;
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
					'<span class="score" style="color: {{match[0].couleur}};">{{score_team_1}}</span>' +
					'<span class="name">{{match[0].name}}</span>' +
					'<span class="btn" ng-init="score_team_1 = 0" ng-click="score_team_1 = score_team_1 + 1" style="background-color: {{match[0].couleur}};">But</span>' +
				'</div>' +
				'<div class="center">' +
					'-' +
				'</div>' +
				'<div class="outdoor">' +
					'<span class="score" style="color: {{match[1].couleur}};">{{score_team_2}}</span>' +
					'<span class="name">{{match[1].name}}</span>' +
					'<span class="btn" ng-init="score_team_2 = 0" ng-click="score_team_2 = score_team_2 + 1" style="background-color: {{match[1].couleur}};">But</span>' +
				'</div>' +
			'</div>',
			link: function ($scope, $element) {
				console.log($scope.league);
			}
		}
	});

