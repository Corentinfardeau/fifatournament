'use strict';

angular.module('fifatournament', ['ngRoute'])
	.config(function ($routeProvider) {		
		$routeProvider
			.when('/', {
				title: 'Accueil | FifaTournament',
				templateUrl: 'app/views/main.html',
                controller: 'MainCtrl'
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
            .when('/join', {
				title: 'Prochain(s) match(s) | FifaTournament',
				templateUrl: 'app/views/join.html',
				controller: 'JoinController'
			})
			.when('/latest_matchs', {
				title: 'Matchs passés | FifaTournament',
				templateUrl: 'app/views/latest_matchs.html',
				controller: 'LatestMatchsCtrl'
			})
			.when('/results', {
				title: 'Résultats | FifaTournament',
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
			.when('/credits', {
				title: 'Crédits | FifaTournament',
				templateUrl: 'app/views/credits.html',
				controller: 'CreditsCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});
	})
	.run(function($location, $rootScope) {
		console.log("_____________________________\n|             |             |\n|___          |          ___|\n|_  |         |         |  _|\n.| | |.       ,|.       .| | |.\n|| | | )     ( | )     ( | | ||\n'|_| |'       `|'       `| |_|'\n|___|         |         |___|\n|_____________|_____________|");
		
		$rootScope.$on('$routeChangeSuccess', function (event, current) {
			$rootScope.title = current.$$route.title;
		});
	})
;
