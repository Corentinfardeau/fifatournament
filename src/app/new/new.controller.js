'use strict';

angular.module('fifatournament')

	.controller('NewCtrl', function ($scope,$rootScope) {

        $scope.whoarewe = false;
        $scope.whoAreWe = function(what) {
            if(what == 'show') {
                $scope.whoarewe = true;
            } else if(what == 'hide') {
                $scope.whoarewe = false;
            }
        }
				
		var maxPlayer = 7;
		var minPlayer = 2;
		$scope.players = [1,2]; 

		$scope.incrementPlayer = function() {
			
			if ($scope.countPlayer >= maxPlayer) { return; }
			
			$scope.countPlayer++;
			
			$scope.players = []; 
			for( var i = 0 ; i < $scope.countPlayer; i++){
				$scope.players.push(i+1);
			}
		};
    
		$scope.decrementPlayer = function() {
			if ($scope.countPlayer <= minPlayer) { return; }
            if ($scope.countPlayerByTeam >= $scope.countPlayer - 1) {$scope.countPlayerByTeam = $scope.countPlayer - 2}
			$scope.countPlayer--;
			
			$scope.players = []; 
			
			for( var i = 0 ; i < $scope.countPlayer; i++){
				$scope.players.push(i+1);
			}
		};
    
		$scope.incrementPlayerByTeam = function() {
			if ($scope.countPlayerByTeam >= $scope.countPlayer-1) { return; }
			$scope.countPlayerByTeam++;
		};
    
		$scope.decrementPlayerByTeam = function() {
			if ($scope.countPlayerByTeam <= minPlayer - 1) { return; }
			$scope.countPlayerByTeam--;
		};
    
		$scope.create = function(event){
             
            
			var config = {"nb_players" : $scope.countPlayer, 
                          "nb_players_by_team" : $scope.countPlayerByTeam, 
                          "alea" : document.getElementById('input_alea').checked,
                          "players_name" : [],
                          "type" : "league"
                         };
            
            if(config.alea){
                for(var i=0; i < document.getElementsByClassName('player_name').length ; i++){
                    if(document.getElementsByClassName('player_name')[i].value == ''){
                        event.preventDefault();
                        alert("Il manque des noms de joueur");  
                        return false;
                    }else{ 
                        config.players_name.push(document.getElementsByClassName('player_name')[i].value);
                        localStorage.setItem('configTournois', JSON.stringify(config));
                    }
                }
            }else{
                localStorage.setItem('configTournois', JSON.stringify(config));
            }
            
            
		};

	});

