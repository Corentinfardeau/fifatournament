'use strict';

angular.module('fifatournament')

	.controller('ConfigCtrl', function ($scope, LocalStorage, displayMessages, API, $location, Shuffle) {

		var minPlayer = 2;
		$scope.players = [1,2];
        $scope.countPlayer = 2;
        $scope.countPlayerByTeam = 1;

        if(LocalStorage.getLocalStorage('tournament')) {
            var tournamentId = LocalStorage.getLocalStorage('tournament');
        
            API.getTournament(tournamentId)
            .success(function(tournament){
                $scope.config = tournament;
                $scope.countPlayer = $scope.config.nbPlayers;
                $scope.countPlayerByTeam = $scope.config.nbPlayersByTeam;
            });
        }
        
        //increment the numbers of players
		$scope.incrementPlayer = function() {
			
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
			if ($scope.countPlayerByTeam >= $scope.countPlayer-1) { return; }
			$scope.countPlayerByTeam++;
		};
        
        //decrement the numbers of players by team
		$scope.decrementPlayerByTeam = function() {
			if ($scope.countPlayerByTeam <= minPlayer - 1) { return; }
			$scope.countPlayerByTeam--;
		};
        
        //create game
        $scope.create = function(event){
            
            event.preventDefault();
            
            //parameter to send to API
            var tournament = {
                type : 'league',
                random : document.getElementById('inputRandom').checked,
                nbPlayersByTeam : $scope.countPlayerByTeam,
                nbPlayers : $scope.countPlayer
            }
            
            var players = [];
            
            for(var i = 0; i < $scope.countPlayer; i++){
                players.push("");
            }            
            
            API.createTournament(tournament, { nbPlayers : $scope.countPlayer}, {players : players})
            .then(function(tournament) {
                
                console.log(tournament);
                LocalStorage.setLocalStorage('tournament', tournament._id);
                
                if(tournament.random){
                    $location.path('/random');
                }else{
                    $location.path('/ready');
                }
                
            }, function(reason) {
                console.log(reason);
            });
            
        };
    });
