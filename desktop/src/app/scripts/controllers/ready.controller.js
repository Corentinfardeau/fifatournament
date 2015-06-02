'use strict';

angular.module('fifatournament')
	.controller('ReadyCtrl', function ($scope, LocalStorage, JSON, displayMessages, API, $location) {
        
        $scope.init = function(tournamentId){
            
            $scope.messages = false;
            
            function getPlayers(team, cb){
                API.getPlayersTeam(team._id)
                .success(function(players){
                    cb(null, players);
                })
                .error(function(err){
                    console.error(err);
                });
            }
            
            //Get teams and players
            API.getTournamentTeams(tournamentId)
            .success(function(teams){
                async.map(teams, getPlayers, function(err, results){
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
                $scope.config = tournament;
            })
            .error(function(err){
                console.error(err);
            });
            
        };
        
        $scope.verifForm = function(event){
            
            event.preventDefault();
            
            var inputsTeamName = document.getElementsByClassName('teamNameInput');
            var inputsPlayerName = document.getElementsByClassName('playersName');
            var formValidate = true;
            
            for(var i = 0; i < inputsPlayerName.length; i++){
                if(inputsPlayerName[i].value == ''){
                    formValidate = false;
                    $scope.msg = "Vous n'avez pas entré tout les noms des joueurs.";
                }
            }
            
            for(var j = 0; j < inputsTeamName.length; j++){
                if(inputsTeamName[j].value == ''){
                    formValidate = false;
                    $scope.msg = "Vous n'avez pas entré tout les noms des équipes.";
                }
            }
            
            if(formValidate){
                
                for(var k = 0; k < inputsTeamName.length; k++){
                    var cpt = 0;

                    if(k != 0) {
                        for(var i = 0; i < $scope.teams[k].players.length; i++){
                            cpt = k * $scope.teams[k].players.length;
                        }
                    }

                    //Update player
                    $scope.updatePlayer(k, inputsPlayerName, cpt, function(player, teamIndex){
                                                
                        $scope.updateTeam(teamIndex, inputsTeamName[teamIndex].value, function(team){
                            if(teamIndex == $scope.teams.length-1){
                                $scope.createTournament();
                            }
                        });  
                    });  
                      
                }
                
            }else{
                $scope.messages = true;
            }
        }
        
        //Update playerName
        $scope.updatePlayer = function(teamIndex, playersName, playerIndex, cb){
            function updatePlayer(player, playerName){
                API.updatePlayer(player, {playerName : playerName})
                .success(function(player){
                    cb(playerName, teamIndex);
                })
                .error(function(err){
                    console.log(err);
                });
            }

            for(var j = 0; j < $scope.teams[teamIndex].players.length; j++){
                updatePlayer($scope.teams[teamIndex].players[j], playersName[playerIndex + j].value);
            }
            
        }
        
        //Update teamName
        $scope.updateTeam = function(teamIndex, teamName, cb){

            API.updateTeam($scope.teams[teamIndex]._id, {teamName : teamName})
            .success(function(team){
                cb(team);
            })
            .error(function(err){
                console.log(err);
            });
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
