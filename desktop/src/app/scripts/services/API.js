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
    
    this.getTournament = function(tournament_id){

        return $http({
            method: 'GET',
            url: Config.API_URL + 'tournament/' + tournament_id
        });

    };
    
    this.joinTournament = function(token){

        return $http({
            method: 'GET',
            url: Config.API_URL + 'tournament/join/'+token
        });
        
    };
    
    
    /**
    
    MATCHS
    
    **/
    
    this.createMatchsLeague = function(league_id, parameters){

        return $http({
            method: 'POST',
            url: Config.API_URL + 'matchs/create/'+league_id,
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
    
    this.updateMatch = function(match_id, parameters){

        return $http({
            method: 'POST',
            url: Config.API_URL + 'match/update/'+match_id,
            data: parameters,
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            transformRequest: transform
        });
        
    };
    
    /**
    
    LEAGUE
    
    **/
    
    this.createLeague = function(tournament_id){

        return $http({
            method: 'POST',
            url: Config.API_URL + 'league/create/'+tournament_id,
        });
    };
    
    this.getLeague = function(league_id){

        return $http({
            method: 'GET',
            url: Config.API_URL + 'league/'+league_id,
        });
    };
    
    this.getRanking = function(league_id, order_by){

        return $http({
            method: 'GET',
            url: Config.API_URL + 'league/'+league_id+'/ranking/'+order_by,
        });
    };
    
    /**
    
    PLAYERS
    
    **/
    
    this.createPlayers = function(tournament_id, parameters){

        return $http({
            method: 'POST',
            url: Config.API_URL + 'player/create/'+tournament_id,
            data: parameters,
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            transformRequest: transform
        });
    };
    
    this.updatePlayer = function(player_id, parameters){

        return $http({
            method: 'POST',
            url: Config.API_URL + 'player/update/'+player_id,
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
            url: Config.API_URL + 'team'
        });
    };
    
    this.updateTeam = function(team_id, parameters){

        return $http({
            method: 'POST',
            url: Config.API_URL + 'team/update/'+team_id,
            data: parameters,
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            transformRequest: transform
        });
    };
    
    this.getTournamentTeams = function(tournament_id){
        
        return $http({
            method: 'GET',
            url: Config.API_URL + 'tournament/' + tournament_id + '/teams'
        });
        
    };
    
    this.createTeams = function(tournament_id, parameters){

        return $http({
            method: 'POST',
            url: Config.API_URL + 'team/create/'+tournament_id,
            data: parameters,
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            transformRequest: transform
        });
    };
    
    this.getPlayersTeam = function(team_id){
        
        return $http({
            method: 'GET',
            url: Config.API_URL + 'team/' + team_id + '/players'
        });
        
    };

});