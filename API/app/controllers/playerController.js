var Player = require('../models/player.js');
var Team = require('../models/team.js');

module.exports = {
    
    create : function(req, res, next) {
        
        var player = new Player();
        
        player.name = req.body.name;  
        player.nbGoal = 0;  
        player.team = req.body.team;  
    
        player.save(function(err) {
            if (err)
                res.send(err);
            
            res.json(player);
        });
    },
    
    getAll : function(req, res, next) {
        
        Player.find(function(err, player) {
            if (err)
                res.send(err);

            res.json(player);
        });
    
    },
    
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
            
            player.nbGoal ++;
            player.save(function(err){
                if(err)
                    console.log(err);
                res.json(player);
            });
        
        });
    
    },
    
    addToTournament : function(req, res, next){    

        Tournament.findById(req.params.tournament_id, function(err, tournament) {
            if (err)
                res.send(err);
            
            var t = [];
            
            for(var i = 0; i < req.body.players.length; i++){
                
                var player = new Player();
                if(req.body.players[i].playerName){
                   player.playerName = req.body.players[i].playerName; 
                }
                t.push(player);
            }  
            
            tournament.players.concat(t, function(err, players){
                tournament.save(function(err){
                    if(err)
                        console.log(err);
                    res.json(players);
                });
            });
            
        });   
    }
}