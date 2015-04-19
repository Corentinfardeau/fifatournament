'use strict';

angular.module('fifatournament')
	.controller('ResultsCtrl', function ($scope) {
        $scope.teams = JSON.parse(localStorage.getItem('teams'));
        console.log($scope.teams);
	})
    .directive('results',function() {
            return  {
                restrict: 'E',
                template :  '<div class="tr">' +
                                '<div class="td"><i class="fa fa-fw fa-circle" style="color: {{team.couleur}};"></i></div>'+
                                '<div class="td strong">{{team.name}}</div>' +
                                '<div class="td">{{team.stats.played}}</div>' +
                                '<div class="td">{{team.stats.victory}}</div>' +
                                '<div class="td">{{team.stats.draw}}</div>' +
                                '<div class="td">{{team.stats.defeat}}</div>' +
                                '<div class="td">{{team.stats.bp}}</div>' +
                                '<div class="td">{{team.stats.bc}}</div>' +
                                '<div class="td">{{team.stats.db}}</div>' +
                                '<div class="td strong">{{team.stats.pts}}</div>' +
                            '</div>',
                
                link: function ($scope, $element) {}
            }
    });

