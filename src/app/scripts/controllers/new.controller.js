'use strict';

angular.module('fifatournament')

	.controller('NewCtrl', function ($scope, LocalStorage) {

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
            
			if ($scope.countPlayer <= minPlayer) { return };
            if ($scope.countPlayerByTeam >= $scope.countPlayer - 1) {$scope.countPlayerByTeam = $scope.countPlayer - 2};
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
        
        // create the tournament config
		$scope.create = function(event){
            
			var config = {'nbPlayers' : $scope.countPlayer, 
                          'nbPlayersByTeam' : $scope.countPlayerByTeam, 
                          'alea' : document.getElementById('input_alea').checked,
                          'playersName' : [],
                          'type' : 'league'
                         };
            
            if(config.alea){
                for(var i=0; i < document.getElementsByClassName('player_name').length ; i++){
                    if(document.getElementsByClassName('player_name')[i].value === ''){
                        event.preventDefault();
                        alert('Il manque des noms de joueur');  
                        return false;
                    }else{ 
                        config.playersName.push(document.getElementsByClassName('player_name')[i].value);
                        LocalStorage.setLocalStorage('config', config);
                    }
                }
            }else{
                LocalStorage.setLocalStorage('config', config);
            }
            
		};

	});

