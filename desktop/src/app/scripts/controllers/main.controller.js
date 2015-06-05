'use strict';

angular.module('fifatournament')

	.controller('MainCtrl', function ($scope, LocalStorage, API) {

        $scope.tournamentId = LocalStorage.getLocalStorage('tournament');

        $scope.init = function() {
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
                                console.error(err);
                            })
                        break;
                    }
                }
            ], function (err, league) {
                $scope.league = league;

                $scope.ifExist();
            });
        }

        $scope.ifExist = function() {
            if(!$scope.league.returnLeg[$scope.league.returnLeg.length - 1].played) {
                $scope.exist = true;
            } else {
                $scope.exist = false;
            }
        }

        $scope.init();

});