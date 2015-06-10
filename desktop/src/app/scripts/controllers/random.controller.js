'use strict';

angular.module('fifatournament')
  .controller('RandomCtrl', function ($scope, LocalStorage, API, Shuffle, $location) {
    
    $scope.init = function(){

        $scope.loading = true;
        
        $scope.messages = false;

        API.getTournament(LocalStorage.getLocalStorage('tournament'))
        .success(function(tournament){
            
            $scope.config = tournament;

            $scope.players = [];

            for(var i = 0; i < tournament.players.length; i++) {
                // get each player
                API.getPlayer(tournament.players[i])
                .success(function(player){
                    if(player.playerName) {
                        $scope.players.push(player.playerName);
                    } else {
                        $scope.players.push('');
                    }

                    if($scope.players.length === tournament.players.length) {
                        $scope.loading = false;
                    }
                })
                .error(function(err){
                    return false;
                   console.error(err); 
                });
            }
        })
        .error(function(err){
            console.error(err);
        });
    };
    
    // verif the form
    $scope.verifForm = function(event){
        
        event.preventDefault();
        
        var playersNameInput = document.getElementsByClassName('playersName');
        
        var cpt = 0;
        for(var i = 0; i < playersNameInput.length; i++){
            
            if(playersNameInput[i].value == ''){
                $scope.msg = 'Vous devez remplir le nom pour chaque joueur';
                $scope.messages = true;
                return false;
            }else{
                //validate
                cpt ++;
            }
            
            if(cpt == playersNameInput.length){
                $scope.updatePlayersName(playersNameInput);
            }

        }
        
    }
    
    // update
    $scope.updatePlayersName = function(playersNameInput){

        $scope.loading = true;
        
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
            .success(function(player){})
            .error(function(err){
                return false;
               console.error(err); 
            });
        }
        
        $scope.loading = false;
        
        $location.path('/ready');

    }
    
    $scope.init();
    
});
