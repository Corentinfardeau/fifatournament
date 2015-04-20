'use strict';

angular.module('fifatournament')

	.controller('MainCtrl', function ($scope) {
		// hello every body, nice to meet you

        $scope.whoarewe = false;
        $scope.whoAreWe = function(what) {
            if(what == 'show') {
                $scope.whoarewe = true;
            } else if(what == 'hide') {
                $scope.whoarewe = false;
            }
        }
		
	});