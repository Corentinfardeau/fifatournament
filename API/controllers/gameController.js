module.exports = {
    
    create : function(req, res) {
        
        var config = {'nbPlayers' : req.body.nbPlayers, 
                      'nbPlayersByTeam' : req.body.nbPlayersByTeam, 
                      'alea' : req.body.alea,
                      'playersName' : req.body.playersName,
                      'type' : req.body.type,
                      'starsMin': req.body.starsMin,
                      'starsMax': req.body.starsMax
                     };
        
        res.json(config);
    }
    
}