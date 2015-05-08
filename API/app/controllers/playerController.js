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
    
    addToTeam : function(req, res, next){    

        Team.findById(req.params.team_id, function(err, team) {
            if (err)
                res.send(err);
            
            var t = [];
            
            for(var i = 0; i < req.body.players.length; i++){
                
                var player = new Player();
                player.playerName = req.body.players[i].playerName;
                t.push(player);
            }  
            
            team.players.concat(t, function(err, players){
                team.save(function(err){
                    console.log(err);
                    res.json(players);
                });
            });
            
        });   
    }
}