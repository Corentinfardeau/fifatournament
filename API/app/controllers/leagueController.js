var League = require('../models/league.js');
var Tournament = require('../models/tournament.js');
var Match = require('../models/match.js');
var Team = require('../models/team.js');

var async = require('async');

module.exports = {
    
    addToTournament : function(req, res, next) {

        Tournament.findById(req.params.tournament_id, function(err, tournament) {
            if (err)
                res.send(err);
            
            var league = new League();
            league.tournament_id = req.params.tournament_id;
            
            league.save(function(err){
                if(err)
                    console.log(err);
                    
                tournament.competition_id = league._id;
                tournament.save(function(err){
                   if(err)
                       console.log(err);
                    res.json(league);
                });
            });
            
        });
    },
    
    get : function(req, res, next){
        
        function getTeam(teamId, cb){
            
            Team.findById(teamId, function(err, team){
                if(err)
                    console.error(err);
                cb(team);
            });
            
        };
        
        function getMatch(matchId, cb){
        
            Match.findById(matchId, function(err, matchInfo){
                if(err)
                    console.error(err);
                async.parallel([
                    function(callback){
                        getTeam(matchInfo.homeTeam, function(team){
                            callback(null, team);
                        });
                    },
                    function(callback){
                        getTeam(matchInfo.awayTeam, function(team){
                            callback(null, team);
                        });
                    }
                ],
                function(err, results){
                    var match = {
                        _id : matchInfo._id,
                        homeTeam : results[0], 
                        awayTeam : results[1],
                        goalHomeTeam : matchInfo.goalHomeTeam,
                        goalAwayTeam : matchInfo.goalAwayTeam,
                        played : matchInfo.played
                    }

                    cb(null, match); 
                });
            });
            
        };
        
        function getFirstLegMatchs(firstLeg, cb){
            
            async.map(firstLeg, getMatch, function(err, results){
                cb(results);
            });
            
        };
                
        function getReturnLegMatchs(returnLeg, cb){
            
            async.map(returnLeg, getMatch, function(err, results){
                cb(results);
            });
            
        };
        
        League.findById(req.params.league_id, function(err, league){
           if(err)
               console.log(err);
            
            async.parallel([
                function(callback){
                    getFirstLegMatchs(league.firstLeg, function(matchs){
                        callback(null, matchs);
                    });
                },
                function(callback){
                    getReturnLegMatchs(league.returnLeg, function(matchs){
                        callback(null, matchs);
                    });
                }
            ],
            function(err, results){
                
                var firstLeg = results[0];
                var returnLeg = results[1];
                
                var league = {
                    firstLeg : firstLeg,
                    returnLeg : returnLeg
                }
                
                res.json(league);    
            });
            
        });
    },
    
    getTeams : function(req, res, next){
        
        League.findById(req.params.league_id, function(err, league){
           if(err)
               console.log(err);
            Tournament.findById(league.tournament_id, function(err, tournament){
                res.json(tournament.teams);
            });
        });
    }
}