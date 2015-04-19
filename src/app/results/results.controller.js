'use strict';

angular.module('fifatournament')

	.controller('ResultsCtrl', function ($scope) {
		
		$scope.teams = JSON.parse(localStorage.getItem('teams'));

		$scope.sortResults = [];
		for(var i = 0; i < $scope.teams.length; i++) {
			
		}

	});

