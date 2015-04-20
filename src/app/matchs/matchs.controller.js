'use strict';

angular.module('fifatournament')
	.controller('MatchsCtrl', function ($scope,$rootScope,$location, $timeout) {

        $scope.whoarewe = false;
        $scope.whoAreWe = function(what) {
            if(what == 'show') {
                $scope.whoarewe = true;
            } else if(what == 'hide') {
                $scope.whoarewe = false;
            }
        }
		
        $rootScope.state = 	JSON.parse(localStorage.getItem('state'));
		$scope.stateT = 0;
    
		var translateX = (window.innerWidth / 2) - 296;
		var wrapper = document.getElementById('matchs-wrapper');
		var start_btn = document.getElementById('start-btn');
		var stop_btn = document.getElementById('stop-btn');
		var matchs = document.getElementsByClassName('match-card');
		var live = false;

        $scope.popup = false;
		$scope.league = JSON.parse(localStorage.getItem('league'));
		$scope.teams = JSON.parse(localStorage.getItem('teams'));

		$scope.setWidthWrapper = function() {
			wrapper.style.width = ($scope.nbMatchs + 1) * (496) + 'px';

			wrapper.style.webkitTransform = 'translate3d(calc(' + 50 / ((($scope.nbMatchs + 1) * (496)) / window.innerWidth) + '% - 296px),0,0)';
			wrapper.style.MozTransform = 'translate3d(calc(' + 50 / ((($scope.nbMatchs + 1) * (496)) / window.innerWidth) + '% - 296px),0,0)';
			wrapper.style.msTransform = 'translate3d(calc(' + 50 / ((($scope.nbMatchs + 1) * (496)) / window.innerWidth) + '% - 296px),0,0)';
			wrapper.style.OTransform = 'translate3d(calc(' + 50 / ((($scope.nbMatchs + 1) * (496)) / window.innerWidth) + '% - 296px),0,0)';
			wrapper.style.transform = 'translate3d(calc(' + 50 / ((($scope.nbMatchs + 1) * (496)) / window.innerWidth) + '% - 296px),0,0)';
		}
        
        $scope.detect_end_game = function(){
            var cpt = 0;
            for(var i =0; i < $scope.league.retour.length; i++){
                if($scope.league.retour[i].played == true){
                    if(cpt == $scope.league.retour.length-1){
                        $location.path('/end'); 
                    }else{
                        cpt++;  
                    }
                }else{
                    return false;
                }

            }   
        }
    
		$scope.disableCard = function() {
			if($rootScope.nbMatchs > $scope.league.aller.length) {
				$scope.matchsType = "Aller";
			} else {
				$scope.matchsType = "Retour";
			}

			if($rootScope.state >= $scope.league.aller.length) {
				$rootScope.state = 0;
				localStorage.setItem('state', JSON.stringify($rootScope.state));
			}
		}
        
		$scope.calcMatchs = function() {
			$rootScope.nbMatchs = 0;
			for(var i = 0, l = $scope.league.aller.length; i < l; i++) {
				if(!$scope.league.aller[i].played) {
					$rootScope.nbMatchs++
				}
			}
			for(var i = 0, l = $scope.league.retour.length; i < l; i++) {
				if(!$scope.league.retour[i].played) {
					$rootScope.nbMatchs++
				}
			}
		}

		$scope.start_match = function() {
			for(var i = 0, l = matchs.length; i < l; i++) {
				matchs[i].classList.add('disabled');
				matchs[i].classList.remove('active');
			}
			matchs[$scope.stateT].classList.remove('disabled');
			matchs[$scope.stateT].classList.add('active');
			document.getElementById('title').classList.add('active');
			document.getElementById('btn-wrapper').classList.add('active');
			live = true;
		}
        
		$scope.stop_match = function() {    
            
			document.getElementById('title').classList.remove('active');
			document.getElementById('btn-wrapper').classList.remove('active');
            
            matchs[$scope.stateT].classList.add('leave');

            $timeout(function() {
            	if($scope.matchsType == "Aller") {
					$scope.league.aller[$rootScope.state].played = true;
					$scope.league.aller[$rootScope.state].date = Date.now() / 1000;
	            } else {
					$scope.league.retour[$rootScope.state].played = true;
					$scope.league.retour[$rootScope.state].date = Date.now() / 1000;
	            }
	            
				live = false;
	            
				if($scope.matchsType == "Aller") {
					$scope.calcPts("aller");
				} else {
					$scope.calcPts("retour");
				}
	            
				$rootScope.state++;
	            
	            localStorage.setItem('league', JSON.stringify($scope.league));
	            localStorage.setItem('state', JSON.stringify($rootScope.state));
	            
	            $scope.detect_end_game();
	            
				$scope.calcMatchs();
				$scope.showArrows();
				$scope.disableCard();
            },500);
		}
        
		$scope.translateR = function() {
			if($scope.stateT >= $rootScope.nbMatchs - 1 || live) return;
			$scope.stateT++;
			$scope.showArrows();
			translateX -= 496;
			wrapper.style.webkitTransform = 'translate3D(' + translateX + 'px,0,0)';
			wrapper.style.MozTransform = 'translate3D(' + translateX + 'px,0,0)';
			wrapper.style.msTransform = 'translate3D(' + translateX + 'px,0,0)';
			wrapper.style.OTransform = 'translate3D(' + translateX + 'px,0,0)';
			wrapper.style.transform = 'translate3D(' + translateX + 'px,0,0)';

		}
        
		$scope.translateL = function() {
			if($scope.stateT === 0 || live) return;
			$scope.stateT--;
			$scope.showArrows();
			translateX += 496;
			wrapper.style.webkitTransform = 'translate3D(' + translateX + 'px,0,0)';
			wrapper.style.MozTransform = 'translate3D(' + translateX + 'px,0,0)';
			wrapper.style.msTransform = 'translate3D(' + translateX + 'px,0,0)';
			wrapper.style.OTransform = 'translate3D(' + translateX + 'px,0,0)';
			wrapper.style.transform = 'translate3D(' + translateX + 'px,0,0)';
		}

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
			if($scope.stateT < $rootScope.nbMatchs - 1 && $scope.stateT != 0) {
				document.getElementById('arrow-right').classList.remove('disabled');
				document.getElementById('arrow-left').classList.remove('disabled');
			}
		}

		/**
		*	idMatch = id of the match
		*	idTeam = id of team who scored goal (in the match array)
		*	idTeamVS = if of team who taked a goal (in the match array)
		**/
		$scope.set_buts = function(idMatch,idTeam,idTeamVS) {
			$scope.popup = true;
            $scope.players = [];            
            
			if($scope.matchsType == "Aller") {
				if($scope.league.aller[idMatch][idTeam].players_name.length == 1) {
					$scope.popup = false;
					$scope.set_player_goal($scope.league.aller[idMatch][idTeam].players_name[0]);
				} 
				for(var i = 0; i < $scope.league.aller[idMatch][idTeam].players_name.length; i++){
					$scope.players.push($scope.league.aller[idMatch][idTeam].players_name[i]);
				}

				$scope.league.aller[idMatch][idTeam].stats.bp++;
				$scope.league.aller[idMatch][idTeamVS].stats.bc++;
			} else {
				if($scope.league.retour[idMatch][idTeam].players_name.length == 1) {
					$scope.popup = false;
					$scope.set_player_goal($scope.league.retour[idMatch][idTeam].players_name[0]);
				} 
				for(var i = 0; i < $scope.league.retour[idMatch][idTeam].players_name.length; i++){
					$scope.players.push($scope.league.retour[idMatch][idTeam].players_name[i]);
				}
				
				$scope.league.retour[idMatch][idTeam].stats.bp++;
				$scope.league.retour[idMatch][idTeamVS].stats.bc++;
			}

			localStorage.setItem('league', JSON.stringify($scope.league));
		}

        $scope.set_player_goal = function(player){
            var nb_goal = player.nb_goal+1;
            for(var i = 0; i < $scope.teams.length; i++ ){
                for(var j = 0; j < $scope.teams[i].players_name.length; j++){
                    if($scope.teams[i].players_name[j].name == player.name){
                        $scope.teams[i].players_name[j].nb_goal += nb_goal;
                    }  
                }
            }
            
            localStorage.setItem('teams', JSON.stringify($scope.teams));
            $scope.popup = false;
        }

		$scope.calcPts = function(type) {
			var name0 = $scope.league[type][$rootScope.state][0].name;
			var name1 = $scope.league[type][$rootScope.state][1].name;
			var b0 = $scope.league[type][$rootScope.state].b0;
			var b1 = $scope.league[type][$rootScope.state].b1;

			for(var i = 0; i < $scope.teams.length; i++) {
				if($scope.teams[i].name == name0) {
					$scope.teams[i].stats.bp += b0;
					$scope.teams[i].stats.bc += b1;
					$scope.teams[i].stats.db += b0 - b1;
					$scope.teams[i].stats.played++;

					if(b0 > b1) {
						$scope.teams[i].stats.victory++;
						$scope.teams[i].stats.pts += 3;
					} else if(b0 < b1) {
						$scope.teams[i].stats.defeat++;
					} else {
						$scope.teams[i].stats.draw++;
						$scope.teams[i].stats.pts += 1;
					}
				}
				else if($scope.teams[i].name == name1) {
					$scope.teams[i].stats.bp += b1;
					$scope.teams[i].stats.bc += b0;
					$scope.teams[i].stats.db += b1 - b0;
					$scope.teams[i].stats.played++;

					if(b1 > b0) {
						$scope.teams[i].stats.victory++;
						$scope.teams[i].stats.pts += 3;
					} else if(b1 < b0) {
						$scope.teams[i].stats.defeat++;
					} else {
						$scope.teams[i].stats.draw++;
						$scope.teams[i].stats.pts += 1;
					}
				}
			}
            
			localStorage.setItem('teams', JSON.stringify($scope.teams));
		}

		$scope.calcMatchs();
		$scope.showArrows();
		$scope.disableCard();
        $scope.detect_end_game();
        $scope.setWidthWrapper();
	})
	.directive('matchs',function() {
		return  {
			restrict: 'E',
			template : '<div class="match-card" ng-class="{\'disabled\': state != $index || match.state != matchsType}" ng-if="!match.played" ng-click="clickOnCard($index)">' +
				'<div class="home">' + 
					'<span class="score" style="color: {{match[0].couleur}};">{{match.b0}}</span>' +
					'<span class="name">{{match[0].name}}</span>' +
					'<span class="btn" ng-click="match.b0 = match.b0 + 1; set_buts($index, 0,1)" style="background-color: {{match[0].couleur}};">But</span>' +
				'</div>' +
				'<div class="center">' +
					'-' +
					'<span>{{match.state}}</span>' +
				'</div>' +
				'<div class="outdoor">' +
					'<span class="score" style="color: {{match[1].couleur}};">{{match.b1}}</span>' +
					'<span class="name">{{match[1].name}}</span>' +
					'<span class="btn" ng-click="match.b1 = match.b1 + 1; set_buts($index,1,0)" style="background-color: {{match[1].couleur}};">But</span>' +
                    '<span></span>' +
				'</div>' +
			'</div>',
			link: function ($scope, $element) {}
		}
	});

