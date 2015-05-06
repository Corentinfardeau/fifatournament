'use strict';

angular.module('fifatournament')

	.controller('NewCtrl', function ($scope, LocalStorage, JSON, displayMessages, API) {

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
        
        // verify information from the form
		$scope.verifForm = function(event){
            
            var playersName = [];
            
            if(document.getElementById('input_alea').checked){
                
                var cpt = 0;
                
                for(var i=0; i < document.getElementsByClassName('player_name').length ; i++){
                    
                    if(document.getElementsByClassName('player_name')[i].value === ''){
                        event.preventDefault();
                        displayMessages.success('Il manque des noms de joueur');
                        return false;
                    }else{ 
                        cpt++;
                        playersName.push(document.getElementsByClassName('player_name')[i].value);
                    }
                }
                
                if(cpt === document.getElementsByClassName('player_name').length){
                    $scope.create(playersName);
                }
                
            }else{
                $scope.create(playersName);
            }
		};
        
        //create game
        $scope.create = function(playersName){
            
            API.createGame({
                'nbPlayers' : $scope.countPlayer,
                'nbPlayersByTeam' : $scope.countPlayerByTeam,
                'alea' : document.getElementById('input_alea').checked,
                'playersName' : playersName,
                'type' : 'league',
                'starsMin': 4,
                'starsMax': 5
            })
            .success(function(data){
                console.log('tournois crée');
                console.log(data);
                LocalStorage.setLocalStorage('config', data);
            })
            .error(function(data){
                console.log('erreur tournois non crée');
            });
        };  
    
});

