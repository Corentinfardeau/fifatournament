var Player = require('../models/player.js');
var Tournament = require('../models/tournament.js');
var Team = require('../models/team.js');

var async = require('async');
require('mongo-relation');
    
module.exports = {
    
    get : function(req, res, next) {
        
        Player.findById(req.params.player_id, function(err, player) {
            if (err)
                res.send(err);

            res.json(player);
        });
    },
    
    update : function(req, res, next) {
        
        Player.findById(req.params.player_id, function(err, player) {
            if (err)
                res.send(err);
            if(req.body.playerName)
                player.playerName = req.body.playerName;
            if(req.body.nbGoal)
                player.nbGoal = req.body.nbGoal;
            player.save(function(err){
               if(err)
                   console.log(err);
                res.json(player);
            });
        
        });
    
    },
    
    addToTeams : function(req, res, next){    
        
        function insertInTeam(team, players, cb){ 
            team.players.concat(players, function(err, players){
                if(err)
                    cb(err);
                team.save(function(err){
                    if(err)
                        cb(err);
                });
            });
        };
            
        function insertInTournament(tournament, players, cb){ 
            tournament.players.concat(players, function(err, players){
                if(err)
                    cb(err);
                tournament.save(function(err){
                    if(err)
                        cb(err);
                    cb(players);
                });
            });
        };
        
        function createPlayers(teams, tournament, cb){
            
            var players = req.body.players;
            var allPlayer = [];
            var cpt = 0;
            
            for(var i = 0 ; i < teams.length; i++){
                
                var nbPlayers = teams[i].nbPlayers;
                var playersArray = [];
                var team = teams[i];
                
                for(var j = 0; j < nbPlayers; j++){
                    var player = new Player();
                    player.playerName = players[cpt].playerName; 
                    playersArray.push(player);
                    allPlayer.push(player);
                    cpt++;
                }
                
                insertInTeam(team, playersArray, function(err){
                    if(err){
                        console.log(err);
                    }
                });
            }  
            
            insertInTournament(tournament, allPlayer, function(players){
                cb(players);
            });
        
        };
        
        Tournament.findById(req.params.tournament_id, function(err, tournament) {
            if (err)
                res.send(err);

            tournament.teams.find(function(err, teams){
                createPlayers(teams, tournament, function(players){
                    res.json(players);
                });
            });
            
        });   
    }
}