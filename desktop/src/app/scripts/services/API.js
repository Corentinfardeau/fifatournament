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
    
    this.joinTournament = function(token){

        return $http({
            method: 'GET',
            url: Config.API_URL + 'tournament/join/'+token
        });
        
    };
    
    this.getTournament = function(tournament_id){

        return $http({
            method: 'GET',
            url: Config.API_URL + 'tournament/' + tournament_id
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
    
    this.addLeagueToTournament = function(tournament_id){

        return $http({
            method: 'POST',
            url: Config.API_URL + 'league/add/'+tournament_id,
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
    
    this.addPlayersToTeams = function(tournament_id, parameters){

        return $http({
            method: 'POST',
            url: Config.API_URL + 'player/add/'+tournament_id,
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
    
    this.addTeamToTournament = function(tournament_id, parameters){

        return $http({
            method: 'POST',
            url: Config.API_URL + 'team/add/'+tournament_id,
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