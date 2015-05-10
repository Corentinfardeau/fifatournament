'use strict';

angular.module('fifatournament')

	.controller('NewCtrl', function ($scope, LocalStorage, JSON, displayMessages, API, $location) {

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
                    event.preventDefault();
                    $scope.create(playersName);
                }
                
            }else{
                
                $scope.create(playersName);
            }
		};
        
        //create game
        $scope.create = function(playersName){
            
            var tournament = {
                type : 'league',
                alea : document.getElementById('input_alea').checked,
                nbPlayersByTeam : $scope.countPlayerByTeam,
                nbPlayers : $scope.players.length
            }
            
            var p = [];
            
            for(var i = 0; i < $scope.players.length; i++){
 
                var player = {
                    playerName : playersName[i]
                }    
                
                p.push(player);
            }
            
            API.createTournament(tournament)
            .success(function(tournament){
                
                console.log('tournament created');
                
                API.addTeamToTournament(tournament._id, {players : p})
                .success(function(teams){
                    
                    console.log('team added');
                    LocalStorage.setLocalStorage('tournament', tournament._id);
                    
                    $location.path('/ready');
                    
                    if(tournament.alea){
                        API.addPlayersToTeams(tournament._id, {players : p})
                        .success(function(teams){
                            console.log('players added to team');
                        })
                        .error(function(err){
                            console.error(err);
                        })
                    }
                })
                .error(function(err){
                    console.error(err);
                });
            })
            .error(function(err){
                console.error(err);
            });
    
        };
});


