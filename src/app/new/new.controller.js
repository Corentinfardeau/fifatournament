'use strict';

angular.module('fifatournament')

	.controller('NewCtrl', function ($scope) {
    
        
        var maxPlayer = 7;
        var minPlayer = 2;
        $scope.players = [1,2]; 

        $scope.incrementPlayer = function() {
            
            if ($scope.countPlayer >= maxPlayer) { return; }
            
            $scope.countPlayer++;
            
            $scope.players = []; 
            for( var i = 0 ; i < $scope.countPlayer; i++){
                $scope.players.push(i+1);
            }

        };
    
        $scope.decrementPlayer = function() {
            if ($scope.countPlayer <= minPlayer) { return; }
            $scope.countPlayer--;
            
            $scope.players = []; 
            
            for( var i = 0 ; i < $scope.countPlayer; i++){
                $scope.players.push(i+1);
            }
        };
    
        $scope.incrementPlayerByTeam = function() {
            if ($scope.countPlayerByTeam >= $scope.countPlayer-1) { return; }
            $scope.countPlayerByTeam++;
        };
    
        $scope.decrementPlayerByTeam = function() {
            if ($scope.countPlayerByTeam <= minPlayer) { return; }
            $scope.countPlayerByTeam--;
        };
    
		$scope.createInput = function($event) {
            
            
        }
    
        $scope.create = function(){
            alert("Crée");
        };

	});

