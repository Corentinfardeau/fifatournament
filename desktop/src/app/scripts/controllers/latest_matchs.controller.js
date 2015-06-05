'use strict';

angular.module('fifatournament')

	.controller('LatestMatchsCtrl', function ($scope, LocalStorage, API) {
		
        $scope.init = function(){

            $scope.loading = true;
            
            $scope.tournamentId = LocalStorage.getLocalStorage('tournament');
            $scope.userStatut = LocalStorage.getLocalStorage('userStatut');

            API.getTournament($scope.tournamentId)
            .success(function(tournament){

                $scope.config = tournament;

                API.getLeague(tournament.competition_id)
                .success(function(league){
                    $scope.league = league;

                    $scope.loading = false;
                })
                .error(function(err){
                    console.error(err);
                });
            })
            .error(function(err){
                console.log(err);
            });
        }
    
        $scope.init();
	});

