'use strict';

angular.module('fifatournament')

.service('API',function API(Config, $http) {
    
    
    var transform = function (data) {
        return $.param(data);
    };
    
    this.createLeague = function(parameters){

        return $http({
            method: 'POST',
            url: Config.API_URL + 'tournament/create',
            data: parameters,
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            transformRequest: transform
        });
        
    };
    
    this.getLeagues = function(){

        return $http({
            method: 'GET',
            url: Config.API_URL + 'tournament'
        });
        
    };
    
    this.addTeamsToLeague = function(tournament_id, parameters){

        return $http({
            method: 'POST',
            url: Config.API_URL + 'team/add/'+tournament_id,
            data: parameters,
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            transformRequest: transform
        });
    };
    
    this.getTeam = function(){

        return $http({
            method: 'GET',
            url: Config.API_URL + 'team',
        });
    };
    
    this.addPlayersToTeam = function(team_id, parameters){

        return $http({
            method: 'POST',
            url: Config.API_URL + 'player/add/'+team_id,
            data: parameters,
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            transformRequest: transform
        });
    };

});