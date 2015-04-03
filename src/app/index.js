'use strict';

angular.module('fifatournament', ['ngRoute'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        templateUrl: 'app/404/404.html',
        controller: '404Ctrl'
      });
  })
;
