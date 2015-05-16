'use strict';

angular.module('fifatournament')
  .controller('MatchsCtrl', function ($scope,$location, $timeout, LocalStorage, Matchs, API) {
    
    $scope.init = function(){
        
        var tournamentId = LocalStorage.getLocalStorage('tournament');
        
        async.waterfall([
            function(callback) {
                API.getTournament(tournamentId)
                .success(function(tournament){
                    $scope.config = tournament;
                    callback(null, tournament);
                })
                .error(function(err){
                    console.error(err);
                });
            },
            function(tournament, callback) {
                switch(tournament.type) {
                    case 'league':
                        API.getLeague(tournament.competition_id)
                        .success(function(league){
                            callback(null, league);
                            $scope.setWidthWrapper();
                        })
                        .error(function(err){
                            console.log(err);
                        })
                    break;
                }
            }
        ], function (err, league) {
            // console.log(league);
            $scope.launchLeague(league);
        });
    }
    
    $scope.launchLeague = function(league){
        $scope.stateT = 0;
        $scope.popup = false;
        $scope.league = league;
        $scope.nbMatchs = 0;
        $scope.state = 	0;

        if(LocalStorage.getLocalStorage('state') > 0) {
            $scope.state = LocalStorage.getLocalStorage('state');
        }
        
        $scope.translateX = (window.innerWidth / 2) - 296;
        $scope.wrapper = document.getElementById('matchs-wrapper');
        $scope.matchs = document.getElementsByClassName('match-card');
        $scope.live = false;
        
        $scope.calcMatchs(league);
        $scope.showArrows();
        $scope.disableCard(league);
        $scope.detectEndGame();
    }
    
    $scope.setWidthWrapper = function() {
        $scope.wrapper.style.width = ($scope.nbMatchs + 1) * (496) + 'px';
        $scope.wrapper.style.webkitTransform = 'translate3d(calc(' + 50 / ((($scope.nbMatchs + 1) * (496)) / window.innerWidth) + '% - 296px),0,0)';
        $scope.wrapper.style.MozTransform = 'translate3d(calc(' + 50 / ((($scope.nbMatchs + 1) * (496)) / window.innerWidth) + '% - 296px),0,0)';
        $scope.wrapper.style.msTransform = 'translate3d(calc(' + 50 / ((($scope.nbMatchs + 1) * (496)) / window.innerWidth) + '% - 296px),0,0)';
        $scope.wrapper.style.OTransform = 'translate3d(calc(' + 50 / ((($scope.nbMatchs + 1) * (496)) / window.innerWidth) + '% - 296px),0,0)';
        $scope.wrapper.style.transform = 'translate3d(calc(' + 50 / ((($scope.nbMatchs + 1) * (496)) / window.innerWidth) + '% - 296px),0,0)';
    };


    $scope.detectEndGame = function(){
        var cpt = 0;
        for(var i =0; i < $scope.league.returnLeg.length; i++){
            if($scope.league.returnLeg[i].played === true){
                if(cpt === $scope.league.returnLeg.length-1) {
                    $location.path('/end');
                } else {
                    cpt++;
                }
            } else { return false; }  
        }
    };


    $scope.disableCard = function() {
        $scope.nbMatchsPlayed = $scope.league.firstLeg.length + $scope.league.returnLeg.length - $scope.nbMatchs;

        if($scope.nbMatchs > $scope.league.firstLeg.length) {
            $scope.matchsType = 'firstLeg';
        } else {
            $scope.matchsType = 'returnLeg';
        }

        if($scope.state >= $scope.league.firstLeg.length) {
            $scope.state = 0;
        }
    };

    $scope.calcMatchs = function() {
        $scope.nbMatchs = 0;

        for(var i = 0; i < $scope.league.firstLeg.length; i++) {
            if(!$scope.league.firstLeg[i].played) {
                $scope.nbMatchs++
            }
        }

        for(var j = 0; j < $scope.league.returnLeg.length; j++) {
            if(!$scope.league.returnLeg[j].played) {
                $scope.nbMatchs++
            }
        }
    };


    $scope.startMatch = function() {
        for(var i = 0, l = $scope.matchs.length; i < l; i++) {
            $scope.matchs[i].classList.add('disabled');
            $scope.matchs[i].classList.remove('active');
        }

        $scope.matchs[$scope.stateT].classList.remove('disabled');
        $scope.matchs[$scope.stateT].classList.add('active');
        document.getElementById('title').classList.add('active');
        document.getElementById('btn-wrapper').classList.add('active');
        $scope.live = true;
    };


    $scope.stopMatch = function() {
        document.getElementById('title').classList.remove('active');
        document.getElementById('btn-wrapper').classList.remove('active');
        $scope.matchs[$scope.stateT].classList.add('leave');

        $timeout(function(){
            if($scope.matchsType === 'firstLeg') {

                API.updateMatch($scope.league.firstLeg[$scope.state]._id, {played : true, date : Date.now()/1000})
                .success(function(match){
                    // console.log(match);
                    $scope.league.firstLeg[$scope.state] = match;

                    $scope.live = false;
                    $scope.state++;

                    LocalStorage.setLocalStorage('state', $scope.state);

                    $scope.calcMatchs();
                    $scope.showArrows();
                    $scope.disableCard();
                    $scope.detectEndGame();
                })
                .error(function(err){
                    console.log(err);
                });
                
            }else{
                API.updateMatch($scope.league.returnLeg[$scope.state]._id, {played : true, date : Date.now()/1000})
                .success(function(match){
                    // console.log(match);
                    $scope.league.returnLeg[$scope.state] = match;

                    $scope.live = false;
                    $scope.state++;

                    LocalStorage.setLocalStorage('state', $scope.state);

                    $scope.calcMatchs();
                    $scope.showArrows();
                    $scope.disableCard();
                    $scope.detectEndGame();
                })
                .error(function(err){
                    console.log(err);
                });
            }
        },500);
    };


    $scope.translateR = function() {
        if($scope.stateT >= $scope.nbMatchs - 1 || $scope.live) { return };

        $scope.stateT++;
        $scope.showArrows();
        $scope.translateX -= 496;
        $scope.wrapper.style.webkitTransform = 'translate3D(' + $scope.translateX + 'px,0,0)';
        $scope.wrapper.style.MozTransform = 'translate3D(' + $scope.translateX + 'px,0,0)';
        $scope.wrapper.style.msTransform = 'translate3D(' + $scope.translateX + 'px,0,0)';
        $scope.wrapper.style.OTransform = 'translate3D(' + $scope.translateX + 'px,0,0)';
        $scope.wrapper.style.transform = 'translate3D(' + $scope.translateX + 'px,0,0)';
    };


    $scope.translateL = function() {
        if($scope.stateT === 0 || $scope.live) { return };

        $scope.stateT--;
        $scope.showArrows();
        $scope.translateX += 496;
        $scope.wrapper.style.webkitTransform = 'translate3D(' + $scope.translateX + 'px,0,0)';
        $scope.wrapper.style.MozTransform = 'translate3D(' + $scope.translateX + 'px,0,0)';
        $scope.wrapper.style.msTransform = 'translate3D(' + $scope.translateX + 'px,0,0)';
        $scope.wrapper.style.OTransform = 'translate3D(' + $scope.translateX + 'px,0,0)';
        $scope.wrapper.style.transform = 'translate3D(' + $scope.translateX + 'px,0,0)';
    };


    $scope.showArrows = function() {
        var right = document.getElementById('arrow-right');
        var left = document.getElementById('arrow-left')
        
        if($scope.stateT >= $scope.nbMatchs - 1){
            right.classList.add('disabled');
        } else {
            right.classList.remove('disabled');
        }
        
        
        if($scope.stateT === 0){
            left.classList.add('disabled');
        } else {
            left.classList.remove('disabled');
        }
        
        if($scope.stateT < $scope.nbMatchs - 1 && $scope.stateT !== 0) {
            document.getElementById('arrow-right').classList.remove('disabled');
            document.getElementById('arrow-left').classList.remove('disabled');
        }
    };


    $scope.shake = function(event){
        var matchs =  event.currentTarget.parentNode.parentNode.parentNode;
        matchs.classList.add('shake');

        $timeout(function(){
            matchs.classList.remove('shake');
        }, 700);
    };

    $scope.setGoals = function(idMatch, teamScored) {
        var tournamentId = LocalStorage.getLocalStorage('tournament');
        $scope.players = [];
        
        function getPlayers(teamId, cb){
            API.getPlayersTeam(teamId)
            .success(function(playersInfos){
                var players = [];

                if(playersInfos.players.length == 1) {
                    $scope.popup = false;
                } else {
                    $scope.popup = true;
                }

                for(var j = 0; j < playersInfos.players.length; j++ ){
                    players.push(playersInfos.players[j]);    
                }
                
                cb(players);
            })
            .error(function(err){
                cb(err);
            });
        }
        
        function updateMatch(teamId, update, cb){
            API.updateMatch(teamId, update)
            .success(function(match){
                cb(match);
            })
            .error(function(err){
                cb(err);    
            });
        }

        function updateTeam(teamId,cb) {
            var scoreUpdate = 0;

            API.getTournamentTeams(tournamentId)
            .success(function(teams){
                for(var i = 0; i < teams.length; i++) {
                    if(teams[i]._id === teamId) {
                        scoreUpdate = teams[i].gf + 1;
                    }
                }

                var update = {
                    'gf' : scoreUpdate
                }

                API.updateTeam(teamId, update)
                .success(function(match){
                    console.log(match);
                    cb(match);
                })
                .error(function(err){
                    cb(err);    
                });
            })
            .error(function(err){
                console.error(err);
            });
        }
        
        if($scope.matchsType == 'firstLeg'){
            var match = $scope.league.firstLeg[idMatch];

            var update = {
                goalHomeTeam : match.goalHomeTeam,
                goalAwayTeam : match.goalAwayTeam
            };

            updateMatch(match._id, update, function(match){
                // console.log(match);                
            });

            updateTeam(teamScored._id, function(match){
                // console.log(match);                
            });

            getPlayers(teamScored._id, function(players){    
                for(var i =0; i < players.length; i++){
                    $scope.players.push(players[i]); 
                }
            });

        } else {
            var match = $scope.league.returnLeg[idMatch];
            
            var update = {
                goalHomeTeam : match.goalHomeTeam,
                goalAwayTeam : match.goalAwayTeam
            };
            
            updateMatch(match._id, update, function(match){
                // console.log(match);                
            });

            updateTeam(teamScored._id, function(match){
                // console.log(match);                
            });
            
            getPlayers(teamScored._id, function(players){
                for(var i =0; i < players.length; i++){
                    $scope.players.push(players[i]); 
                }
            });
        }
    };
    
    $scope.setPlayerGoal = function(player){
        var nbGoal = player.nbGoal + 1;
        
        API.updatePlayer(player._id, {nbGoal : nbGoal})
        .success(function(player){
            // console.log(player);
            $scope.popup = false;
        })
        .error(function(){
            
        })
    }
    
    $scope.init();
  });
