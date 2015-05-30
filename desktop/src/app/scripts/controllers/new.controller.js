'use strict';

angular.module('fifatournament')

	.controller('NewCtrl', function ($scope, LocalStorage, displayMessages, API, $location, Shuffle) {

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
            
            event.preventDefault();
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
            
            playersName = Shuffle.shuffleArray(playersName)
            
            //parameter to send to API
            var tournament = {
                type : 'league',
                alea : document.getElementById('input_alea').checked,
                nbPlayersByTeam : $scope.countPlayerByTeam,
                nbPlayers : $scope.players.length,
                public : document.getElementById('input_public').checked
            }
            
            var playersArray = [];
            
            for(var i = 0; i < $scope.players.length; i++){
 
                var player = {
                    playerName : playersName[i]
                }    
                
                playersArray.push(player);
            }
            
            //Step for create a tournament
            
            async.waterfall([
                
                //Create a tournament
                function(callback) {
                    API.createTournament(tournament)
                    .success(function(tournament){
                        console.info('tournament created');
                        callback(null, tournament);    
                    })
                    .error(function(err){
                        console.error(err);
                    });
                },
                
                // Teams created and added to the tournament
                function(tournament, callback) {
                    API.addTeamToTournament(tournament._id, {nbPlayers : playersArray.length})
                    .success(function(teams){
                        console.info('teams created and added to the tournament');
                        callback(null, tournament);
                    })
                    .error(function(err){
                        console.error(err);
                    })
                },
                
                // Redirect and added players to the teams
                function(tournament, callback) {
                    API.addPlayersToTeams(tournament._id, {players : playersArray})
                    .success(function(teams){
                        callback(null, tournament);
                        console.info('players added to team');
                        
                    })
                    .error(function(err){
                        console.error(err);
                    });
                }
            ], function (err, tournament) {
                LocalStorage.setLocalStorage('tournament', tournament._id);
                LocalStorage.setLocalStorage('state', 0);
                $location.path('/ready');
                API.getTournament(tournament._id)
                .success(function(tournament){
                    console.log(tournament);
                })
                .error(function(err){
                    console.error(err);
                })
            }); 
        };
    });
