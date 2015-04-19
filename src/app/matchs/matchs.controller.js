'use strict';

angular.module('fifatournament')
	.controller('MatchsCtrl', function ($scope,$rootScope) {
		
        $rootScope.state = 	JSON.parse(localStorage.getItem('state'));
		$scope.stateT = 0;
    
		var translateX = (window.innerWidth / 2) - 296;
		var wrapper = document.getElementById('matchs-wrapper');
		var start_btn = document.getElementById('start-btn');
		var stop_btn = document.getElementById('stop-btn');
		var matchs = document.getElementsByClassName('match-card');
		var live = false;

		$scope.league = JSON.parse(localStorage.getItem('league'));
		$scope.teams = JSON.parse(localStorage.getItem('teams'));

		$scope.disableCard = function() {
			if($scope.nbMatchs > $scope.league.aller.length) {
				$scope.matchsType = "Aller";
			} else {
				$scope.matchsType = "Retour";
			}

			if($rootScope.state >= $scope.league.aller.length) {
				$rootScope.state = 0;
				localStorage.setItem('state', JSON.stringify($rootScope.state));
			}
		}

		$scope.clickOnCard = function(id) {
			if($rootScope.state - id > 0) {
				for(var i = 0; i < $rootScope.state - id; i++) {
					$scope.translateL();
				}
			} else if ($rootScope.state - id < 0){
				for(var i = 0; i < id - $rootScope.state; i++) {
					$scope.translateR();
				}
			} else { return; }
		}

		$scope.calcMatchs = function() {
			$scope.nbMatchs = 0;
			for(var i = 0, l = $scope.league.aller.length; i < l; i++) {
				if(!$scope.league.aller[i].played) {
					$scope.nbMatchs++
				}
			}
			for(var i = 0, l = $scope.league.retour.length; i < l; i++) {
				if(!$scope.league.retour[i].played) {
					$scope.nbMatchs++
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
            
			live = false;
            
			if($scope.matchsType == "Aller") {
				$scope.league.aller[$rootScope.state].played = true;
				$scope.league.aller[$rootScope.state].date = Date.now() / 1000;
			} else {
				$scope.league.retour[$rootScope.state].played = true;
				$scope.league.retour[$rootScope.state].date = Date.now() / 1000;
			}
			if($scope.matchsType == "Aller") {
				$scope.calcPts("aller");
			} else {
				$scope.calcPts("retour");
			}
			$rootScope.state++;
            localStorage.setItem('state', JSON.stringify($rootScope.state));
			localStorage.setItem('league', JSON.stringify($scope.league));
			$scope.calcMatchs();
			$scope.showArrows();
			$scope.disableCard();
		}

		$scope.translateR = function() {
			if($scope.stateT >= $scope.nbMatchs - 1 || live) return;
			// $rootScope.state++;
			$scope.stateT++;
			$scope.showArrows();
			translateX -= 499.5;
			wrapper.style.webkitTransform = 'translate3D(' + translateX + 'px,0,0)';

		}
		$scope.translateL = function() {
			if($scope.stateT === 0 || live) return;
			// $rootScope.state--;
			$scope.stateT--;
			$scope.showArrows();
			translateX += 499.5;
			wrapper.style.webkitTransform = 'translate3D(' + translateX + 'px,0,0)';
		}

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
			if($scope.stateT < $scope.nbMatchs - 1 && $scope.stateT != 0) {
				document.getElementById('arrow-right').classList.remove('disabled');
				document.getElementById('arrow-left').classList.remove('disabled');
			}
		}

		$scope.setButs = function(idMatch,idTeam,idTeamVS) {
			if($scope.matchsType == "Aller") {
				$scope.league.aller[idMatch][idTeam].stats.bp++;
				$scope.league.aller[idMatch][idTeamVS].stats.bc++;
			} else {
				$scope.league.retour[idMatch][idTeam].stats.bp++;
				$scope.league.retour[idMatch][idTeamVS].stats.bc++;
			}

			localStorage.setItem('league', JSON.stringify($scope.league));
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
					console.log($scope.teams[i].stats);
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
					console.log($scope.teams[i].stats);
				}
			}
			localStorage.setItem('teams', JSON.stringify($scope.teams));
		}

		$scope.calcMatchs();
		$scope.showArrows();
		$scope.disableCard();
	})
	.directive('matchs',function() {
		return  {
			restrict: 'E',
			template : '<div class="match-card" ng-class="{\'disabled\': state != $index || match.state != matchsType}" ng-if="!match.played" ng-click="clickOnCard($index)">' +
				'<div class="home">' + 
					'<span class="score" style="color: {{match[0].couleur}};">{{match.b0}}</span>' +
					'<span class="name">{{match[0].name}}</span>' +
					'<span class="btn" ng-click="match.b0 = match.b0 + 1; setButs($index, 0,1)" style="background-color: {{match[0].couleur}};">But</span>' +
				'</div>' +
				'<div class="center">' +
					'-' +
					'<span>{{match.state}}</span>' +
				'</div>' +
				'<div class="outdoor">' +
					'<span class="score" style="color: {{match[1].couleur}};">{{match.b1}}</span>' +
					'<span class="name">{{match[1].name}}</span>' +
					'<span class="btn" ng-click="match.b1 = match.b1 + 1; setButs($index,1,0)" style="background-color: {{match[1].couleur}};">But</span>' +
				'</div>' +
			'</div>',
			link: function ($scope, $element) {}
		}
	});

