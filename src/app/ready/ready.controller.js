'use strict';

angular.module('fifatournament')
	.controller('ReadyCtrl', function ($scope) {
		
        var config = JSON.parse(localStorage.getItem('configTournois'));
        
        $scope.alea = function(config){
            
            var nb_teams_complete = (config.nb_players - (config.nb_players % config.nb_players_by_team))/config.nb_players_by_team;
            var nb_players_last_team = config.nb_players - (config.nb_players_by_team*nb_teams_complete);
            
            var teams = [];
            var players_name = config.players_name;
            
            for (var i = 0 ; i < nb_teams_complete ; i++){
                
                var players = $scope.name_alea(players_name, config.nb_players_by_team);
                
                var team = {
                    "nb_player" : config.nb_players_by_team,
                    "name" : "Equipe "+(i+1),
                    "couleur" : "#ebebeb",
                    "players_name" : [
                        "Corentin",
                        "Fardeau"
                    ]
                };
                
                teams.push(team);
            }
            
            if(nb_players_last_team != 0){
                
                 var team = {
                    "nb_players" : nb_players_last_team,
                    "name" : "Equipe "+(teams.length+1),
                    "couleur" : "#ebebeb",
                    "players_name" : [
                        "Corentin",
                        "Fardeau"
                    ]
                }; 
                
                teams.push(team);
            }
            
            console.log(teams);
        }
        
        $scope.name_alea = function (array_name, nb){
            var alea_array = [];
            
            return alea_array;
        }
        
        if(config.alea == true){
            $scope.alea(config);
        }
        
	});
