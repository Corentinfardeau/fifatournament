'use strict';

angular.module('fifatournament')

	.controller('JoinController', function ($scope, LocalStorage, API, $location) {
    
    $scope.join = function(event){
        
        event.preventDefault();
        var token = document.getElementById('input_join').value;
        
        API.joinTournament(token)
        .success(function(response){
            LocalStorage.setLocalStorage('tournament', response._id);
            $location.path('/matchs');
        })
        .error(function(err){
            console.log(err);
        });
    }

});