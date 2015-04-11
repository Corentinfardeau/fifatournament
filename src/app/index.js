'use strict';

angular.module('fifatournament', ['ngRoute'])
	.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'app/main/main.html',
				controller: 'MainCtrl'
			})
			.when('/new', {
				templateUrl: 'app/new/new.html',
				controller: 'NewCtrl'
			})
			.otherwise({
				templateUrl: 'app/404/404.html',
				controller: '404Ctrl'
			});
	})
;
