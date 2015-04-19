'use strict';

angular.module('fifatournament')

	.controller('LatestMatchsCtrl', function ($scope) {
		$scope.league = JSON.parse(localStorage.getItem('league'));
	})
	.directive('latestmatch',function() {
		return  {
			restrict: 'E',
			template : '<div ng-if="match.played" class="latest-match-card">' +
				'<div class="home">' +
					'<span class="score" style="color: {{match[0].couleur}};">{{match.b0}}</span>' +
					'<span class="name">{{match[0].name}}</span>' +
				'</div>' +
				'<div class="center">' +
					'-' +
					'<span>{{match.state}}</span>' +
				'</div>' +
				'<div class="outdoor">' +
					'<span class="score" style="color: {{match[1].couleur}};">{{match.b1}}</span>' +
					'<span class="name">{{match[1].name}}</span>' +
				'</div>' +
			'</div>',
			link: function ($scope, $element) {}
		}
	});

