'use strict';

angular.module('fifatournament')

	.controller('LatestMatchsCtrl', function ($scope, LocalStorage) {
		
        $scope.league = LocalStorage.getLocalStorage('league');
        $scope.latestMatchFirtsLeg = [];
    
        for(var i = 0; i < $scope.league.aller.length; i++){
            if($scope.league.aller[i].played === true){
                $scope.latestMatchFirtsLeg.push($scope.league.aller[i]);       
            }   
        }
    
	});

