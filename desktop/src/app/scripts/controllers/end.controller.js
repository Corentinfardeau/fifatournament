'use strict';

angular.module('fifatournament')

	.controller('EndCtrl', function ($scope, LocalStorage, JSON, API) {
        
        $scope.init = function(){

          document.body.scrollTop = 0;

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
                                $scope.league = league;
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

                    $scope.getWinner();

                    $scope.getPlayers();
                })
                .error(function(err){
                    console.log(err);
                })
            });
        }

        $scope.getPlayers = function() {
            API.getTournamentPlayers($scope.tournamentId)
            .success(function(players){
                $scope.players = players;
                $scope.playersWinner = [];

                for(var i = 0; i < $scope.teams[0].players.length; i ++){
                    for(var j = 0; j < $scope.players.length; j++) {
                        if($scope.teams[0].players[i] === $scope.players[j]._id) {
                            $scope.playersWinner.push($scope.players[j].playerName);
                        }
                    }
                }
            });
        }

        $scope.getWinner = function() {
            $scope.winners = [];

            for(var i = 0; i < $scope.teams.length; i++) {
                if(i === 0) {
                    $scope.winners.push($scope.teams[i]);
                }
                else {
                    if($scope.teams[i - 1].pts === $scope.teams[i].pts) {
                        $scope.winners.push($scope.teams[i]);
                    }
                }
            }
            console.log($scope.winners);
        }

        $scope.init();
});