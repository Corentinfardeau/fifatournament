'use strict';

angular.module('fifatournament')
	.controller('ResultsCtrl', function ($scope,$rootScope, LocalStorage) {
        
        $scope.teams = LocalStorage.getLocalStorage('teams');
        $scope.league = LocalStorage.getLocalStorage('league');
        
        $scope.gameEnded = false;
    
        $scope.detectEndGame = function(){
            var cpt = 0;
            for(var i =0; i < $scope.league.retour.length; i++){
                if($scope.league.retour[i].played == true){
                    if(cpt == $scope.league.retour.length-1){
                        $scope.gameEnded = true;
                        $scope.calcStats();
                    }else{
                        cpt++;  
                    }
                }else{
                    return false;
                }
            }   
        }
        
        $scope.calcStats = function(){
            
            $scope.bestAttack = []; 
            $scope.bestDefence = []; 
            $scope.bestScorer = [];
            $scope.worstScorer = [];
            
            for(var i = 0; i < $scope.teams.length; i++){
                $scope.bestAttack.push($scope.teams[i]);
                $scope.bestDefence.push($scope.teams[i]);

                for(var j = 0; j < $scope.teams[i].playersName.length; j++) {
                    $scope.bestScorer.push($scope.teams[i].playersName[j]);
                }
            }

            for(var i = 0; i < $scope.bestAttack.length-1; i++){
                
                if($scope.bestAttack[i].stats.gf < $scope.bestAttack[i+1].stats.gf){
                    var temporary = $scope.bestAttack[i+1];
                    $scope.bestAttack[i+1] = $scope.bestAttack[i];
                    $scope.bestAttack[i] = temporary;
                }
                
                if($scope.bestdefence[i].stats.ga < $scope.bestDefence[i+1].stats.ga){
                    var temporary = $scope.bestDefence[i+1];
                    $scope.bestDefence[i+1] = $scope.bestDefence[i];
                    $scope.bestDefence[i] = temporary;
                }
            }
            
            $scope.bestDefence = $scope.bestDefence.reverse();

            for(var i = 0; i < $scope.bestScorer.length - 1; i++) {
                if($scope.bestScorer[i].nbGoal < $scope.bestScorer[i + 1].nbGoal) {
                    var temporary = $scope.bestScorer[i + 1];
                    $scope.bestScorer[i + 1] = $scope.bestScorer[i];
                    $scope.bestScorer[i] = temporary;
                }
            }
            $scope.worstScorer = $scope.bestScorer[$scope.bestScorer.length - 1];
        }
        
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
                if($scope.teams[j].stats.pts == $scope.teams[j+1].stats.pts){
                    if($scope.teams[j].stats.gd<$scope.teams[j+1].stats.gd){
                        var temporary = $scope.teams[j+1];
                        $scope.teams[j+1] = $scope.teams[j];
                        $scope.teams[j] = temporary;
                    }  
                }
            }
        }
        
        $scope.orderedResults();
        $scope.detectEndGame();
	
    });

