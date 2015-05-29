'use strict';

angular.module('fifatournament')

.service('API',function API(Config, $http, $q) {
    
    
    var transform = function (data) {
        return $.param(data);
    };
    
    /**
    
    TOURNAMENT
    
    **/
    
    this.createTournament = function(tournamentParameters, nbPlayers, players){
        
        var deferred = $q.defer();
        
        //Step for create a tournament
        async.waterfall([

            //Create a tournament
            function(callback) {
                
                $http({
                    method: 'POST',
                    url: Config.API_URL + 'tournament/create',
                    data: tournamentParameters,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    transformRequest: transform
                })
                .success(function(tournament){
                    console.info('tournament created');
                    callback(null, tournament);    
                })
                .error(function(err){
                    console.error(err);
                });
            },

            // Teams created and added to the tournament
            function(tournament, callback) {
                $http({
                    method: 'POST',
                    url: Config.API_URL + 'team/create/'+tournament._id,
                    data: nbPlayers,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    transformRequest: transform
                })
                .success(function(teams){
                    console.info('teams created and added to the tournament');
                    callback(null, tournament);
                })
                .error(function(err){
                    console.error(err);
                })
            },
            
            function(tournament, callback){
                 $http({
                    method: 'POST',
                    url: Config.API_URL + 'player/create/'+tournament._id,
                    data: players,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    transformRequest: transform
                })
                .success(function(teams){
                    console.info('players added to team');
                    callback(null, tournament);
                })
                .error(function(err){
                    console.log(err);
                });   
                
            }
            
        ], function (err, tournament) {
            deferred.resolve(tournament);
        }); 
        
        return deferred.promise;
    };
    
    this.createPlayers = function(tournament_id, players){
        
        var deferred = $q.defer();
        
        $http({
            method: 'POST',
            url: Config.API_URL + 'player/create/'+tournament_id,
            data: players,
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            transformRequest: transform
        })
        .success(function(teams){
            deferred.resolve(teams);
            console.info('players added to team');
        })
        .error(function(err){
            deferred.resolve(err);
        });
        
        return deferred.promise;
        
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
    
    this.updatePlayer = function(player_id, parameters){
        return $http({
            method: 'POST',
            url: Config.API_URL + 'player/update/'+player_id,
            data: parameters,
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            transformRequest: transform
        });
    };

    this.getPlayer = function(player_id) {
        return $http({
            method: 'GET',
            url: Config.API_URL + 'player/' + player_id
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

    this.getPlayersTeam = function(team_id){
        
        return $http({
            method: 'GET',
            url: Config.API_URL + 'team/' + team_id + '/players'
        });
        
    };
    
    /**
    
    GOAL
    
    **/
    
    this.goal = function(teamScored, teamAgainst){
        
        var deferred = $q.defer();
        
        //Step for create a tournament
        async.waterfall([
        
            function(callback) {
                
                var teamScoredParams = {
                        
                }
                
                $http({
                    method: 'POST',
                    url: Config.API_URL + 'team/update/' + teamScored._id,
                    data: teamScoredParams,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    transformRequest: transform
                })
                .success(function(team){
                    callback(null, team);    
                })
                .error(function(err){
                    console.error(err);
                });
            },

            // Teams created and added to the tournament
            function(team, callback) {
                
                var teamAgainstParams = {
                        
                }
                                
                $http({
                    method: 'POST',
                    url: Config.API_URL + 'team/update/' + teamAgainst._id,
                    data: teamAgainstParams,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    transformRequest: transform
                })
                .success(function(team){
                    callback(null, team);
                })
                .error(function(err){
                    console.error(err);
                })
            }
            
        ], function (err, tournament) {
            deferred.resolve(tournament);
        }); 
        
        return deferred.promise;
    };

});