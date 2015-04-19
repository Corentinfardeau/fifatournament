'use strict';

angular.module('fifatournament')
	.controller('ResultsCtrl', function ($scope) {
    
        $scope.teams = JSON.parse(localStorage.getItem('teams'));
        $scope.league = JSON.parse(localStorage.getItem('league'));
        
        $scope.game_ended = false;
    
        $scope.detect_end_game = function(){
            var cpt = 0;
            for(var i =0; i < $scope.league.retour.length; i++){
                if($scope.league.retour[i].played == true){
                    if(cpt == $scope.league.retour.length-1){
                        $scope.game_ended = true;
                        $scope.calc_stats();
                    }else{
                        cpt++;  
                    }
                }else{
                    return false;
                }

            }   
        }
        
        $scope.calc_stats = function(){
            
            $scope.best_attack = []; 
            $scope.best_defence = []; 
            
            for(var i = 0; i < $scope.teams.length; i++){
                $scope.best_attack.push($scope.teams[i]);
                $scope.best_defence.push($scope.teams[i]);
            }
            
            for(var i = 0; i < $scope.best_attack.length-1; i++){
                
                if($scope.best_attack[i].stats.bp<$scope.best_attack[i+1].stats.bp){
                    var temporary = $scope.best_attack[i+1];
                    $scope.best_attack[i+1] = $scope.best_attack[i];
                    $scope.best_attack[i] = temporary;
                }
                
                if($scope.best_defence[i].stats.bc<$scope.best_defence[i+1].stats.bc){
                    var temporary = $scope.best_defence[i+1];
                    $scope.best_defence[i+1] = $scope.best_defence[i];
                    $scope.best_defence[i] = temporary;
                }
            }
                
        }
        
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
        $scope.detect_end_game();
	
    })
    .directive('results',function() {
            return  {
                restrict: 'E',
                template :  '<div class="tr">' +
                                '<div class="td"><i class="fa fa-fw fa-circle" style="color: {{team.couleur}};"></i></div>'+
                                '<div class="td strong">{{team.name}}</div>' +
                                '<div class="td">{{team.stats.played}}</div>' +
                                '<div class="td">{{team.stats.victory}}</div>' +
                                '<div class="td">{{team.stats.draw}}</div>' +
                                '<div class="td">{{team.stats.defeat}}</div>' +
                                '<div class="td">{{team.stats.bp}}</div>' +
                                '<div class="td">{{team.stats.bc}}</div>' +
                                '<div class="td">{{team.stats.db}}</div>' +
                                '<div class="td strong">{{team.stats.pts}}</div>' +
                            '</div>',
                
                link: function ($scope, $element) {}
            }
    });

