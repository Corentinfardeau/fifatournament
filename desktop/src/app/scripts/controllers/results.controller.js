'use strict';

angular.module('fifatournament')
	.controller('ResultsCtrl', function ($scope, $rootScope, LocalStorage, API) {

        $scope.init = function() {

            var tournamentId = LocalStorage.getLocalStorage('tournament');
            
            async.waterfall([
                function(callback) {
                    API.getTournament(tournamentId)
                    .success(function(tournament){
                        callback(null, tournament);
                    })
                    .error(function(err){
                        console.error(err);
                    });
                },
                function(tournament,callback) {
                    API.getTournamentTeams(tournamentId)
                    .success(function(teams){
                        $scope.teams = teams;
                        $scope.calcStats();
                    });
                }
            ], function (err, league) {
                // console.log(league);
            });
        }
        
        // $scope.teams = LocalStorage.getLocalStorage('teams');
        // $scope.league = LocalStorage.getLocalStorage('league');
        
        // $scope.gameEnded = false;
    
        // $scope.detectEndGame = function(){
        //     var cpt = 0;
        //     for(var i =0; i < $scope.league.returnLeg.length; i++){
        //         if($scope.league.returnLeg[i].played === true){
        //             if(cpt === $scope.league.returnLeg.length-1){
        //                 $scope.gameEnded = true;
        //             }else{
        //                 cpt++;  
        //             }
        //         }else{
        //             return false;
        //         }
        //     }   
        // };
        
        $scope.calcStats = function(){            
            $scope.bestAttack = []; 
            $scope.bestDefence = []; 
            $scope.bestScorer = [];
            $scope.worstScorer = [];
            
            for(var i = 0; i < $scope.teams.length; i++){
                $scope.bestAttack.push($scope.teams[i]);
                $scope.bestDefence.push($scope.teams[i]);

                for(var j = 0; j < $scope.teams[i].players.length; j++) {
                    $scope.bestScorer.push($scope.teams[i].players[j]);
                }
            }

            for (var i = 0; i < $scope.bestAttack.length - 1; i++) {
                var j = i + 1;

                while ($scope.bestAttack[i].gf > $scope.bestAttack[j].gf) {
                    var temp = $scope.bestAttack[i];
                    $scope.bestAttack[i] = $scope.bestAttack[j];
                    $scope.bestAttack[j] = temp;
                    j++;
                }
            }

            console.log($scope.bestAttack);

            // for(var j = 0; j < $scope.bestAttack.length-1; j++){
            //     if($scope.bestAttack[j].stats.gf < $scope.bestAttack[j+1].stats.gf){
            //         var temporary = $scope.bestAttack[j+1];
            //         $scope.bestAttack[j+1] = $scope.bestAttack[j];
            //         $scope.bestAttack[j] = temporary;
            //     }


            //     if($scope.bestDefence[j].stats.ga < $scope.bestDefence[j+1].stats.ga){
            //         var temporary = $scope.bestDefence[j+1];
            //         $scope.bestDefence[j+1] = $scope.bestDefence[j];
            //         $scope.bestDefence[j] = temporary;
            //     }
            // }

            // $scope.bestDefence = $scope.bestDefence.reverse();

            // for(var k = 0; k < $scope.bestScorer.length - 1; k++) {
            //     if($scope.bestScorer[k].nbGoal < $scope.bestScorer[k + 1].nbGoal) {
            //         var temporary = $scope.bestScorer[k + 1];
            //         $scope.bestScorer[k + 1] = $scope.bestScorer[k];
            //         $scope.bestScorer[k] = temporary;
            //     }
            // }
            
            $scope.worstScorer = $scope.bestScorer[$scope.bestScorer.length - 1];
        };
        
        // $scope.orderedResults = function(){
            
        //     var tabOrdered = false;
        //     var size = $scope.teams.length;
            
        //     while(!tabOrdered){
                
        //         tabOrdered = true;
                
        //         for(var i = 0 ; i < size-1; i++){
        //             if($scope.teams[i].stats.pts<$scope.teams[i+1].stats.pts){
        //                 var temporary = $scope.teams[i+1];
        //                 $scope.teams[i+1] = $scope.teams[i];
        //                 $scope.teams[i] = temporary;
        //                 tabOrdered = false;
        //             }       
        //         }
                
        //         size--;
        //     }
            
        //     for(var j = 0 ; j < $scope.teams.length-1; j ++){
        //         if($scope.teams[j].stats.pts === $scope.teams[j+1].stats.pts){
        //             if($scope.teams[j].stats.gd<$scope.teams[j+1].stats.gd){
        //                 var temporary = $scope.teams[j+1];
        //                 $scope.teams[j+1] = $scope.teams[j];
        //                 $scope.teams[j] = temporary;
        //             }  
        //         }
        //     }
        // };
        
        // $scope.orderedResults();
        // $scope.detectEndGame();
        $scope.init();
    });

