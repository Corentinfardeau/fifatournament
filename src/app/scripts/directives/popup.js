'use strict';

angular.module('fifatournament')
  .directive('popup', function () {

    return {
      templateUrl: 'app/views/partials/_popup.html',
      restrict: 'E',
      scope: {
        txt: '&',
        params: '&'
      },
      link : function(scope){
        console.log(scope);
      }
    };

});