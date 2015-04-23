'use strict';

angular.module('fifatournament')
	.controller('MatchsCtrl', function ($scope,$rootScope,$location, $timeout, LocalStorage, Matchs) {

        $rootScope.state = 	LocalStorage.getLocalStorage('state');
        $scope.league = LocalStorage.getLocalStorage('league');
		$scope.teams = LocalStorage.getLocalStorage('teams');
    
		$scope.stateT = 0;
        $scope.popup = false;
    
		var translateX = (window.innerWidth / 2) - 296;
		var wrapper = document.getElementById('matchs-wrapper');
		var matchs = document.getElementsByClassName('match-card');
		var live = false;

		$scope.setWidthWrapper = function() {
			wrapper.style.width = ($scope.nbMatchs + 1) * (496) + 'px';
			wrapper.style.webkitTransform = 'translate3d(calc(' + 50 / ((($scope.nbMatchs + 1) * (496)) / window.innerWidth) + '% - 296px),0,0)';
			wrapper.style.MozTransform = 'translate3d(calc(' + 50 / ((($scope.nbMatchs + 1) * (496)) / window.innerWidth) + '% - 296px),0,0)';
			wrapper.style.msTransform = 'translate3d(calc(' + 50 / ((($scope.nbMatchs + 1) * (496)) / window.innerWidth) + '% - 296px),0,0)';
			wrapper.style.OTransform = 'translate3d(calc(' + 50 / ((($scope.nbMatchs + 1) * (496)) / window.innerWidth) + '% - 296px),0,0)';
			wrapper.style.transform = 'translate3d(calc(' + 50 / ((($scope.nbMatchs + 1) * (496)) / window.innerWidth) + '% - 296px),0,0)';
		};
        
        $scope.detectEndGame = function(){
            var cpt = 0;
            for(var i =0; i < $scope.league.returnLeg.length; i++){
                if($scope.league.returnLeg[i].played === true){
                    if(cpt === $scope.league.returnLeg.length-1){
                        $location.path('/end'); 
                    }else{
                        cpt++;  
                    }
                }else{
                    return false;
                }

            }   
        };
    
		$scope.disableCard = function() {
			if($rootScope.nbMatchs > $scope.league.firstLeg.length) {
				$scope.matchsType = 'firstLeg';
			} else {
				$scope.matchsType = 'returnLeg';
			}

			if($rootScope.state >= $scope.league.firstLeg.length) {
				$rootScope.state = 0;
                LocalStorage.setLocalStorage('state', $rootScope.state);
			}
		};
        
		$scope.calcMatchs = function() {
			$rootScope.nbMatchs = 0;
			for(var i = 0; i < $scope.league.firstLeg.length; i++) {
				if(!$scope.league.firstLeg[i].played) {
					$rootScope.nbMatchs++
				}
			}
			for(var j = 0; j < $scope.league.returnLeg.length; j++) {
				if(!$scope.league.returnLeg[j].played) {
					$rootScope.nbMatchs++
				}
			}
		};

		$scope.startMatch = function() {
			for(var i = 0, l = matchs.length; i < l; i++) {
				matchs[i].classList.add('disabled');
				matchs[i].classList.remove('active');
			}
			matchs[$scope.stateT].classList.remove('disabled');
			matchs[$scope.stateT].classList.add('active');
			document.getElementById('title').classList.add('active');
			document.getElementById('btn-wrapper').classList.add('active');
			live = true;
		};
        
		$scope.stopMatch = function() {    
            
			document.getElementById('title').classList.remove('active');
			document.getElementById('btn-wrapper').classList.remove('active');
            
            matchs[$scope.stateT].classList.add('leave');

            $timeout(function() {
            	if($scope.matchsType === 'firstLeg') {
					$scope.league.firstLeg[$rootScope.state].played = true;
					$scope.league.firstLeg[$rootScope.state].date = Date.now() / 1000;
	            } else {
					$scope.league.returnLeg[$rootScope.state].played = true;
					$scope.league.returnLeg[$rootScope.state].date = Date.now() / 1000;
	            }
	            
				live = false;
	            
				if($scope.matchsType === 'firstLeg') {
					$scope.calcPts('firstLeg');
				} else {
					$scope.calcPts('returnLeg');
				}
	            
				$rootScope.state++;
	            
                LocalStorage.setLocalStorage('league', $scope.league);
                LocalStorage.setLocalStorage('state', $rootScope.state);
	            
	            $scope.detectEndGame();
	            
				$scope.calcMatchs();
				$scope.showArrows();
				$scope.disableCard();
                
            },500);
		};
        
		$scope.translateR = function() {
			if($scope.stateT >= $rootScope.nbMatchs - 1 || live){return};
			$scope.stateT++;
			$scope.showArrows();
			translateX -= 496;
			wrapper.style.webkitTransform = 'translate3D(' + translateX + 'px,0,0)';
			wrapper.style.MozTransform = 'translate3D(' + translateX + 'px,0,0)';
			wrapper.style.msTransform = 'translate3D(' + translateX + 'px,0,0)';
			wrapper.style.OTransform = 'translate3D(' + translateX + 'px,0,0)';
			wrapper.style.transform = 'translate3D(' + translateX + 'px,0,0)';

		};
        
		$scope.translateL = function() {
			if($scope.stateT === 0 || live){return};
			$scope.stateT--;
			$scope.showArrows();
			translateX += 496;
			wrapper.style.webkitTransform = 'translate3D(' + translateX + 'px,0,0)';
			wrapper.style.MozTransform = 'translate3D(' + translateX + 'px,0,0)';
			wrapper.style.msTransform = 'translate3D(' + translateX + 'px,0,0)';
			wrapper.style.OTransform = 'translate3D(' + translateX + 'px,0,0)';
			wrapper.style.transform = 'translate3D(' + translateX + 'px,0,0)';
		};

		$scope.showArrows = function() {
			if($scope.stateT >= $rootScope.nbMatchs - 1) {
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
			if($scope.stateT < $rootScope.nbMatchs - 1 && $scope.stateT !== 0) {
				document.getElementById('arrow-right').classList.remove('disabled');
				document.getElementById('arrow-left').classList.remove('disabled');
			}
		};

		/**
		*	idMatch = id of the match
		*	idTeam = id of team who scored goal (in the match array)
		*	idTeamVS = if of team who taked a goal (in the match array)
		**/
        
		$scope.setGoals = function(idMatch,idTeam,idTeamVS) {
            
			$scope.popup = true;
            $scope.players = [];            
            
			if($scope.matchsType === 'firstLeg') {
                
				if($scope.league.firstLeg[idMatch][idTeam].playersName.length === 1) {
					$scope.popup = false;
					$scope.setPlayerGoal($scope.league.firstLeg[idMatch][idTeam].playersName[0]);
				}
                
				for(var i = 0; i < $scope.league.firstLeg[idMatch][idTeam].playersName.length; i++){
					$scope.players.push($scope.league.firstLeg[idMatch][idTeam].playersName[i]);
				}
                
			} else {
				if($scope.league.returnLeg[idMatch][idTeam].playersName.length == 1) {
					$scope.popup = false;
					$scope.setPlayerGoal($scope.league.returnLeg[idMatch][idTeam].playersName[0]);
				} 
				for(var i = 0; i < $scope.league.returnLeg[idMatch][idTeam].playersName.length; i++){
					$scope.players.push($scope.league.returnLeg[idMatch][idTeam].playersName[i]);
				}	
			}
            
            LocalStorage.setLocalStorage('league', Matchs.setTeamsGoal(idMatch,idTeam,idTeamVS, $scope.league, $scope.matchsType));
		};

        $scope.setPlayerGoal = function(player){
                
            LocalStorage.setLocalStorage('teams', Matchs.setPlayerGoal(player, $scope.teams));
            $scope.popup = false;
            
        };

		$scope.calcPts = function(type) {
            
            LocalStorage.setLocalStorage('teams', Matchs.setTeamStats(type, $scope.league, $rootScope.state, $scope.teams));
            
		};

		$scope.calcMatchs();
		$scope.showArrows();
		$scope.disableCard();
        $scope.detectEndGame();
        $scope.setWidthWrapper();
	});

