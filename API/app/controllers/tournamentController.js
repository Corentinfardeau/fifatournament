var Tournament = require('../models/tournament.js');
var League = require('../models/league.js');

module.exports = {
    
    create : function(req, res, next) {
        
        var tournament = new Tournament();
        tournament.name = req.body.name;
        tournament.password = req.body.password;
        tournament.type = req.body.type;
        tournament.alea = req.body.alea;
        tournament.nbPlayersByTeam = req.body.nbPlayersByTeam;
        
        tournament.save(function(err) {
            if (err)
                res.send(err);
            
            res.json(tournament);
        });
    },
    
    getAll : function(req, res, next) {
        
        Tournament.find(function(err, tournament) {
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
        
    }
}