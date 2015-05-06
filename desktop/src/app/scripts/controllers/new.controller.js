'use strict';

angular.module('fifatournament')

	.controller('NewCtrl', function ($scope, LocalStorage, JSON, displayMessages) {

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
        
        // create the tournament config
		$scope.create = function(event){
            
            JSON.post('http://localhost:8080/api/game', {
                'nbPlayers' : $scope.countPlayer,
                'nbPlayersByTeam' : $scope.countPlayerByTeam,
                'alea' : document.getElementById('input_alea').checked,
                'playersName' : [],
                'type' : 'league',
                'starsMin': 0,
                'starsMax': 0
                
            })
            .success(function(data){
                
                console.log(data);
                if(data.alea){
                    for(var i=0; i < document.getElementsByClassName('player_name').length ; i++){
                        if(document.getElementsByClassName('player_name')[i].value === ''){
                            event.preventDefault();
                            displayMessages.success('Il manque des noms de joueur');
                            return false;
                        }else{ 
                            data.playersName.push(document.getElementsByClassName('player_name')[i].value);
                            data.starsMin = 4;
                            data.starsMax = 5;
                            LocalStorage.setLocalStorage('config', data);
                        }
                    }
                }else{
                    LocalStorage.setLocalStorage('config', data);
                }
                
            })
            .error(function(data){
                
                
            });
            
		};
	});

