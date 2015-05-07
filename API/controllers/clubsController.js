module.exports = {
    
    getAll : function(req, res) {
        var clubs = require('../JSON/clubs.json');
        res.json(clubs);
    },
    
    getClubsByStars : function(req, res) {
        var nbStars = req.params.nb_stars;
        var clubs = require('../JSON/clubs.json');
        var clubsRange = [];
        
        for(var i = 0; i < clubs.clubs.length; i++) {
            if(clubs.clubs[i].stars == nbStars) {
                clubsRange.push(clubs.clubs[i]);
            }
        }
        
        res.json(clubsRange);
    }
    
}