'use strict';

angular.module('fifatournament')

	.controller('EndCtrl', function ($scope) {

        $scope.whoarewe = false;
        $scope.whoAreWe = function(what) {
            if(what == 'show') {
                $scope.whoarewe = true;
            } else if(what == 'hide') {
                $scope.whoarewe = false;
            }
        }
    
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

        //Shuffle an array
        $scope.shuffle = function(array) {
            var currentIndex = array.length, temporaryValue, randomIndex ;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        } 

        /**
        *   renvoie un gage parmi le tableau
        **/
        var pledge = localStorage.getItem('pledge');
        $scope.pledges = ["sucer son pote de droite","sucer son pote de droite ET de gauche","payer sa tournée","payer son cul","lécher ses tétons","vendre son corps","rentrer chez soi. bizz"];
        if(pledge == 'none') {
            $scope.pledge = $scope.shuffle($scope.pledges)[0];
            localStorage.setItem('pledge', $scope.pledge);
        } else {
            $scope.pledge = pledge;
        }
        
        $scope.ordered_results();
        $scope.victory = $scope.teams[0];
        $scope.biggest_shit_in_the_world = $scope.teams[$scope.teams.length-1];
                
	});