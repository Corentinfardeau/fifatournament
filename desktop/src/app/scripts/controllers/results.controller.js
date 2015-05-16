'use strict';

angular.module('fifatournament')
	.controller('ResultsCtrl', function ($scope,$rootScope, LocalStorage, API) {
        
        $scope.init = function(){

            var tournamentId = LocalStorage.getLocalStorage('tournament');

            async.waterfall([
                function(callback) {

                    API.getTournament(tournamentId)
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
                })
                .error(function(err){
                    console.log(err);
                })
            });
        }
        
        $scope.init();
	
});

