'use strict';

angular.module('fifatournament')

	.controller('LatestMatchsCtrl', function ($scope, LocalStorage, API) {
		
        $scope.init = function(){
            
            var tournamentId = LocalStorage.getLocalStorage('tournament');

            API.getTournament(tournamentId)
            .success(function(tournament){

                API.getLeague(tournament.competition_id)
                .success(function(league){
                    $scope.league = league;
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

