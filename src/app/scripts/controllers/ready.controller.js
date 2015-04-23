'use strict';

angular.module('fifatournament')
	.controller('ReadyCtrl', function ($scope, LocalStorage, JSON, Teams, Shuffle, Tournaments) {
    
        $scope.getColors = function() {
                JSON.get('../assets/JSON/colors.json').then(function(success) {
                    $scope.colors = success.data.colors;
                    $scope.alea(Shuffle.shuffleArray($scope.colors));
                }, function(error) {
                    console.log(error);
                });
        };
            
        //Create random team with all attributs
        $scope.alea = function(colors) {
            
            $scope.config = LocalStorage.getLocalStorage('config');
            $scope.teams = Teams.createTeams($scope.config, colors);
            
        };
        
        
        //Save the teams in local storage
        $scope.save = function(event){
            
            var inputsTeamName = document.getElementsByClassName('teamNameInput');

            for( var k = 0; k < inputsTeamName.length; k++){
                
                //verify if team's name are not empty and collect them
                if(inputsTeamName[k].value == ''){ 

                    event.preventDefault();
                    alert("Tu n'as pas entré le nom de toutes les équipes");
                    return false;
                    
                }else{
                    
                    $scope.teams[k].name = inputsTeamName[k].value;
                    
                    //create team for not alea
                    if(!$scope.config.alea){
                        
                        var inputsPlayerName = document.getElementsByClassName('nameInput');
                        
                        //For fully team
                        if($scope.teams[$scope.teams.length-1].nbPlayer == $scope.config.nbPlayersByTeam){

                            for( var i = 0; i < $scope.teams.length; i++){
                                $scope.teams[i].playersName = [];  
                                
                                for( var j = 0; j < $scope.config.nbPlayersByTeam; j++){
                                    $scope.teams[i].playersName.push(inputsPlayerName[i*$scope.config.nbPlayersByTeam+j].value);    
                                }
                            }
                        
                        //For incomplete team
                        }else{

                            for( var i = 0; i < $scope.teams.length-1; i++){
                                $scope.teams[i].playersName = [];     
                                for( var j = 0; j < $scope.config.nbPlayersByTeam; j++){
                                    $scope.teams[i].playersName.push(inputsPlayerName[i*$scope.config.nbPlayersByTeam+j].value);    
                                }
                            }

                            $scope.teams[$scope.teams.length-1].playersName = []; 
                            for( var i = inputsPlayerName.length; i > ($scope.teams.length-1)*$scope.config.nbPlayersByTeam; i--){
                                $scope.teams[$scope.teams.length-1].playersName.push(inputsPlayerName[i-1].value);
                            }

                        }

                    }
                    
                    LocalStorage.setLocalStorage('teams', $scope.teams);
                }
                
            }
            
            $scope.createTournament();
        }
        
        
        //Create the list of matchs and ordered it
        $scope.createTournament = function(){

            switch($scope.config.type) {
                case 'league':
                    var league = Tournaments.createLeague($scope.teams);
                    LocalStorage.setLocalStorage('league', league);
                    LocalStorage.setLocalStorage('state', 0);
                    LocalStorage.setLocalStorage('pledge', 'none');
                    break;
                    
                case 'cup':
                    Tournaments.createCup($scope.teams);
                    break;
            }
            
        }
    
        $scope.getColors();

});
