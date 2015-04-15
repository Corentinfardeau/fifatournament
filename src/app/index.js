'use strict';

angular.module('fifatournament', ['ngRoute'])
	.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				title: 'Home | FifaTournament',
				templateUrl: 'app/main/main.html',
				controller: 'MainCtrl'
			})
			.when('/new', {
				title: 'New | FifaTournament',
				templateUrl: 'app/new/new.html',
				controller: 'NewCtrl'
			})
			.when('/ready', {
				title: 'Ready | FifaTournament',
				templateUrl: 'app/ready/ready.html',
				controller: 'ReadyCtrl'
			})
			.when('/matchs', {
				title: 'Matchs | FifaTournament',
				templateUrl: 'app/matchs/matchs.html',
				controller: 'MatchsCtrl'
			})
			.when('/latest_matchs', {
				title: 'Latest matchs | FifaTournament',
				templateUrl: 'app/latest_matchs/latest_matchs.html',
				controller: 'LatestMatchsCtrl'
			})
			.when('/results', {
				title: 'Results | FifaTournament',
				templateUrl: 'app/results/results.html',
				controller: 'ResultsCtrl'
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
