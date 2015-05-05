'use strict';

angular.module('fifatournament')
  .directive('popup', function () {

    return {
      templateUrl: 'app/views/partials/_popup.html',
      restrict: 'E',
      link : function($scope){

      }
    };

});