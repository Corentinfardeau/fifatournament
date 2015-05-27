'use strict';

angular.module('fifatournament')

	.controller('MainCtrl', function ($scope, LocalStorage) {
        
        // look in the local storage to see if a tournament has already been created
        if(LocalStorage.getLocalStorage('league') === null){
            $scope.exist = false;
        } else {
            var league = LocalStorage.getLocalStorage('league');
            if(league.returnLeg[league.returnLeg.length-1].played === false){
                $scope.exist = true; 
            }else{
                $scope.exist = false;
            }
            
        }

});