'use strict';

angular.module('fifatournament')

.service('API',function API(Config, $http) {
    
    
    var transform = function (data) {
        return $.param(data);
    };
    
    this.createTournament = function(parameters){

        return $http({
            method: 'POST',
            url: Config.API_URL + 'tournament/create',
            data: parameters,
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            transformRequest: transform
        });
    };
    
    this.getTournaments = function(){

        return $http({
            method: 'GET',
            url: Config.API_URL + 'tournament'
        });
        
    };
    
    this.addMatchsToLeague = function(league_id, parameters){

        return $http({
            method: 'POST',
            url: Config.API_URL + 'matchs/add/'+league_id,
            data: parameters,
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            transformRequest: transform
        });
        
    };
    
    this.getMatch = function(match_id){

        return $http({
            method: 'GET',
            url: Config.API_URL + 'match/'+match_id
        });
        
    };
    
    this.addLeagueToTournament = function(tournament_id){

        return $http({
            method: 'POST',
            url: Config.API_URL + 'league/add/'+tournament_id,
        });
    };
    
    this.addPlayersToTournament = function(tournament_id, parameters){

        return $http({
            method: 'POST',
            url: Config.API_URL + 'player/add/'+tournament_id,
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