var Tournament = require('../models/tournament.js');

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
        
        Tournament.find(req.params.tournament_id, function(err, tournament) {
            if (err)
                res.send(err);
            
            res.json(tournament);
        });
    }
}