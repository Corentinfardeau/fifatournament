'use strict';

angular.module('fifatournament')
	.controller('ReadyCtrl', function ($scope, LocalStorage, JSON, displayMessages, API, $location) {
        
        $scope.init = function(tournamentId){
            
            function getPlayers(team, cb){
                API.getPlayersTeam(team._id)
                .success(function(players){
                    cb(null, players);
                })
                .error(function(err){
                    console.error(err);
                });
            }
            
            //Get teams, players
            API.getTournamentTeams(tournamentId)
            .success(function(teams){
                async.map(teams, getPlayers, function(err, results){
                    console.log(results);
                    $scope.players = results;
                    $scope.teams = teams;
                });
            })
            .error(function(err){
                console.error(err);
            });
            
            // Get tournament configuration
            API.getTournament(tournamentId)
            .success(function(tournament){
                console.log(tournament);
                $scope.config = tournament;
            })
            .error(function(err){
                console.error(err);
            });
            
        };
        
        
        //Save teams
        $scope.save = function(event){
            
            event.preventDefault();
            var inputsTeamName = document.getElementsByClassName('teamNameInput');
            
            function updatePlayer(player , playerName){
                API.updatePlayer(player, {playerName : playerName})
                .success(function(player){
                    //console.log(player);
                })
                .error(function(err){
                    console.log(err);
                });
            }
            
            for( var k = 0; k < inputsTeamName.length; k++){
                
                //verify if team's name are not empty and collect them
                if(inputsTeamName[k].value == ''){ 

                    event.preventDefault();
                    displayMessages.error('Tu n\'as pas entré le nom de toutes les équipes');
                    return false;
                    
                }else{
                    
                    //create team for not alea
                    if(!$scope.config.alea){
                        
                        var inputsPlayerName = document.getElementsByClassName('nameInput');
                        
                        //complete team
                        if($scope.teams[$scope.teams.length-1].team.nbPlayers == $scope.config.nbPlayersByTeam){
                            
                            for( var i = 0; i < $scope.teams.length; i++){
                                for( var j = 0; j < $scope.config.nbPlayersByTeam; j++){
                                    updatePlayer($scope.teams[i].team.players[j], inputsPlayerName[i*$scope.config.nbPlayersByTeam+j].value);
                                }
                            }
                            
                        //Incomplete team 
                        }else{
                            
                            for( var i = 0; i < $scope.teams.length-1; i++){
                                for( var j = 0; j < $scope.config.nbPlayersByTeam; j++){
                                    updatePlayer($scope.teams[i].team.players[j], inputsPlayerName[i*$scope.config.nbPlayersByTeam+j].value);
                                }
                            }
                            
                            for( var i = inputsPlayerName.length; i > ($scope.teams.length-1)*$scope.config.nbPlayersByTeam; i--){
                                for( var j = 0; j < $scope.teams[$scope.teams.length-1].team.nbPlayers; j++){
                                    updatePlayer($scope.teams[$scope.teams.length-1].team.players[j], inputsPlayerName[i-1].value);
                                }
                            }    
                            
                        }
                    }
                }

                API.updateTeam($scope.teams[k].team._id, {teamName : inputsTeamName[k].value})
                .success(function(team){
                    //console.log(team);    
                })
                .error(function(err){
                    console.log(err);
                });
                
            }
            
            $scope.createTournament();
           
        }
        
        
        //Create the list of matchs and ordered it
        $scope.createTournament = function(){

            switch($scope.config.type) {
                case 'league':
                    async.waterfall([
                        
                        //Add league to the tournament
                        function(callback) {
                            
                            var tournamentId = LocalStorage.getLocalStorage('tournament');
                            
                            API.createLeague(tournamentId)
                            .success(function(league){
                                console.info('league created');
                                callback(null, league, tournamentId);
                            })
                            .error(function(err){
                                console.error(err);
                            });
                            
                        },
                        // Get all the teams from the tournament
                        function(league, tournamentId, callback) {
                            
                            API.getTournamentTeams(tournamentId)
                            .success(function(teams){
                                console.info('teams recovered');
                                callback(null, teams, league);
                            })
                            .error(function(err){
                                console.error(err);
                            });
                            
                        },
                        
                        // Add matchs to  the new league 
                        function(teams, league, callback){
                            
                            API.createMatchsLeague(league._id, {teams : teams})
                            .success(function(league){
                                console.info('Matchs created');
                                callback(null, league);
                            })
                            .error(function(err){
                                console.log(err);
                                
                            });
                            
                        }
                    ], function (err, result) {
                        $location.path('/matchs');
                        console.log(result);   
                    });

                    break;
                    
                case 'cup':

                    break;
            }
            
        }
        
        $scope.init(LocalStorage.getLocalStorage('tournament'));

});
