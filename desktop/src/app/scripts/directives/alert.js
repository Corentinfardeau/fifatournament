'use strict';

angular.module('fifatournament')
  .directive('alert', function () {

    return {
      templateUrl: 'app/views/partials/_alert.html',
      restrict: 'E',
      link : function($scope,elem,attrs){
        $scope.alert = false;

        $scope.showPopUp = function() {
          $scope.alert = true;
        }
      }
    };

});