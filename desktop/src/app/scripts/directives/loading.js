'use strict';

angular.module('fifatournament')
  .directive('loading', function () {
    return {
            templateUrl: 'app/views/partials/_loading.html',
            restrict: 'E',
    };
});