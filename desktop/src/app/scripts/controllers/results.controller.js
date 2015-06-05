'use strict';

angular.module('fifatournament')
	.controller('ResultsCtrl', function ($scope,$rootScope, LocalStorage, API) {
        
        $scope.init = function(){

            $scope.loading = true;

            $scope.tournamentId = LocalStorage.getLocalStorage('tournament');
            $scope.userStatut = LocalStorage.getLocalStorage('userStatut');

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
                                $scope.league = league;
                                callback(null, league);  
                            })
                            .error(function(err){
                                console.log(err);
                            })
                            break;
                    }
                },
                function(league,callback) {
                    API.getTournamentTeams($scope.tournamentId)
                    .success(function(teams){
                        // get teams
                        $scope.teams = teams;

                        //get players
                        $scope.getPlayers(function(){
                            //get bestAttack
                            $scope.getBestAttack();
                            //get bestDefense
                            $scope.getBestDefense();
                            //get bestFrigged
                            $scope.getFrigged();
                            //get bestPlayer
                            $scope.getBestPlayer();
                            //get worstPlayer
                            $scope.getWorstPlayer();

                            //get ranking ordered
                            API.getRanking(league._id, 'classic')
                            .success(function(ranking){
                                $scope.teams = ranking;

                                $scope.loading = false;
                            })
                            .error(function(err){
                                console.log(err);
                            })
                        });
                    });
                }
            ], function (err, league) {
                
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
            $scope.bestAttack = [];
            var bestAttack = $scope.teams;
            var tmpBestAttack = [];
            var size = bestAttack.length;
            var arraySorted = false;

            while(!arraySorted){
                arraySorted = true;
                for(var i = 0; i < size - 1; i++){
                    if(bestAttack[i].gf > bestAttack[i + 1].gf){
                        var tmp = bestAttack[i];
                        bestAttack[i] = bestAttack[i + 1];
                        bestAttack[i + 1] = tmp;
                        arraySorted = false;
                    }
                }
                size--;
            }

            var cpt = 0;
            for(var i = bestAttack.length - 1; i >= 0; i--) {
                tmpBestAttack[cpt] = bestAttack[i];
                cpt++;
            }

            for(var i = 0; i < tmpBestAttack.length; i++) {
                if(i === 0)
                    $scope.bestAttack.push(tmpBestAttack[i]);
                else if($scope.bestAttack[0].gf === tmpBestAttack[i].gf) {
                    $scope.bestAttack.push(tmpBestAttack[i]);
                }
            }

            if($scope.bestAttack.length === $scope.teams.length) {
                $scope.bestAttack = [];
                $scope.bestAttack.push({'teamName': 'Aucune équipe n\'a réussi à se démarquer','show': true});
            }
        }

        $scope.getBestDefense = function() {
            $scope.bestDefense = [];
            var bestDefense = $scope.teams;
            var size = bestDefense.length;
            var arraySorted = false;

            while(!arraySorted){
                arraySorted = true;
                for(var i = 0; i < size - 1; i++){
                    if(bestDefense[i].ga > bestDefense[i + 1].ga){
                        var tmp = bestDefense[i];
                        bestDefense[i] = bestDefense[i + 1];
                        bestDefense[i + 1] = tmp;
                        arraySorted = false;
                    }
                }
                size--;
            }

            for(var i = 0; i < bestDefense.length; i++) {
                if(i === 0)
                    $scope.bestDefense.push(bestDefense[i]);
                else if($scope.bestDefense[0].ga === bestDefense[i].ga) {
                    $scope.bestDefense.push(bestDefense[i]);
                }
            }

            if($scope.bestDefense.length === $scope.teams.length) {
                $scope.bestDefense = [];
                $scope.bestDefense.push({'teamName': 'Aucune équipe n\'a réussi à se démarquer','show': true});
            }
        }

        $scope.getFrigged = function() {
            $scope.bestFrigged = $scope.league.firstLeg[0];
            var gdLast = $scope.bestFrigged.goalHomeTeam - $scope.bestFrigged.goalAwayTeam;
            if(gdLast < 0)
                gdLast = gdLast * (-1);

            for(var i = 0; i < $scope.league.firstLeg.length; i++) {
                if($scope.league.firstLeg[i].played) {
                    var gd = $scope.league.firstLeg[i].goalHomeTeam - $scope.league.firstLeg[i].goalAwayTeam;
                    if(gd < 0)
                        gd = gd * (-1);

                    if(gd > gdLast)
                        $scope.bestFrigged[0] = $scope.league.firstLeg[i];
                }
            }

            for(var i = 0; i < $scope.league.returnLeg.length; i++) {
                if($scope.league.returnLeg[i].played) {
                    var gd = $scope.league.returnLeg[i].goalHomeTeam - $scope.league.returnLeg[i].goalAwayTeam;
                    if(gd < 0)
                        gd = gd * (-1);

                    if(gd > gdLast)
                        $scope.bestFrigged[0] = $scope.league.returnLeg[i];
                }
            }
        }

        $scope.getBestPlayer = function() {
            $scope.bestPlayer = [];
            var tmpBestPlayer = [];
            var bestPlayer = $scope.players;
            var size = bestPlayer.length;
            var arraySorted = false;

            while(!arraySorted){
                arraySorted = true;
                for(var i = 0; i < size - 1; i++){
                    if(bestPlayer[i].nbGoal > bestPlayer[i + 1].nbGoal){
                        var tmp = bestPlayer[i];
                        bestPlayer[i] = bestPlayer[i + 1];
                        bestPlayer[i + 1] = tmp;
                        arraySorted = false;
                    }
                }
                size--;
            }

            for(var i = bestPlayer.length - 1; i >= 0; i--) {
                tmpBestPlayer.push(bestPlayer[i]);
            }

            for(var i = 0; i < tmpBestPlayer.length; i++) {
                if(i === 0)
                    $scope.bestPlayer.push(tmpBestPlayer[i]);
                else if($scope.bestPlayer[0].nbGoal === tmpBestPlayer[i].nbGoal) {
                    $scope.bestPlayer.push(tmpBestPlayer[i]);
                }
            }

            if($scope.bestPlayer.length === $scope.players.length) {
                $scope.bestPlayer = [];
                $scope.bestPlayer.push({'playerName': 'Aucun joueur ne sort du lot','show': true});
            }
        }

        $scope.getWorstPlayer = function() {
            $scope.worstPlayer = [];
            var worstPlayer = $scope.players;
            var size = worstPlayer.length;
            var arraySorted = false;

            while(!arraySorted){
                arraySorted = true;
                for(var i = 0; i < size - 1; i++){
                    if(worstPlayer[i].nbGoal > worstPlayer[i + 1].nbGoal){
                        var tmp = worstPlayer[i];
                        worstPlayer[i] = worstPlayer[i + 1];
                        worstPlayer[i + 1] = tmp;
                        arraySorted = false;
                    }
                }
                size--;
            }

            for(var i = 0; i < worstPlayer.length; i++) {
                if(i === 0)
                    $scope.worstPlayer.push(worstPlayer[i]);
                else if($scope.worstPlayer[0].nbGoal === worstPlayer[i].nbGoal) {
                    $scope.worstPlayer.push(worstPlayer[i]);
                }
            }

            if($scope.worstPlayer.length === $scope.players.length) {
                $scope.worstPlayer = [];
                $scope.worstPlayer.push({'playerName': 'Aucun joueur ne sort du lot','show': true});
            }
        }
        
        $scope.init();
	
});

