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
                    
                    var player = {
                        name : players_name_shuffle[players_name_shuffle.length-1],
                        nb_goal : 0
                    }
                    
                    players_name.push(player);
                    players_name_shuffle.pop();
                }
                
                var team = {
                    "nb_player" : $scope.config.nb_players_by_team,
                    "name" : "Nom d'équipe "+(i+1),
                    "couleur" : colors[i],
                    "players_name" : players_name,
                    "stats" : {
                        "played" : 0,
                        "victory" : 0,
                        "draw" : 0,
                        "defeat" : 0,
                        "bp" : 0,
                        "bc" : 0,
                        "db" : 0,
                        "pts" : 0
                    }
                };
                
                $scope.teams.push(team);
            }
            
            
            
            // create last team
            if(nb_players_last_team != 0){
                
                var players_name = [];
                
                for(var i =0 ; i < nb_players_last_team; i++){
                    
                    players_last_team.push('');
                    
                    var player = {
                        name : players_name_shuffle[i],
                        nb_goal : 0
                    }
                    
                    players_name.push(player);
                }

                if($scope.config.alea){
                    var team = {
                        "nb_players" : nb_players_last_team,
                        "name" : "Nom d'équipe "+($scope.teams.length+1),
                        "couleur" : colors[$scope.teams.length+1],
                        "players_name" : players_name,
                        "stats" : {
                            "played" : 0,
                            "victory" : 0,
                            "draw" : 0,
                            "defeat" : 0,
                            "bp" : 0,
                            "bc" : 0,
                            "db" : 0,
                            "pts" : 0
                        }
                    };         
                }else{
                    var team = {
                        "nb_players" : nb_players_last_team,
                        "name" : "Nom d'équipe "+($scope.teams.length+1),
                        "couleur" : colors[$scope.teams.length+1],
                        "players_name" : players_last_team,
                        "stats" : {
                            "played" : 0,
                            "victory" : 0,
                            "draw" : 0,
                            "defeat" : 0,
                            "bp" : 0,
                            "bc" : 0,
                            "db" : 0,
                            "pts" : 0
                        }
                    };   
                }
                
                $scope.teams.push(team);
            }
        }
        
        
        //Save the teams in local storage
        $scope.save = function(event){
            
            var inputs_team_name = document.getElementsByClassName('team_name_input');

            for( var k = 0; k < inputs_team_name.length; k++){
                
                //verify if team's name are not empty and collect them
                if(inputs_team_name[k].value == ''){ 

                    event.preventDefault();
                    alert("Tu n'as pas entré le nom de toutes les équipes");
                    return false;
                    
                }else{
                    
                    $scope.teams[k].name = inputs_team_name[k].value;
                    
                    //create team for not alea
                    if(!$scope.config.alea){
                        
                        var inputs_player_name = document.getElementsByClassName('name_input');
                        
                        //For fully team
                        if($scope.teams[$scope.teams.length-1].nb_player == $scope.config.nb_players_by_team){

                            for( var i = 0; i < $scope.teams.length; i++){
                                $scope.teams[i].players_name = [];  
                                
                                for( var j = 0; j < $scope.config.nb_players_by_team; j++){
                                    $scope.teams[i].players_name.push(inputs_player_name[i*$scope.config.nb_players_by_team+j].value);    
                                }
                            }
                        
                        //For incomplete team
                        }else{

                            for( var i = 0; i < $scope.teams.length-1; i++){
                                $scope.teams[i].players_name = [];     
                                for( var j = 0; j < $scope.config.nb_players_by_team; j++){
                                    $scope.teams[i].players_name.push(inputs_player_name[i*$scope.config.nb_players_by_team+j].value);    
                                }
                            }

                            $scope.teams[$scope.teams.length-1].players_name = []; 
                            for( var i = inputs_player_name.length; i > ($scope.teams.length-1)*$scope.config.nb_players_by_team; i--){
                                $scope.teams[$scope.teams.length-1].players_name.push(inputs_player_name[i-1].value);
                            }

                        }

                    }
            
                    localStorage.setItem('teams', JSON.stringify($scope.teams));
                }
                
            }
            
            $scope.createLeague();
            
        }
        
        
        //Create the list of matchs and ordered it
        $scope.createLeague = function(){
            
            var matchsAller = [];
            
            for(var i = 0; i < $scope.teams.length ; i++){
                
                for(var j = i+1; j < $scope.teams.length; j++){
                    var match = {};
                    match["0"] = $scope.teams[i];
                    match["1"] = $scope.teams[j];
                    match["b0"] = 0;
                    match["b1"] = 0;
                    match["played"] = false;
                    match["date"] = '';
                    match["state"] = "Aller";

                    matchsAller.push(match);
                }
            }

            var matchsAller_ordered = [];
            var present = false;
            var present2 = false;
            var cpt;
            
            //Ordered array for a league
            for(var i = 0; i < matchsAller.length; i++){
                for(var j = 0; j < matchsAller_ordered.length; j ++){
                    if(matchsAller_ordered[j] == matchsAller[i])
                        present = true;
                }
                
                cpt = i;
                
                if(!present){
                    matchsAller_ordered.push(matchsAller[i]);
                    
                    for(var k = ($scope.teams.length-1); k >= 2; k --){
                        cpt = k + cpt;
                        
                        if(matchsAller[cpt] != null){
                            for(var l = 0; l < matchsAller_ordered.length; l ++){
                                if(matchsAller_ordered[l] == matchsAller[cpt])
                                    present2 = true;
                            }
                            if(present2 == false)
                                matchsAller_ordered.push(matchsAller[cpt]);
                            
                            present2 = false;
                        }
                    }
                }
                
                present = false;
            }

            var matchsRetour_ordered = [];
            
            for(var i = 0; i < matchsAller_ordered.length; i ++) {
                var match = {};
                match["0"] = matchsAller_ordered[i]["1"];
                match["1"] = matchsAller_ordered[i]["0"];
                match["b0"] = 0;
                match["b1"] = 0;
                match["played"] = false;
                match["date"] = '';
                match["state"] = "Retour";

                matchsRetour_ordered.push(match);
            }

            var league = {
                    "aller" : matchsAller_ordered,
                    "retour" : matchsRetour_ordered 
            };
            
            localStorage.setItem('league', JSON.stringify(league));
            localStorage.setItem('state', JSON.stringify(0));
            localStorage.setItem('pledge', 'none');
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
            '<div class="content"><input class="name_input" ng-disabled="config.alea" placeholder="Saisissez un nom" ng-repeat="player in team.players_name track by $index" value="{{player.name}}"></div>' +
            '</div>',
        }
    });
