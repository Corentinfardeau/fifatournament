'use strict';

angular.module('fifatournament')

	.controller('LatestMatchsCtrl', function ($scope, LocalStorage) {
		
        $scope.league = LocalStorage.getLocalStorage('league');
        $scope.latestMatchFirtsLeg = [];
    
        for(var i = 0; i < $scope.league.firstLeg.length; i++){
            if($scope.league.firstLeg[i].played === true){
                $scope.latestMatchFirtsLeg.push($scope.league.firstLeg[i]);       
            }   
        }
    
	});

