'use strict';

angular.module('fifatournament')

.service('API',function API(Config, $http) {
    
    
    var transform = function (data) {
        return $.param(data);
    };
    
    /**
    
    TOURNAMENT
    
    **/
    
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
    
    /**
    
    MATCHS
    
    **/
    
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
    
    /**
    
    LEAGUE
    
    **/
    
    this.addLeagueToTournament = function(tournament_id){

        return $http({
            method: 'POST',
            url: Config.API_URL + 'league/add/'+tournament_id,
        });
    };
    
    /**
    
    PLAYERS
    
    **/
    
    this.addPlayersToTournament = function(tournament_id, parameters){

        return $http({
            method: 'POST',
            url: Config.API_URL + 'player/add/'+tournament_id,
            data: parameters,
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            transformRequest: transform
        });
    };
    
    /**
    
    TEAMS
    
    **/
    
    
    this.getTeam = function(){

        return $http({
            method: 'GET',
            url: Config.API_URL + 'team',
        });
    };
    
    this.getTournamentTeams = function(tournament_id){
        
        return $http({
            method: 'GET',
            url: Config.API_URL + 'tournament/'+tournament_id+/teams,
        });
        
    }
    
    this.addTeamToTournament = function(tournament_id, parameters){

        return $http({
            method: 'POST',
            url: Config.API_URL + 'team/add/'+tournament_id,
            data: parameters,
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            transformRequest: transform
        });
    };

});