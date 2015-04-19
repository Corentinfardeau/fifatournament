'use strict';

angular.module('fifatournament')

	.controller('LatestMatchsCtrl', function ($scope) {
		
        $scope.league = JSON.parse(localStorage.getItem('league'));
        $scope.latest_match_aller = [];
    
        for(var i = 0; i < $scope.league.aller.length; i++){
            if($scope.league.aller[i].played == true){
                $scope.latest_match_aller.push($scope.league.aller[i]);       
            }   
        }
    
        console.log($scope.latest_match_aller);
    
	})
	.directive('latestmatch',function() {
		return  {
			restrict: 'E',
			template : '<div ng-if="match.played" class="latest-match-card">' +
				'<div class="home">' +
					'<span class="score" style="color: {{match[0].couleur}};">{{match.b0}}</span>' +
					'<span class="name">{{match[0].name}}</span>' +
				'</div>' +
				'<div class="center">' +
					'-' +
					'<span>{{match.state}}</span>' +
				'</div>' +
				'<div class="outdoor">' +
					'<span class="score" style="color: {{match[1].couleur}};">{{match.b1}}</span>' +
					'<span class="name">{{match[1].name}}</span>' +
				'</div>' +
			'</div>',
			link: function ($scope, $element) {}
		}
	});

