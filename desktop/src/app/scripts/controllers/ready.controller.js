'use strict';

angular.module('fifatournament')
	.controller('ReadyCtrl', function ($scope, LocalStorage, JSON, Shuffle,displayMessages, API) {
    
        $scope.getColors = function() {
            
                JSON.get('../assets/JSON/colors.json').then(function(success) {
                    $scope.colors = success.data.colors;
                    
                    API.getClubsByStars(5)
                    .success(function(data){
                        console.log('clubs récupérées');
                        $scope.clubs = data;
                        $scope.alea(Shuffle.shuffleArray($scope.colors),$scope.clubs);
                    })
                    .error(function(data){
                        console.log('error');
                        console.log(data);
                    })
                    
                }, function(error) {
                    console.log('Cannot get colors.json: ' + error);
                });
        };
            
        //Create random team with all attributs
        $scope.alea = function(colors,clubs) {
            
            $scope.config = LocalStorage.getLocalStorage('config');
            
            var params = {
                'config' : $scope.config,
                'colors' : colors,
                'clubs' : clubs
            }
            
            API.createTeams(params)
            .success(function(data){
                console.log('teams created');
                $scope.teams = data;
            })
            .error(function(data){
                console.log('error');
                console.log(data);
            });
            
        };
        
        //Save the teams in local storage
        $scope.save = function(event){
            
            var inputsTeamName = document.getElementsByClassName('teamNameInput');

            for( var k = 0; k < inputsTeamName.length; k++){
                
                //verify if team's name are not empty and collect them
                if(inputsTeamName[k].value == ''){ 

                    event.preventDefault();
                    displayMessages.error('Tu n\'as pas entré le nom de toutes les équipes');
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
                                    $scope.teams[i].playersName.push({'name':inputsPlayerName[i*$scope.config.nbPlayersByTeam+j].value,'nbGoal':0});    
                                }
                            }
                        
                        //For incomplete team
                        }else{

                            for( var i = 0; i < $scope.teams.length-1; i++){
                                $scope.teams[i].playersName = [];     
                                for( var j = 0; j < $scope.config.nbPlayersByTeam; j++){
                                    $scope.teams[i].playersName.push({'name':inputsPlayerName[i*$scope.config.nbPlayersByTeam+j].value,'nbGoal':0});
                                }
                            }

                            $scope.teams[$scope.teams.length-1].playersName = []; 
                            for( var i = inputsPlayerName.length; i > ($scope.teams.length-1)*$scope.config.nbPlayersByTeam; i--){
                                $scope.teams[$scope.teams.length-1].playersName.push({'name':inputsPlayerName[i-1].value,'nbGoal':0});
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
                    API.createLeague($scope.teams)
                    .success(function(data){
                        
                        var league = data;
                        LocalStorage.setLocalStorage('league', league);
                        LocalStorage.setLocalStorage('state', 0);
                        LocalStorage.setLocalStorage('pledge', 'none');
                        
                    })
                    .error(function(data){
                        
                        console.log(data);
                        
                    });
                    
                    break;
                    
                case 'cup':

                    break;
            }
            
        }
        
        API.getTournamentTeams(LocalStorage.getLocalStorage('tournament'))
        .success(function(teams){
            console.log(teams);
            $scope.teams = teams;
        })
        .error(function(err){
            console.error(err);
        });
        
        //$scope.getColors();

});
