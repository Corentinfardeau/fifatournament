'use strict';

angular.module('fifatournament')

	.controller('EndCtrl', function ($scope, LocalStorage, Shuffle, JSON) {
    
        $scope.teams = LocalStorage.getLocalStorage('teams');
        
        $scope.orderedResults = function(){
            
            var tabOrdered = false;
            var size = $scope.teams.length;
            
            while(!tabOrdered){
                
                tabOrdered = true;
                
                for(var i = 0 ; i < size-1; i++){
                    if($scope.teams[i].stats.pts<$scope.teams[i+1].stats.pts){
                        var temporary = $scope.teams[i+1];
                        $scope.teams[i+1] = $scope.teams[i];
                        $scope.teams[i] = temporary;
                        tabOrdered = false;
                    }       
                }
                
                size--;
            }
            
            for(var j = 0 ; j < $scope.teams.length-1; j ++){
                if($scope.teams[j].stats.pts === $scope.teams[j+1].stats.pts){
                    if($scope.teams[j].stats.db<$scope.teams[j+1].stats.db){
                        temporary = $scope.teams[j+1];
                        $scope.teams[j+1] = $scope.teams[j];
                        $scope.teams[j] = temporary;
                    }  
                }
            }
        };

        JSON.get('../assets/JSON/pledges.json').then(function(success) {
            if(LocalStorage.getLocalStorage('pledge') == 'none') {
                $scope.pledge = Shuffle.shuffleArray(success.data.pledge);
                LocalStorage.setLocalStorage('pledge',$scope.pledge);
            } else {
                $scope.pledge = LocalStorage.getLocalStorage('pledge');
            }
        }, function(error) {
            console.log(error);
        });
        
        
        $scope.orderedResults();
        $scope.victory = $scope.teams[0];
        $scope.biggestShitInTheWorld = $scope.teams[$scope.teams.length-1];
	});