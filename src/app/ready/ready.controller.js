'use strict';

angular.module('fifatournament')
	.controller('ReadyCtrl', function ($scope,colorsFactory) {
    
        $scope.getColors = function() {
             colorsFactory.getColors().then(function(success) {
                $scope.colors = success.data.couleur;
                $scope.alea($scope.shuffle($scope.colors));
            }, function(error) {
                console.log(error);
            });
        }
            
        //Create random team with all attributs
        $scope.alea = function(colors) {
            
            $scope.config = JSON.parse(localStorage.getItem('configTournois'));
            var nb_teams_complete = ($scope.config.nb_players - ($scope.config.nb_players % $scope.config.nb_players_by_team))/$scope.config.nb_players_by_team;
            var nb_players_last_team = $scope.config.nb_players - ($scope.config.nb_players_by_team*nb_teams_complete);
            var players_last_team = [];
                
            $scope.teams = [];
            
            var players_name_shuffle = $scope.shuffle($scope.config.players_name);
            
            //Create full team
            for (var i = 0 ; i < nb_teams_complete ; i++){
                
                var players_name = [];
                
                for(var k =0; k < $scope.config.nb_players_by_team; k++){
                    players_name.push(players_name_shuffle[players_name_shuffle.length-1]);    
                    players_name_shuffle.pop();
                }
                
                var team = {
                    "nb_player" : $scope.config.nb_players_by_team,
                    "name" : "Nom d'équipe "+(i+1),
                    "couleur" : colors[i],
                    "players_name" : players_name
                };
                
                $scope.teams.push(team);
            }
            
            
            
            // create last team
            if(nb_players_last_team != 0){
                
                for(var i =0 ; i < nb_players_last_team; i++){
                    players_last_team.push('');
                }

                if($scope.config.alea){
                    var team = {
                        "nb_players" : nb_players_last_team,
                        "name" : "Nom d'équipe "+($scope.teams.length+1),
                        "couleur" : colors[$scope.teams.length+1],
                        "players_name" : players_name_shuffle
                    };         
                }else{
                    var team = {
                        "nb_players" : nb_players_last_team,
                        "name" : "Nom d'équipe "+($scope.teams.length+1),
                        "couleur" : colors[$scope.teams.length+1],
                        "players_name" : players_last_team
                    };   
                }
                

                
                $scope.teams.push(team);
            }
            
            console.log($scope.teams);

        }
        
        
        //Save the teams in local storage
        $scope.save = function(){
            
            
            var inputs = document.getElementsByClassName('team_name_input');
            
            for( var i = 0; i < inputs.length; i++){
                $scope.teams[i].name = inputs[i].value;
            }
        
            localStorage.setItem('teams', JSON.stringify($scope.teams));
            
        }
        
        $scope.getColors();
        
        //Shuffle an array
        $scope.shuffle = function(array) {
            var currentIndex = array.length, temporaryValue, randomIndex ;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        }      
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
            '<div class="header" style="background-color: {{team.couleur}}"><input type="text" class="team_name_input" placeholder="{{team.name}}"/><i class="fa fa-fw fa-pencil" ng-click="clickEdit()"></i></div>' +
            '<div class="content"><input ng-disabled="config.alea" placeholder="Saisissez un nom" ng-repeat="player in team.players_name track by $index" value="{{player}}"></div>' +
            '</div>',
            
            link: function ($scope, $element) {
                console.log($scope.config.alea);
            }
        }
    });
