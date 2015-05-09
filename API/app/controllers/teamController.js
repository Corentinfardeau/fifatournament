require('mongo-relation');
var Team = require('../models/team.js');
var Tournament = require('../models/tournament.js');

module.exports = {
    
    create : function(req, res, next) {
        
        var team = new Team();
        team.name = req.body.name;  
        team.nbPlayer = req.body.nbPlayer,
        team.colors = req.body.colors,
        team.played = 0,
        team.won = 0,
        team.drawn = 0,
        team.lost = 0,
        team.gf = 0,
        team.ga = 0,
        team.gd = 0,
        team.pts = 0
        
        team.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'team created!', teams: team });
        });
    
    },
    
    getAll : function(req, res, next) {
        
        Team.find(function(err, team) {
            if (err)
                res.send(err);
            
            res.json(team);
        });
    
    },
    
    get : function(req, res, next) {
        
        Team.findById(req.params.team_id, function(err, team) {
            if (err)
                res.send(err);
            
            res.json(team);
        });

    },
    
    addToTournament : function(req, res, next){
        
        Tournament.findById(req.params.tournament_id, function(err, tournament) {
            if (err)
                res.send(err);
            
            var t = [];

            for(var i = 0; i < req.body.teams.length; i++){
                var team = new Team();
                team.teamName = req.body.teams[i].teamName;
                team.nbPlayer = req.body.teams[i].nbPlayer;
                t.push(team);
            }  
            
            tournament.teams.concat(t, function(err, teams){
                tournament.save(function(err){
                    if(err)
                        console.log(err);
                    res.json(teams);
                });
            });
            
        });
        
    }
    
}