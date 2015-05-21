'use strict';

angular.module('fifatournament')
  .controller('RandomCtrl', function ($scope, LocalStorage, API) {
    
    $scope.init = function(){
        
        API.getTournament(LocalStorage.getLocalStorage('tournament'))
        .success(function(tournament){
            
            console.log(tournament);
            $scope.players = [];
            
            for(var j = 0; j < tournament.nbPlayers; j++){
                $scope.players.push("");
            }
            
            console.log($scope.players);
        })
        .error(function(err){
            console.log(err);
        })
        
    };
    
    $scope.init();
    
});
