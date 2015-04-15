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
				title: 'Macths | FifaTournament',
				templateUrl: 'app/matchs/matchs.html',
				controller: 'MatchsCtrl'
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
