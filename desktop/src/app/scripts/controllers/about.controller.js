'use strict';

angular.module('fifatournament')
    .controller('AboutCtrl', function ($scope) {

        $scope.team = [
        {
            'name': 'V1.0',
            'firstname': '27 Avril 2015',
            'job': '',
            'img': ''
        }
        ];
    })
    .directive('blablabla',function() {
        return  {
            restrict: 'E',
            template : '<div class="version">' +
            '<h1>{{version.version}}</h1>' +
            '<h2>{{version.date}}</h2>' +
            '<p>{{version.comments}}</p>' +
            '</div>',
            link: function () {}
        };
    });