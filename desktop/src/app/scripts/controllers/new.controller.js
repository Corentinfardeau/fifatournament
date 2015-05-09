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
            
            var tournament = {
                type : 'league',
                alea : document.getElementById('input_alea').checked,
                nbPlayersByTeam : $scope.countPlayerByTeam
            }
            
            var p = [];
            
            for(var i = 0; i < $scope.players.length; i++){
 
                var player = {
                    name : playersName[i]
                }    
                
                p.push(player);
            }
            
            API.createTournament(tournament)
            .success(function(tournament){
                console.log(tournament);
                console.log('tournament created');
                
                API.addPlayersToTournament(tournament._id, {players : p})
                .success(function(players){
                    console.log(players);
                    console.log('players added to the tournament');
                    API.addTeamToTournament(tournament._id, {players : players})
                    .success(function(teams){
                        console.log(teams);
                        console.log('team created and added to the tournament')
                        LocalStorage.setLocalStorage('tournament', tournament._id);
                    })
                    .error(function(err){
                        console.error(err);
                    });
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

