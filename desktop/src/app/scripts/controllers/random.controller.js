'use strict';

angular.module('fifatournament')
  .controller('RandomCtrl', function ($scope, LocalStorage, API, Shuffle, $location) {
    
    $scope.init = function(){
        
        API.getTournament(LocalStorage.getLocalStorage('tournament'))
        .success(function(tournament){
            
            $scope.config = tournament;
            console.log(tournament);
            $scope.players = [];
            
            for(var j = 0; j < tournament.nbPlayers; j++){
                $scope.players.push("");
            }
        })
        .error(function(err){
            console.log(err);
        })
        
    };
    
    // verif the form
    $scope.verifForm = function(event){
        
        event.preventDefault();
        
        var playersNameInput = document.getElementsByClassName('playersName');
        
        var cpt = 0;
        for(var i = 0; i < playersNameInput.length; i++){
            
            if(playersNameInput[i].value == ''){
                //error
                return false;
            }else{
                //validate
                cpt ++;
            }
            
            if(cpt == playersNameInput.length){
                $scope.create(playersNameInput);
            }

        }
        
    }
    
    // create the tournament
    $scope.create = function(playersNameInput){
        
        var playersName = [];
        
        for (var i = 0; i < playersNameInput.length; i++){
            
            playersName.push(playersNameInput[i].value);
            
        }

        var playersNameShuffle = Shuffle.shuffleArray(playersName);
        
        for(var j = 0; j < playersName.length; j++){

            var player = {
                playerName : playersNameShuffle[j]
            }
            
            //update each player
            API.updatePlayer($scope.config.players[j], player)
            .success(function(player){
                console.log(player);
            })
            .error(function(err){
                return false;
               console.log(err); 
            });
        }
        
        $location.path('/ready');

    }
    
    $scope.init();
    
});
