'use strict';

angular.module('fifatournament')
	.controller('ResultsCtrl', function ($scope,$rootScope, LocalStorage, API) {
        
        $scope.init = function(){

            $scope.tournamentId = LocalStorage.getLocalStorage('tournament');

            async.waterfall([
                function(callback) {

                    API.getTournament($scope.tournamentId)
                    .success(function(tournament){
                        $scope.config = tournament;
                        callback(null, tournament);
                    })
                    .error(function(err){
                        console.error(err);
                    });

                },
                function(tournament, callback) {

                    switch(tournament.type) {
                        case 'league':
                            API.getLeague(tournament.competition_id)
                            .success(function(league){
                                callback(null, league);  
                            })
                            .error(function(err){
                                console.log(err);
                            })
                            break;
                    }
                }
            ], function (err, league) {
                API.getRanking(league._id, 'classic')
                .success(function(ranking){
                    $scope.teams = ranking;

                    $scope.getPlayers(function(){
                        $scope.getBestAttack();
                        $scope.getBestDefense();
                        $scope.getBestPlayer();
                        $scope.getWorstPlayer();
                    });
                })
                .error(function(err){
                    console.log(err);
                })
            });
        }

        $scope.getPlayers = function(callback) {
            API.getTournamentPlayers($scope.tournamentId)
            .success(function(players){
                $scope.players = players;
                callback.call(this);
            });
        }

        $scope.getBestAttack = function() {
            $scope.bestAttack = $scope.teams;
            var size = $scope.bestAttack.length;
            var arraySorted = false;

            while(!arraySorted){
                arraySorted = true;
                for(var i = 0; i < size - 1; i++){
                    if($scope.bestAttack[i].gf > $scope.bestAttack[i + 1].gf){
                        var tmp = $scope.bestAttack[i];
                        $scope.bestAttack[i] = $scope.bestAttack[i + 1];
                        $scope.bestAttack[i + 1] = tmp;
                        arraySorted = false;
                    }
                }
                size--;
            }
            $scope.bestAttack.reverse();
        }

        $scope.getBestDefense = function() {
            $scope.bestDefense = $scope.teams;
            var size = $scope.bestDefense.length;
            var arraySorted = false;

            while(!arraySorted){
                arraySorted = true;
                for(var i = 0; i < size - 1; i++){
                    if($scope.bestDefense[i].ga > $scope.bestDefense[i + 1].ga){
                        var tmp = $scope.bestDefense[i];
                        $scope.bestDefense[i] = $scope.bestDefense[i + 1];
                        $scope.bestDefense[i + 1] = tmp;
                        arraySorted = false;
                    }
                }
                size--;
            }
        }

        $scope.getBestPlayer = function() {
            $scope.bestPlayer = [];
            $scope.tmpBestPlayer = $scope.players;
            var size = $scope.tmpBestPlayer.length;
            var arraySorted = false;

            while(!arraySorted){
                arraySorted = true;
                for(var i = 0; i < size - 1; i++){
                    if($scope.tmpBestPlayer[i].nbGoal > $scope.tmpBestPlayer[i + 1].nbGoal){
                        var tmp = $scope.tmpBestPlayer[i];
                        $scope.tmpBestPlayer[i] = $scope.tmpBestPlayer[i + 1];
                        $scope.tmpBestPlayer[i + 1] = tmp;
                        arraySorted = false;
                    }
                }
                size--;
            }
            
            for(var i = $scope.tmpBestPlayer.length - 1; i >= 0; i--) {
                $scope.bestPlayer.push($scope.tmpBestPlayer[i]);
            }
        }

        $scope.getWorstPlayer = function() {
            $scope.worstPlayer = $scope.players;
            var size = $scope.worstPlayer.length;
            var arraySorted = false;

            while(!arraySorted){
                arraySorted = true;
                for(var i = 0; i < size - 1; i++){
                    if($scope.worstPlayer[i].nbGoal > $scope.worstPlayer[i + 1].nbGoal){
                        var tmp = $scope.worstPlayer[i];
                        $scope.worstPlayer[i] = $scope.worstPlayer[i + 1];
                        $scope.worstPlayer[i + 1] = tmp;
                        arraySorted = false;
                    }
                }
                size--;
            }
        }
        
        $scope.init();
	
});

