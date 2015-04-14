'use strict';

angular.module('fifatournament')
	.controller('ReadyCtrl', function ($scope) {
		
        var config = JSON.parse(localStorage.getItem('configTournois'));
        
        //Create random team with all attributs
        $scope.alea = function(config){
            
            var nb_teams_complete = (config.nb_players - (config.nb_players % config.nb_players_by_team))/config.nb_players_by_team;
            var nb_players_last_team = config.nb_players - (config.nb_players_by_team*nb_teams_complete);
            
            var teams = [];
            var players_name = config.players_name;
            
            //Create full team
            for (var i = 0 ; i < nb_teams_complete ; i++){
                
                var players = $scope.name_alea(players_name, config.nb_players_by_team);
                
                for(var j = 0; j < players.length; j++){
                    players_name.splice(players_name.indexOf(players[j]),1);   
                }
                
                var team = {
                    "nb_player" : config.nb_players_by_team,
                    "name" : "Equipe "+(i+1),
                    "couleur" : "#ebebeb",
                    "players_name" : players
                };
                
                teams.push(team);
            }
            
            // create last team
            if(nb_players_last_team != 0){
                
                 var team = {
                    "nb_players" : nb_players_last_team,
                    "name" : "Equipe "+(teams.length+1),
                    "couleur" : "#ebebeb",
                    "players_name" : players_name
                }; 
                
                teams.push(team);
            }
            
            console.log(teams);
        }
        
        // Generate array with random player name
        $scope.name_alea = function (array_name, nb){
            
            var alea_array = [];
            
            for (var i = 0 ; i < nb ; i++){
                
                var alea = Math.floor(Math.random() * (array_name.length - 0) + 0);
                
                while (alea_array.indexOf(array_name[alea]) > -1) {
                    alea = Math.floor(Math.random() * (array_name.length - 0) + 0);
                }

                  alea_array.push(array_name[alea]);                  
            }
            
            return alea_array;
        }
        
        
        if(config.alea == true){
            $scope.alea(config);
        }
        
	});
