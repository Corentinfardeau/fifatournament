'use strict';

angular.module('fifatournament')

	.controller('EndCtrl', function ($scope) {
    
        $scope.teams = JSON.parse(localStorage.getItem('teams'));
        
        $scope.ordered_results = function(){
            
            var tab_ordered = false;
            var size = $scope.teams.length;
            
            while(!tab_ordered){
                
                tab_ordered = true;
                
                for(var i = 0 ; i < size-1; i++){
                    if($scope.teams[i].stats.pts<$scope.teams[i+1].stats.pts){
                        var temporary = $scope.teams[i+1];
                        $scope.teams[i+1] = $scope.teams[i];
                        $scope.teams[i] = temporary;
                        tab_ordered = false;
                    }       
                }
                
                size--;
            }
            
            for(var j = 0 ; j < $scope.teams.length-1; j ++){
                if($scope.teams[j].stats.pts == $scope.teams[j+1].stats.pts){
                    if($scope.teams[j].stats.db<$scope.teams[j+1].stats.db){
                        var temporary = $scope.teams[j+1];
                        $scope.teams[j+1] = $scope.teams[j];
                        $scope.teams[j] = temporary;
                    }  
                }
            }
        }
        
        $scope.ordered_results();
        $scope.victory = $scope.teams[0];
        $scope.biggest_shit_in_the_world = $scope.teams[$scope.teams.length-1];
                
	});