var Match = require('../models/match.js');

module.exports = {
    
    create : function(req, res, next) {
        
        var match = new Match();

        match.save(function(err) {
            if (err)
                res.send(err);

            res.json(match);
        });
    
    }
    
}