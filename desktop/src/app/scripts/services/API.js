'use strict';

angular.module('fifatournament')

.service('API',function API(Config, $http) {
        
        // create a game
        this.createGame = function(params){
             return $http.post(Config.API_URL + 'game', params);
        };
        
        // create a game
        this.createTeams = function(params){
             return $http.post(Config.API_URL + 'teams', params);
        };

});