'use strict';

angular.module('fifatournament')

	.controller('JoinController', function ($scope, LocalStorage, API, $location) {

        $scope.init = function() {
            $scope.messages = false;
        }
    
        $scope.join = function(event){            
            event.preventDefault();
            var token = document.getElementById('inputJoin').value;
            
            API.joinTournament(token)
            .success(function(response){
                if(response._id) {
                    LocalStorage.setLocalStorage('tournament', response._id);
                    LocalStorage.setLocalStorage('userStatut', 'ghost');
                    $location.path('/matchs');
                } else {
                    $scope.msg = 'T\'es sur d\'avoir la bonne clé ?';
                    $scope.messages = true;
                    return false;
                }
            })
            .error(function(err){
                console.error(err);
            });
        }

});