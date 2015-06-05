'use strict';

angular.module('fifatournament')
  .controller('MatchsCtrl', function ($rootScope,$scope,$location, $timeout, LocalStorage, Matchs, API) {
    
    $scope.init = function(){

        $scope.loading = true;
        
        $scope.tournamentId = LocalStorage.getLocalStorage('tournament');
        $scope.userStatut = LocalStorage.getLocalStorage('userStatut');

        async.waterfall([
            function(callback) {
                API.getTournament($scope.tournamentId)
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
                            $scope.setWrapper();
                        })
                        .error(function(err){
                            console.error(err);
                        })
                    break;
                }
            }
        ], function (err, league) {
            $scope.launch(league);

            $scope.loading = false;
        });
    };
    
    $scope.launch = function(league){
        
        // init scope var
        $scope.popup = false;
        $scope.league = league;
        $scope.nbMatchs = 0;
        $scope.state = 	0;
        $scope.live = false;
        $scope.matchsRemaining = 0;
        $scope.nbMatchs = $scope.league.firstLeg.length + $scope.league.returnLeg.length;

        // get state if already exists in LocalStorage
        if(LocalStorage.getLocalStorage('state') > 0) {
            $scope.state = LocalStorage.getLocalStorage('state');
        }

        // init dom var in scope
        $scope.translateX = (window.innerWidth / 2) - 296;
        $scope.domWrapper = document.getElementById('matchs-wrapper');
        $scope.domMatchs = document.getElementsByClassName('match-card');
        
        // launch functions
        $scope.calcMatchs();
        $scope.disableCard();
        $scope.detectEndGame();
        $scope.getTeamsScore();

        if($scope.matchsType === 'firstLeg') {
            console.log($scope.league.firstLeg[$scope.state].homeTeam);
            if($scope.league.firstLeg[$scope.state].live) {
                $scope.live = true;
            }
        } else {
            if($scope.league.returnLeg[$scope.state].live) {
                $scope.live = true;
            }
        }
    }
    
    $scope.setWrapper = function() {
        $scope.translateValue = 50 / ((($scope.nbMatchs + 1) * (496)) / window.innerWidth);

        // translate wrapper
        $scope.domWrapper.style.width = ($scope.nbMatchs + 1) * (496) + 'px';

        $scope.domWrapper.style.webkitTransform = 'translate3d(calc(' + $scope.translateValue + '% - 296px),0,0)';
        $scope.domWrapper.style.MozTransform = 'translate3d(calc(' + $scope.translateValue + '% - 296px),0,0)';
        $scope.domWrapper.style.msTransform = 'translate3d(calc(' + $scope.translateValue + '% - 296px),0,0)';
        $scope.domWrapper.style.OTransform = 'translate3d(calc(' + $scope.translateValue + '% - 296px),0,0)';
        $scope.domWrapper.style.transform = 'translate3d(calc(' + $scope.translateValue + '% - 296px),0,0)';
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

    $scope.getTeamsScore = function() {
        if($scope.matchsType === 'firstLeg') {
            if(!$scope.league.firstLeg[$scope.state].live) {
                $rootScope.homeTeam = $scope.league.firstLeg[$scope.state].homeTeam;
                $rootScope.awayTeam = $scope.league.firstLeg[$scope.state].awayTeam;
            }
        } else if($scope.matchsType === 'returnLeg') {
            if(!$scope.league.returnLeg[$scope.state].live) {
                $rootScope.homeTeam = $scope.league.returnLeg[$scope.state].homeTeam;
                $rootScope.awayTeam = $scope.league.returnLeg[$scope.state].awayTeam;
            }
        }
    };

    $scope.disableCard = function() {
        // remove bug while juste have 2 matchs
        for(var i = 0; i < $scope.domMatchs.length; i ++) {
            $scope.domMatchs[i].classList.remove('disabled');
        }

        if($scope.matchsRemaining > $scope.league.firstLeg.length) {
            $scope.matchsType = 'firstLeg';
        } else {
            $scope.matchsType = 'returnLeg';
        }

        if($scope.matchsRemaining === $scope.league.firstLeg.length) {
            $scope.state = 0;
        }
    };

    $scope.calcMatchs = function() {
        $scope.matchsRemaining = 0;

        for(var i = 0; i < $scope.league.firstLeg.length; i++) {
            if(!$scope.league.firstLeg[i].played) {
                $scope.matchsRemaining++;
            }
        }

        for(var j = 0; j < $scope.league.returnLeg.length; j++) {
            if(!$scope.league.returnLeg[j].played) {
                $scope.matchsRemaining++;
            }
        }
    };

    $scope.updateResults = function() {
        $scope.idMatch = $scope.state;

        if($scope.matchsType === 'firstLeg') {
            var match = $scope.league.firstLeg[$scope.idMatch];
        } else {
            var match = $scope.league.returnLeg[$scope.idMatch];
        }

        function updateTeam(team,type,cb) {
            if(team === 'home') {
                var won = $rootScope.homeTeam.won;
                var lost = $rootScope.homeTeam.lost;
                var drawn = $rootScope.homeTeam.drawn;
                var pts = $rootScope.homeTeam.pts;

                var teamId = $rootScope.homeTeam._id;
                if(type === 'won') {
                    var update = {
                        'won': won + 1,
                        'lost': lost,
                        'drawn': drawn,
                        'pts': pts + 3,
                    }
                } else if(type === 'lost') {
                    var update = {
                        'won': won,
                        'lost': lost + 1,
                        'drawn': drawn,
                        'pts': pts,
                    }
                } else if(type === 'drawn') {
                    var update = {
                        'won': won,
                        'lost': lost,
                        'drawn': drawn + 1,
                        'pts': pts + 1,
                    }
                }
            } else if(team == 'away') {
                var won = $rootScope.awayTeam.won;
                var lost = $rootScope.awayTeam.lost;
                var drawn = $rootScope.awayTeam.drawn;
                var pts = $rootScope.awayTeam.pts;

                var teamId = $rootScope.awayTeam._id;
                if(type === 'won') {
                    var update = {
                        'won': won + 1,
                        'lost': lost,
                        'drawn': drawn,
                        'pts': pts + 3,
                    }
                } else if(type === 'lost') {
                    var update = {
                        'won': won,
                        'lost': lost + 1,
                        'drawn': drawn,
                        'pts': pts,
                    }
                } else if(type === 'drawn') {
                    var update = {
                        'won': won,
                        'lost': lost,
                        'drawn': drawn + 1,
                        'pts': pts + 1,
                    }
                }
            }

            API.updateTeam(teamId, update)
            .success(function(team){
                cb(team);
            })
            .error(function(err){
                cb(err);    
            });
        }

        if(match.goalHomeTeam > match.goalAwayTeam) {
            updateTeam('home','won', function(team){});
            updateTeam('away','lost', function(team){});
        } else if(match.goalHomeTeam < match.goalAwayTeam) {
            updateTeam('home','lost', function(team){});
            updateTeam('away','won', function(team){});
        } else {
            updateTeam('home','drawn', function(team){});
            updateTeam('away','drawn', function(team){});
        }
    }

    $scope.startMatch = function() {
        for(var i = 0, l = $scope.domMatchs.length; i < l; i++) {
            $scope.domMatchs[i].classList.add('disabled');
            $scope.domMatchs[i].classList.remove('active');
        }

        var options = {
            'live': true
        }
        
        if($scope.matchsType === 'firstLeg') {
            $scope.league.firstLeg[$scope.state].live = true;
            $scope.live = true;

            API.updateMatch($scope.league.firstLeg[$scope.state]._id, options)
            .success(function(match){});
        } else {
            $scope.league.returnLeg[$scope.state].live = true;
            $scope.live = true;

            API.updateMatch($scope.league.returnLeg[$scope.state]._id, options)
            .success(function(match){});
        }

        $scope.getTeamsScore();
        $scope.updateResults();

        $scope.domMatchs[0].classList.remove('disabled');
        $scope.domMatchs[0].classList.add('active');
    };

    $scope.stopMatch = function(){
        $scope.domMatchs[0].classList.add('leave');
        
        var options = {
            live: false,
            played : true, 
            date : Date.now() / 1000
        };

        if($scope.matchsType === 'firstLeg') {
            $scope.league.firstLeg[$scope.state].live = false;
            $scope.live = false;
        } else {
            $scope.league.returnLeg[$scope.state].live = false;
            $scope.live = false;
        }

        function nextStep() {
            $scope.updateResults();

            $scope.state++;

            LocalStorage.setLocalStorage('state', $scope.state);

            $scope.calcMatchs();
            $scope.disableCard();
            $scope.detectEndGame();
        }
        
        $timeout(function(){
            if($scope.matchsType === 'firstLeg') {
                
                API.updateMatch($scope.league.firstLeg[$scope.state]._id, options)
                .success(function(match){
                    $scope.league.firstLeg[$scope.state] = match;
                    nextStep();
                })
                .error(function(err){
                    console.log(err);
                });
                
            } else {
                API.updateMatch($scope.league.returnLeg[$scope.state]._id, options)
                .success(function(match){
                    $scope.league.returnLeg[$scope.state] = match;
                    nextStep();
                })
                .error(function(err){
                    console.log(err);
                });
            }            
        },500);
    };

    $scope.shake = function(event){
        var matchs =  $scope.domMatchs[0];
        matchs.classList.add('shake');

        $timeout(function(){
            matchs.classList.remove('shake');
        }, 700);
    };

    $scope.getPlayers = function(idMatch, teamScored, teamScoredStatut) {
        $scope.idMatch = idMatch;
        $scope.teamScored = teamScored;
        $scope.teamScoredStatut = teamScoredStatut;
        $scope.players = [];

        function getPlayers(teamId, cb){
            API.getPlayersTeam(teamId)
            .success(function(playersInfos){
                var players = [];

                $scope.popup = true;

                for(var j = 0; j < playersInfos.length; j++ ){
                    players.push(playersInfos[j]);    
                }
                
                cb(players);
            })
            .error(function(err){
                cb(err);
            });
        }

        if($scope.matchsType === 'firstLeg'){

            if($scope.league.firstLeg[$scope.idMatch].awayTeam._id === $scope.teamScored._id) {
                $scope.teamNoScored = $scope.league.firstLeg[$scope.idMatch].homeTeam;
            } else {
                $scope.teamNoScored = $scope.league.firstLeg[$scope.idMatch].awayTeam;
            }

            getPlayers($scope.teamScored._id, function(players){ 
                for(var i =0; i < players.length; i++){
                    $scope.players.push(players[i]); 
                }
                $scope.players.push({'playerName': 'CSC'});
            });

        } else {

            if($scope.league.returnLeg[$scope.idMatch].awayTeam._id === $scope.teamScored._id) {
                $scope.teamNoScored = $scope.league.returnLeg[$scope.idMatch].homeTeam;
            } else {
                $scope.teamNoScored = $scope.league.returnLeg[$scope.idMatch].awayTeam;
            }
            
            getPlayers($scope.teamScored._id, function(players){
                for(var i =0; i < players.length; i++){
                    $scope.players.push(players[i]); 
                }
                $scope.players.push({'playerName': 'CSC'});
            });
        }
    }

    $scope.setGoal = function(player) {
        var nbGoal = player.nbGoal + 1;
        
        function updateMatch(teamId, update, cb){
            API.updateMatch(teamId, update)
            .success(function(match){
                cb(match);
            })
            .error(function(err){
                cb(err);    
            });
        }

        function updateTeam(teamId,type,cb) {
            var gf = 0;
            var gd = 0;
            var ga = 0;

            API.getTournamentTeams($scope.tournamentId)
            .success(function(teams){
                for(var i = 0; i < teams.length; i++) {
                    if(teams[i]._id === teamId && type === 'scored') {
                        ga = teams[i].ga;
                        gf = teams[i].gf + 1;
                        gd = teams[i].gd + 1;
                    } else if(teams[i]._id === teamId && type === 'noScored') {
                        gf = teams[i].gf;
                        ga = teams[i].ga + 1;
                        gd = teams[i].gd - 1;
                    }
                }

                var update = {
                    'ga' : ga,
                    'gf' : gf,
                    'gd' : gd
                }

                API.updateTeam(teamId, update)
                .success(function(match){

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

        if(player.playerName === 'CSC') {
            $scope.popup = false;
            $scope.shake(event);

            if($scope.matchsType === 'firstLeg') {
                if($scope.teamScoredStatut === 'homeTeam') {
                    $scope.teamNoScored = $scope.league.firstLeg[$scope.idMatch].awayTeam;

                    // update match score
                    $scope.league.firstLeg[$scope.idMatch].goalHomeTeam++;

                    // update team
                    $scope.league.firstLeg[$scope.idMatch].homeTeam.gf++;
                    $scope.league.firstLeg[$scope.idMatch].homeTeam.gd++;

                    $scope.league.firstLeg[$scope.idMatch].awayTeam.ga++;
                    $scope.league.firstLeg[$scope.idMatch].awayTeam.gd--;
                } else {
                    $scope.teamNoScored = $scope.league.firstLeg[$scope.idMatch].homeTeam;

                    // update match score 
                    $scope.league.firstLeg[$scope.idMatch].goalAwayTeam++;

                    // update team
                    $scope.league.firstLeg[$scope.idMatch].awayTeam.gf++;
                    $scope.league.firstLeg[$scope.idMatch].awayTeam.gd++;

                    $scope.league.firstLeg[$scope.idMatch].homeTeam.ga++;
                    $scope.league.firstLeg[$scope.idMatch].homeTeam.gd--;
                }


                var match = $scope.league.firstLeg[$scope.idMatch];
            } else {
                if($scope.teamScoredStatut === 'homeTeam') {
                    $scope.teamNoScored = $scope.league.returnLeg[$scope.idMatch].awayTeam;

                    // update match score
                    $scope.league.returnLeg[$scope.idMatch].goalHomeTeam++;

                    // update team
                    $scope.league.returnLeg[$scope.idMatch].homeTeam.gf++;
                    $scope.league.returnLeg[$scope.idMatch].homeTeam.gd++;

                    $scope.league.returnLeg[$scope.idMatch].awayTeam.ga++;
                    $scope.league.returnLeg[$scope.idMatch].awayTeam.gd--;
                } else {
                    $scope.teamNoScored = $scope.league.returnLeg[$scope.idMatch].homeTeam;

                    // update match score
                    $scope.league.returnLeg[$scope.idMatch].goalAwayTeam++;

                    // update team
                    $scope.league.returnLeg[$scope.idMatch].awayTeam.gf++;
                    $scope.league.returnLeg[$scope.idMatch].awayTeam.gd++;

                    $scope.league.returnLeg[$scope.idMatch].homeTeam.ga++;
                    $scope.league.returnLeg[$scope.idMatch].homeTeam.gd--;
                }

                var match = $scope.league.returnLeg[$scope.idMatch];
            }

            var update = {
                goalHomeTeam : match.goalHomeTeam,
                goalAwayTeam : match.goalAwayTeam
            };

            updateMatch(match._id, update, function(match){});

            updateTeam($scope.teamScored._id,'scored', function(match){});

            updateTeam($scope.teamNoScored._id,'noScored', function(match){});

            $scope.updateResults();
        } else {
            API.updatePlayer(player._id, {nbGoal : nbGoal})
            .success(function(player){
                $scope.popup = false;
                $scope.shake(event);

                if($scope.matchsType === 'firstLeg') {
                    if($scope.teamScoredStatut === 'homeTeam') {
                        $scope.teamNoScored = $scope.league.firstLeg[$scope.idMatch].awayTeam;

                        // update match score
                        $scope.league.firstLeg[$scope.idMatch].goalHomeTeam++;

                        // update team
                        $scope.league.firstLeg[$scope.idMatch].homeTeam.gf++;
                        $scope.league.firstLeg[$scope.idMatch].homeTeam.gd++;

                        $scope.league.firstLeg[$scope.idMatch].awayTeam.ga++;
                        $scope.league.firstLeg[$scope.idMatch].awayTeam.gd--;
                    } else {
                        $scope.teamNoScored = $scope.league.firstLeg[$scope.idMatch].homeTeam;

                        // update match score 
                        $scope.league.firstLeg[$scope.idMatch].goalAwayTeam++;

                        // update team
                        $scope.league.firstLeg[$scope.idMatch].awayTeam.gf++;
                        $scope.league.firstLeg[$scope.idMatch].awayTeam.gd++;

                        $scope.league.firstLeg[$scope.idMatch].homeTeam.ga++;
                        $scope.league.firstLeg[$scope.idMatch].homeTeam.gd--;
                    }


                    var match = $scope.league.firstLeg[$scope.idMatch];
                } else {
                    if($scope.teamScoredStatut === 'homeTeam') {
                        $scope.teamNoScored = $scope.league.returnLeg[$scope.idMatch].awayTeam;

                        // update match score
                        $scope.league.returnLeg[$scope.idMatch].goalHomeTeam++;

                        // update team
                        $scope.league.returnLeg[$scope.idMatch].homeTeam.gf++;
                        $scope.league.returnLeg[$scope.idMatch].homeTeam.gd++;

                        $scope.league.returnLeg[$scope.idMatch].awayTeam.ga++;
                        $scope.league.returnLeg[$scope.idMatch].awayTeam.gd--;
                    } else {
                        $scope.teamNoScored = $scope.league.returnLeg[$scope.idMatch].homeTeam;

                        // update match score
                        $scope.league.returnLeg[$scope.idMatch].goalAwayTeam++;

                        // update team
                        $scope.league.returnLeg[$scope.idMatch].awayTeam.gf++;
                        $scope.league.returnLeg[$scope.idMatch].awayTeam.gd++;

                        $scope.league.returnLeg[$scope.idMatch].homeTeam.ga++;
                        $scope.league.returnLeg[$scope.idMatch].homeTeam.gd--;
                    }

                    var match = $scope.league.returnLeg[$scope.idMatch];
                }

                var update = {
                    goalHomeTeam : match.goalHomeTeam,
                    goalAwayTeam : match.goalAwayTeam
                };

                updateMatch(match._id, update, function(match){});

                updateTeam($scope.teamScored._id,'scored', function(match){});

                updateTeam($scope.teamNoScored._id,'noScored', function(match){});

                $scope.updateResults();
            })
            .error(function(){
                
            });
        }
    }

    $scope.cancelGoal = function() {
        $scope.popup = false;
    }
    
    $scope.init();
  });
