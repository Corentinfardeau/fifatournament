'use strict';

angular.module('fifatournament')
	.controller('ChangelogCtrl', function ($scope) {

		$scope.versions = [
			{
				'id': 0,
				'version': 'V1.0',
				'date': '21 Avril 2015',
				'comments': 'Elle est prête, elle est toute chaude, elle sort du four. Voici la V1 de votre application. Au menu, du gros du gras du dodu. Créez aléatoirement vos équipes, et ayez toujours un oeil sur les résultats.'
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
			link: function () {}
		};
	});