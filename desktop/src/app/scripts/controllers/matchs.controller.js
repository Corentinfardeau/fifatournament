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
                        })
                        .error(function(err){
                            console.log(err);
                        })
                        break;
                }
            }
        ], function (err, league) {
            console.log(league);
            $scope.launchLeague(league);
        });
    }
    
    $scope.launchLeague = function(league){
        
        $scope.stateT = 0;
        $scope.popup = false;
        $scope.league = league;
        $scope.nbMatchs = 0;
        $scope.state = 	0;
        
        $scope.translateX = (window.innerWidth / 2) - 296;
        $scope.wrapper = document.getElementById('matchs-wrapper');
        $scope.matchs = document.getElementsByClassName('match-card');
        $scope.live = false;
        
        $scope.calcMatchs(league);
        $scope.showArrows();
        $scope.disableCard(league);
        $scope.detectEndGame(league);
        $scope.setWidthWrapper();
    }
    
    $scope.setWidthWrapper = function() {
      $scope.wrapper.style.width = ($scope.nbMatchs + 1) * (496) + 'px';
      $scope.wrapper.style.webkitTransform = 'translate3d(calc(' + 50 / ((($scope.nbMatchs + 1) * (496)) / window.innerWidth) + '% - 296px),0,0)';
      $scope.wrapper.style.MozTransform = 'translate3d(calc(' + 50 / ((($scope.nbMatchs + 1) * (496)) / window.innerWidth) + '% - 296px),0,0)';
      $scope.wrapper.style.msTransform = 'translate3d(calc(' + 50 / ((($scope.nbMatchs + 1) * (496)) / window.innerWidth) + '% - 296px),0,0)';
      $scope.wrapper.style.OTransform = 'translate3d(calc(' + 50 / ((($scope.nbMatchs + 1) * (496)) / window.innerWidth) + '% - 296px),0,0)';
      $scope.wrapper.style.transform = 'translate3d(calc(' + 50 / ((($scope.nbMatchs + 1) * (496)) / window.innerWidth) + '% - 296px),0,0)';
    };


    $scope.detectEndGame = function(league){
      var cpt = 0;
      for(var i =0; i < league.returnLeg.length; i++){
        if(league.returnLeg[i].played === true){
          if(cpt === league.returnLeg.length-1) {
            $location.path('/end'); 
          } else {
            cpt++;  
          }
        } else return false;
      }   
    };


    $scope.disableCard = function(league) {

      if($scope.nbMatchs > league.firstLeg.length) {
        $scope.matchsType = 'firstLeg';
      } else {
        $scope.matchsType = 'returnLeg';
      }

      if($scope.state >= league.firstLeg.length) {
          $scope.state = 0;
      }
    };

    $scope.calcMatchs = function(league) {

      for(var i = 0; i < league.firstLeg.length; i++) {
        if(!league.firstLeg[i].played) {
          $scope.nbMatchs++
        }
      }
        
      for(var j = 0; j < league.returnLeg.length; j++) {
        if(!league.returnLeg[j].played) {
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

      $timeout(function() {
        if($scope.matchsType === 'firstLeg') {
          $scope.league.firstLeg[$scope.state].played = true;
          $scope.league.firstLeg[$scope.state].date = Date.now() / 1000;
        } else {
          $scope.league.returnLeg[$scope.state].played = true;
          $scope.league.returnLeg[$scope.state].date = Date.now() / 1000;
        }

        $scope.live = false;

        if($scope.matchsType === 'firstLeg') {
          $scope.calcPts('firstLeg');
        } else {
          $scope.calcPts('returnLeg');
        }

        $scope.state++;

        LocalStorage.setLocalStorage('league', $scope.league);
        LocalStorage.setLocalStorage('state', $scope.state);

        $scope.detectEndGame();

        $scope.calcMatchs();
        $scope.showArrows();
        $scope.disableCard();
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
      if($scope.stateT >= $scope.nbMatchs - 1) {
        document.getElementById('arrow-right').classList.add('disabled');
      }
      else {
        document.getElementById('arrow-right').classList.remove('disabled');
      }
      if($scope.stateT === 0) {
        document.getElementById('arrow-left').classList.add('disabled');
      } else {
        document.getElementById('arrow-left').classList.remove('disabled');
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


    /**
    *	idMatch = id of the match
    *	idTeam = id of team who scored goal (in the match array)
    *	idTeamVS = if of team who taked a goal (in the match array)
    **/
    $scope.setGoals = function(idMatch,idTeam,idTeamVS, nbGoal, score) {
      if(nbGoal === -1 && score === -1) {
        // if score'll be negative
        $scope.popup = false;
        if($scope.matchsType === 'firstLeg') {
          if(idTeam === 0) {
            $scope.league.firstLeg[idMatch].b0++;
          } else if(idTeam === 1) {
            $scope.league.firstLeg[idMatch].b1++;
          }
        } else {
          if(idTeam === 0) {
            $scope.league.returnLeg[idMatch].b0++;
          } else if(idTeam === 1) {
            $scope.league.returnLeg[idMatch].b1++;
          }
        }
      } else if(nbGoal === -1) {
        // if score dicrease
        $scope.popup = true;
        $scope.popup_remove = true;
        $scope.popup_add = false;

        $scope.setGoalsWithStatut(idMatch,idTeam,idTeamVS, nbGoal, score,'remove');
      } else if(nbGoal === 1) {
        // if score inscrease
        $scope.popup = true;
        $scope.popup_remove = false;
        $scope.popup_add = true;

        $scope.setGoalsWithStatut(idMatch,idTeam,idTeamVS, nbGoal, score,'add');
      }

      LocalStorage.setLocalStorage('league', Matchs.setTeamsGoal(idMatch,idTeam,idTeamVS, $scope.league, $scope.matchsType, nbGoal));
    };

    $scope.setGoalsWithStatut = function(idMatch,idTeam,idTeamVS, nbGoal, score,statut) {
      $scope.players = [];

      if($scope.matchsType === 'firstLeg') {
        if($scope.league.firstLeg[idMatch][idTeam].playersName.length === 1) {
          $scope.setPlayerGoal($scope.league.firstLeg[idMatch][idTeam].playersName[0],statut);
        }

        for(var i = 0; i < $scope.league.firstLeg[idMatch][idTeam].playersName.length; i++){
          $scope.players.push($scope.league.firstLeg[idMatch][idTeam].playersName[i]);
        }
      } else {
        if($scope.league.returnLeg[idMatch][idTeam].playersName.length == 1) {
          $scope.setPlayerGoal($scope.league.returnLeg[idMatch][idTeam].playersName[0],statut);
        } 

        for(var i = 0; i < $scope.league.returnLeg[idMatch][idTeam].playersName.length; i++){
          $scope.players.push($scope.league.returnLeg[idMatch][idTeam].playersName[i]);
        }
      }
    }

    $scope.setPlayerGoal = function(player,statut){
      LocalStorage.setLocalStorage('teams', Matchs.setPlayerGoal(player, $scope.teams,statut));

      $scope.popup = false;
      $scope.popup_add = false;
      $scope.popup_remove = false;
    };

    $scope.calcPts = function(type) {
      LocalStorage.setLocalStorage('teams', Matchs.setTeamStats(type, $scope.league, $scope.state, $scope.teams));
    };
    
    $scope.init();

  });
