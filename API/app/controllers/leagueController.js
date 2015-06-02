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
                        played : matchInfo.played,
                        live: matchInfo.live
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
                    _id : req.params.league_id,
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
    },
    
    ranking : function(req, res, next){
        
        function rank(teams){
            
            var tabOrdered = false;
            var size = teams.length;
            
            while(!tabOrdered){
                
                tabOrdered = true;
                
                for(var i = 0 ; i < size-1; i++){
                    if(teams[i].pts<teams[i+1].pts){
                        var temporary = teams[i+1];
                        teams[i+1] = teams[i];
                        teams[i] = temporary;
                        tabOrdered = false;
                    }       
                }
                
                size--;
            }
            
            for(var j = 0 ; j < teams.length-1; j ++){
                if(teams[j].pts === teams[j+1].pts){
                    if(teams[j].gd<teams[j+1].gd){
                        var temporary = teams[j+1];
                        teams[j+1] = teams[j];
                        teams[j] = temporary;
                    }  
                }
            }
            
            for(var j = 0 ; j < teams.length-1; j ++){
                if(teams[j].pts === teams[j+1].pts && teams[j].gd === teams[j+1].gd){
                    if(teams[j].gf<teams[j+1].gf){
                        var temporary = teams[j+1];
                        teams[j+1] = teams[j];
                        teams[j] = temporary;
                    }  
                }
            }

            return teams;
        }
        
        function getTeams(team, cb){

            Team.findById(team, function(err, team){
                if(err)
                    console.error(err);
                cb(null, team);
            });
        }
        
        League.findById(req.params.league_id, function(err, league){
           if(err)
               console.log(err);
            Tournament.findById(league.tournament_id, function(err, tournament){
                if(err)
                    console.error(err);
                
                async.map(tournament.teams, getTeams, function(err, results){
                    if(req.params.order_by === 'classic'){
                        res.json(rank(results));   
                    }
                });
                
            });
        });
    }
}