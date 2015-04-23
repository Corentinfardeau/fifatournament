'use strict';

angular.module('fifatournament')
	.directive('whoweare', function () {
		return {
            templateUrl: 'app/views/partials/_whoWeAre.html',
            restrict: 'E',
            link : function($scope){

                $scope.whoarewe = false;
                $scope.whoAreWe = function(what) {
                    if(what === 'show') {
                        $scope.whoarewe = true;
                    } else if(what === 'hide') {
                        $scope.whoarewe = false;
                    }
                };
            }
		};
});
