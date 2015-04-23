'use strict';

angular.module('fifatournament', ['ngRoute'])
	.config(function ($routeProvider) {		
		$routeProvider
			.when('/', {
				title: 'Accueil | FifaTournament',
				templateUrl: 'app/main/main.html',
				controller: 'MainCtrl'
			})
			.when('/new', {
				title: 'Configuration | FifaTournament',
				templateUrl: 'app/new/new.html',
				controller: 'NewCtrl'
			})
			.when('/ready', {
				title: 'Prêt ? | FifaTournament',
				templateUrl: 'app/ready/ready.html',
				controller: 'ReadyCtrl'
			})
			.when('/matchs', {
				title: 'Prochain(s) match(s) | FifaTournament',
				templateUrl: 'app/matchs/matchs.html',
				controller: 'MatchsCtrl'
			})
			.when('/latest_matchs', {
				title: 'Matchs passés | FifaTournament',
				templateUrl: 'app/latest_matchs/latest_matchs.html',
				controller: 'LatestMatchsCtrl'
			})
			.when('/results', {
				title: 'Résultas | FifaTournament',
				templateUrl: 'app/results/results.html',
				controller: 'ResultsCtrl'
			})
			.when('/end', {
				title: 'Victoire | FifaTournament',
				templateUrl: 'app/end/end.html',
				controller: 'EndCtrl'
			})
            .when('/changelog', {
				title: 'Changelog | FifaTournament',
				templateUrl: 'app/changelog/changelog.html',
				controller: 'ChangelogCtrl'
			})
			.otherwise({
				templateUrl: 'app/404/404.html',
				controller: '404Ctrl'
			});
	})
	.run(function($location, $rootScope) {
		$rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
			$rootScope.title = current.$$route.title;
		});
	})
;
