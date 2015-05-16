'use strict';

angular.module('fifatournament')

	.controller('LatestMatchsCtrl', function ($scope, LocalStorage, API) {
		
        $scope.init = function(){
            
            var tournamentId = LocalStorage.getLocalStorage('tournament');
        
            API.getTournament(tournamentId)
            .success(function(tournament){

                API.getLeague(tournament.competition_id)
                .success(function(league){
                    
                    $scope.displayMatchs(league);
                    
                })
                .error(function(err){
                    console.error(err);
                });

            })
            .error(function(err){
                console.log(err);
            });
            
        }
        
        $scope.displayMatchs = function(league){
            
            $scope.league = league; 
            $scope.latestMatch = [];

            for(var i = 0; i < $scope.league.firstLeg.length; i++){
                if($scope.league.firstLeg[i].played === true){
                    $scope.latestMatch.push($scope.league.firstLeg[i]);       
                }   
            }

            for(var i = 0; i < $scope.league.returnLeg.length; i++){
                if($scope.league.firstLeg[i].played === true){
                    $scope.latestMatch.push($scope.league.returnLeg[i]);       
                }   
            }

            $scope.latestMatch = $scope.latestMatch.reverse();
        }
    
        $scope.init();
    
	});

