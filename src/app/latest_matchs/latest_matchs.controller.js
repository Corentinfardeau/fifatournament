'use strict';

angular.module('fifatournament')

	.controller('LatestMatchsCtrl', function ($scope) {

	})
	.directive('latestmatch',function() {
		return  {
			restrict: 'E',
			template : '<div class="latest-match-card">' +
				'<div class="home">' +
					'<span class="score">0</span>' +
					'<span class="name">Équipe 1</span>' +
				'</div>' +
				'<div class="center">' +
					'-' +
					'<span>Aller</span>' +
				'</div>' +
				'<div class="outdoor">' +
					'<span class="score">0</span>' +
					'<span class="name">Équipe 2</span>' +
				'</div>' +
			'</div>',
			link: function ($scope, $element) {}
		}
	});

