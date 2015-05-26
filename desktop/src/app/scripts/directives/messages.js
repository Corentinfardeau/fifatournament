'use strict';

angular.module('fifatournament')
  .directive('messages', function () {
    return {
      templateUrl: 'app/views/partials/_messages.html',
      restrict: 'E',
      replace: true,
      link: function(scope,elem,attr) {
        elem[0].innerHTML = attr.inner;
      }
    };
});