var Tournament = require('../models/tournament.js');
var League = require('../models/league.js');
var Team = require('../models/team.js');
var Player = require('../models/player.js');


module.exports = {
    
    create : function(req, res, next) {
        
        function token(id, cb){

            var chars = id+'';
            var string_length = 6;
            var randomstring = '';
            for (var i=0; i<string_length; i++) {
                var rnum = Math.floor(Math.random() * chars.length);
                randomstring += chars.substring(rnum,rnum+1);
            }
            
            Tournament.find({token : randomstring}, function (err, docs) {
                if (docs.length){
                    token(id);
                }else{
                    cb(randomstring);     
                }
            });   
        }
        
        var tournament = new Tournament();
        tournament.type = req.body.type;
        tournament.random = req.body.random;
        tournament.public = req.body.public;
        tournament.nbPlayers = req.body.nbPlayers;
        tournament.nbPlayersByTeam = req.body.nbPlayersByTeam;
    
        token(tournament._id, function(token){
            tournament.token = token;
            tournament.save(function(err) {
                if (err){
                    res.send(err);
                }else{
                    res.json(tournament);
                }   
            });
        });
    },

    delete: function(req,res,next) {
        
    },
    
    get : function(req, res, next) {
        
        Tournament.findById(req.params.tournament_id, function(err, tournament) {
            if (err)
                res.send(err);
            
            res.json(tournament);
        });
    },

    getPlayers: function(req,res,next) {
        function getTournament(tournament_id,cb) {
            Tournament.findById(req.params.tournament_id, function(err, tournament) {
                if (err)
                    res.send(err);

                cb(tournament);
            });
        }

        function getPlayers(player,cb) {
            Player.findById(player, function(err, res_player) {
                if (err)
                    res.send(err);

                cb(res_player);
            });
        }

        getTournament(req.params.tournament_id,function(tournament){
            var players = [];
            var cpt = 0;

            for(var i = 0; i < tournament.players.length; i++) {
                getPlayers(tournament.players[i],function(player){
                    players.push(player);
                    cpt++;
                    if(cpt === tournament.players.length) {
                        res.json(players);
                    }
                });
            }
        });
    },
    
    join : function(req, res, next) {
        
        Tournament.findOne({ 'token' : req.params.token }, function(err, tournament) {
            if (err)
                res.send(err);
            
            res.json(tournament);
        });
    },
    
    getCompetition : function(req, res, next){
        
        Tournament.findById(req.params.tournament_id, function(err, tournament) {
            if (err)
                res.send(err);
            
            switch(tournament.type) {
                case 'league':
                    League.findById(tournament.competition_id, function(err, league){
                        if(err)
                            console.log(err);
                        res.send(league);
                    });
                    break;
                case 'cup':
                    res.send({message : 'les coupes ne sont pas encore supportées'});
                    break;
                default:
                    res.send({message : 'error'});
                    break;
            }
        });
    },
    
    getTeams : function(req, res, next){
        
        Tournament.findById(req.params.tournament_id, function(err, tournament) {
            if (err)
                res.send(err);
            
           tournament.teams.find(function(err, teams){
               if(err)
                   console.log(err);
               res.json(teams);
           });
            
        });
    }
}