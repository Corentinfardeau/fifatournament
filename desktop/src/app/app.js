'use strict';

angular.module('fifatournament', ['ngRoute'])
	.config(function ($routeProvider) {		
		$routeProvider
			.when('/', {
				title: 'Accueil | Soccup',
				templateUrl: 'app/views/main.html',
                controller: 'MainCtrl'
			})
			.when('/config', {
				title: 'Configuration | Soccup',
				templateUrl: 'app/views/config.html',
				controller: 'ConfigCtrl'
			})
			.when('/random', {
				title: 'Joueurs | Soccup',
				templateUrl: 'app/views/random.html',
				controller: 'RandomCtrl'
			})
			.when('/ready', {
				title: 'Prêt ? | Soccup',
				templateUrl: 'app/views/ready.html',
				controller: 'ReadyCtrl'
			})
			.when('/matchs', {
				title: 'Prochain(s) match(s) | Soccup',
				templateUrl: 'app/views/matchs.html',
				controller: 'MatchsCtrl'
			})
      .when('/join', {
				title: 'Rejoindre un tournoi | Soccup',
				templateUrl: 'app/views/join.html',
				controller: 'JoinController'
			})
			.when('/latest_matchs', {
				title: 'Liste des matchs | Soccup',
				templateUrl: 'app/views/latest_matchs.html',
				controller: 'LatestMatchsCtrl'
			})
			.when('/results', {
				title: 'Résultats | Soccup',
				templateUrl: 'app/views/results.html',
				controller: 'ResultsCtrl'
			})
			.when('/end', {
				title: 'Victoire | Soccup',
				templateUrl: 'app/views/end.html',
				controller: 'EndCtrl'
			})
			.when('/changelog', {
				title: 'Changelog | Soccup',
				templateUrl: 'app/views/changelog.html',
				controller: 'ChangelogCtrl'
			})
			.when('/credits', {
				title: 'Crédits | Soccup',
				templateUrl: 'app/views/credits.html',
				controller: 'CreditsCtrl'
			})
			.when('/about', {
				title: 'À propos | Soccup',
				templateUrl: 'app/views/about.html',
				controller: 'AboutCtrl'
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
