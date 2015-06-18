'use strict';

angular.module('fifatournament')

	.controller('ConfigCtrl', function ($scope, LocalStorage, displayMessages, API, $location, Shuffle) {

		var minPlayer = 2;
        $scope.maxPlayerByTeam = 5;
		$scope.players = [1,2];
        $scope.countPlayer = 2;
        $scope.countPlayerByTeam = 1;

        if(LocalStorage.getLocalStorage('tournament')) {

            $scope.loading = true;

            var tournamentId = LocalStorage.getLocalStorage('tournament');
        
            API.getTournament(tournamentId)
            .success(function(tournament){
                $scope.config = tournament;
                $scope.countPlayer = $scope.config.nbPlayers;
                $scope.countPlayerByTeam = $scope.config.nbPlayersByTeam;

                $scope.loading = false;
            });
        }
        
        //increment the numbers of players
		$scope.incrementPlayer = function(){
			
			$scope.countPlayer++;
			
			$scope.players = []; 
			for( var i = 0 ; i < $scope.countPlayer; i++){
				$scope.players.push(i+1);
			}
		};
        
        //decrement the numbers of players
		$scope.decrementPlayer = function() {
            
			if ($scope.countPlayer <= minPlayer) { return; }
            if ($scope.countPlayerByTeam >= $scope.countPlayer - 1) {$scope.countPlayerByTeam = $scope.countPlayer - 2;}
			$scope.countPlayer--;
		};
        
        //increment the numbers of players by team
		$scope.incrementPlayerByTeam = function() {
			if($scope.countPlayerByTeam >= $scope.countPlayer-1) { return; }
            if($scope.countPlayerByTeam < $scope.maxPlayerByTeam) { 
                $scope.countPlayerByTeam++;
            } else {
                return;
            }
		};
        
        //decrement the numbers of players by team
		$scope.decrementPlayerByTeam = function() {
			if ($scope.countPlayerByTeam <= minPlayer - 1) { return; }
			$scope.countPlayerByTeam--;
		};
        
        //create game
        $scope.create = function(event){
            event.preventDefault();

            $scope.deleteTournament(function(){            
                //parameter to send to API
                var tournament = {
                    type : 'league',
                    random : document.getElementById('inputRandom').checked,
                    nbPlayersByTeam : $scope.countPlayerByTeam,
                    nbPlayers : $scope.countPlayer,
                    public : document.getElementById('inputPublic').checked
                }
                
                var players = [];
                
                for(var i = 0; i < $scope.countPlayer; i++){
                    players.push("");
                }            
                
                API.createTournament(tournament, { nbPlayers : $scope.countPlayer}, {players : players})
                .then(function(tournament) {
                    
                    LocalStorage.setLocalStorage('tournament', tournament._id);
                    LocalStorage.setLocalStorage('userStatut', 'fürher');
                    LocalStorage.setLocalStorage('state', 0);
                    
                    if(tournament.random){
                        $location.path('/random');
                    }else{
                        $location.path('/ready');
                    }
                    
                }, function(reason) {
                    // console.log(reason);
                });
            });
                        
        };

        $scope.deleteTournament = function(callback) {
            if(LocalStorage.getLocalStorage('tournament')) {

                $scope.loading = true;

                var tournamentId = LocalStorage.getLocalStorage('tournament');
            
                API.getTournament(tournamentId)
                .success(function(tournament){
                    API.deleteTournament(tournamentId)
                    .success(function(res){
                        LocalStorage.setLocalStorage('tournament','');
                        LocalStorage.remove('currentHomeTeam');
                        LocalStorage.remove('currentAwayTeam');
                        callback(null);
                    })
                    .error(function(err){
                        console.error(err);
                    })
                })
                .error(function(err){
                    console.error(err);
                })
            } else {
                callback(null);
            }
        }
    });
