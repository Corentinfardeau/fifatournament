'use strict';

angular.module('fifatournament')

	.controller('ConfigCtrl', function ($scope, LocalStorage, displayMessages, API, $location, Shuffle) {

		var minPlayer = 2;
		$scope.players = [1,2]; 
        
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
			
			$scope.players = []; 
			
			for( var i = 0 ; i < $scope.countPlayer; i++){
				$scope.players.push(i+1);
			}
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
                nbPlayers : $scope.players.length
            }
            
            var players = [];
            
            for(var i = 0; i < $scope.players.length; i++){
                players.push("");
            }            
            
            API.createTournament(tournament, { nbPlayers : $scope.players.length}, {players : players})
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
