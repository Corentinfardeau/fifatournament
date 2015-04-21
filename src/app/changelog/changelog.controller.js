'use strict';

angular.module('fifatournament')
	.controller('ChangelogCtrl', function ($scope) {

		$scope.whoarewe = false;
		$scope.whoAreWe = function(what) {
			if(what == 'show') {
				$scope.whoarewe = true;
			} else if(what == 'hide') {
				$scope.whoarewe = false;
			}
		}

		$scope.versions = [
			{
				'id': 1,
				'version': 'V2.0',
				'date': '21 Avril 2015',
				'comments': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet iure consequatur totam aspernatur magnam accusantium eius ipsa velit minima, harum minus blanditiis distinctio, porro molestias nobis dolores debitis, labore recusandae.'
			},
			{
				'id': 0,
				'version': 'V1.0',
				'date': '21 Avril 2015',
				'comments': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet iure consequatur totam aspernatur magnam accusantium eius ipsa velit minima, harum minus blanditiis distinctio, porro molestias nobis dolores debitis, labore recusandae.'
			}
		];

	})
	.directive('version',function() {
		return  {
			restrict: 'E',
			template : '<div class="version">' +
			'<h1>{{version.version}}</h1>' +
			'<h2>{{version.date}}</h2>' +
			'<p>{{version.comments}}</p>' +
			'</div>',
			link: function ($scope, $element) {}
		}
	});