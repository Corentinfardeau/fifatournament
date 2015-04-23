'use strict';

angular.module('fifatournament', ['ngRoute'])
	.config(function ($routeProvider) {		
		$routeProvider
			.when('/', {
				title: 'Accueil | FifaTournament',
				templateUrl: 'app/views/main.html',
			})
			.when('/new', {
				title: 'Configuration | FifaTournament',
				templateUrl: 'app/views/new.html',
				controller: 'NewCtrl'
			})
			.when('/ready', {
				title: 'Prêt ? | FifaTournament',
				templateUrl: 'app/views/ready.html',
				controller: 'ReadyCtrl'
			})
			.when('/matchs', {
				title: 'Prochain(s) match(s) | FifaTournament',
				templateUrl: 'app/views/matchs.html',
				controller: 'MatchsCtrl'
			})
			.when('/latest_matchs', {
				title: 'Matchs passés | FifaTournament',
				templateUrl: 'app/views/latest_matchs.html',
				controller: 'LatestMatchsCtrl'
			})
			.when('/results', {
				title: 'Résultas | FifaTournament',
				templateUrl: 'app/views/results.html',
				controller: 'ResultsCtrl'
			})
			.when('/end', {
				title: 'Victoire | FifaTournament',
				templateUrl: 'app/views/end.html',
				controller: 'EndCtrl'
			})
            .when('/changelog', {
				title: 'Changelog | FifaTournament',
				templateUrl: 'app/views/changelog.html',
				controller: 'ChangelogCtrl'
			})
			.otherwise({
                // title: '404| FifaTournament',
				templateUrl: 'app/views/404.html',
				controller: '404Ctrl'
			});
	})
	.run(function($location, $rootScope) {
		$rootScope.$on('$routeChangeSuccess', function (event, current) {
			$rootScope.title = current.$$route.title;
		});
	})
;
