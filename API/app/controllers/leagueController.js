var League = require('../models/league.js');
var Tournament = require('../models/tournament.js');

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
        
        League.findById(req.params.league_id, function(err, league){
           if(err)
               console.log(err);
            res.json(league);
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