'use strict';

angular.module('fifatournament')

.service('API',function API(Config, $http) {
        
        // create a game with config
        this.createGame = function(params){
             return $http.post(Config.API_URL + 'game' + Config.API_KEY, params);
        };
        
        // create the teams with the config and players name
        this.createTeams = function(params){
             return $http.post(Config.API_URL + 'teams', params);
        };
    
        // create a league
        this.createLeague = function(params){
             return $http.post(Config.API_URL + 'league', params);
        };
    
        // get all the clubs
        this.getClubs = function(){
             return $http.get(Config.API_URL + 'clubs');
        };
        
        // get clubs with stars
        this.getClubsByStars = function(nbStars){
             return $http.get(Config.API_URL + 'clubs/'+nbStars);
        };

});