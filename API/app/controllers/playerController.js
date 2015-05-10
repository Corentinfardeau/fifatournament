var Player = require('../models/player.js');
var Tournament = require('../models/tournament.js');

module.exports = {
    
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
    
    addToTeams : function(req, res, next){    
                
        function addPlayers(teams, tournament){
            
            var players = req.body.players;
            var cpt = 0;
            
            for(var i = 0 ; i < teams.length; i++){
                var nbPlayers = teams[i].nbPlayers;
                
                var playersArray = [];
                
                for(var j = 0; j < nbPlayers; j++){
                    var player = new Player();
                    player.playerName = players[cpt].playerName; 
                    playersArray.push(player);
                    cpt++;
                }
                
                teams[i].players.concat(playersArray, function(err, players){
                    if(err)
                        console.log(err);          
                });
                
                teams[i].save(function(err){
                    if(err)
                        console.log(err);
                });
            }
            
            res.json(teams);
        };
        
        Tournament.findById(req.params.tournament_id, function(err, tournament) {
            if (err)
                res.send(err);
            
            tournament.teams.find(function(err, teams){
                addPlayers(teams, tournament);
            });
            
        });   
    }
}