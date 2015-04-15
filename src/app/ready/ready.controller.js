'use strict';

angular.module('fifatournament')
	.controller('ReadyCtrl', function ($scope,colorsFactory) {

        $scope.getColors = function() {
             colorsFactory.getColors().then(function(success) {
                $scope.colors = success.data.couleur;
                $scope.alea($scope.colors);
            }, function(error) {
                console.log(error);
            });
        }
            
        //Create random team with all attributs
        $scope.alea = function(colors) {
            
            var config = JSON.parse(localStorage.getItem('configTournois'));
            var nb_teams_complete = (config.nb_players - (config.nb_players % config.nb_players_by_team))/config.nb_players_by_team;
            var nb_players_last_team = config.nb_players - (config.nb_players_by_team*nb_teams_complete);
            
            $scope.teams = [];
            var players_name = config.players_name;
            
            //Create full team
            for (var i = 0 ; i < nb_teams_complete ; i++){
                
                var players = $scope.name_alea(players_name, config.nb_players_by_team);
                
                for(var j = 0; j < players.length; j++){
                    players_name.splice(players_name.indexOf(players[j]),1);   
                }
                
                var team = {
                    "nb_player" : config.nb_players_by_team,
                    "name" : "Nom d'équipe "+(i+1),
                    "couleur" : colors[i],
                    "players_name" : players
                };
                
                $scope.teams.push(team);
            }
            
            // create last team
            if(nb_players_last_team != 0){
                
                 var team = {
                    "nb_players" : nb_players_last_team,
                    "name" : "Equipe "+($scope.teams.length+1),
                    "couleur" : "#ebebeb",
                    "players_name" : players_name
                }; 
                
                $scope.teams.push(team);
            }
            
            console.log($scope.teams);
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
        
        $scope.save = function(){
            
            localStorage.setItem('teams', JSON.stringify($scope.teams));
            
        }

        $scope.clickEdit = function() {

        }
        
        $scope.getColors();
	})
    .factory('colorsFactory',function($http, $q) {
        var factory = {
            colors: false,
            getColors: function() {
                return $http.get('../assets/JSON/couleurs.json');
            }
        };

        return factory;
    })
    .directive('card',function() {
        return  {
            restrict: 'E',
            template : '<div class="card-edit">' + 
            '<div class="header" style="background-color: {{team.couleur}}"><input type="text" placeholder="{{team.name}}"/><i class="fa fa-fw fa-pencil" ng-click="clickEdit()"></i></div>' +
            '<div class="content"><ul><li ng-repeat="player in team.players_name">{{player}}</li></ul></div>' +
            '</div>'
        }
    });
