var Match = require('../models/match.js');
var League = require('../models/league.js');

module.exports = {
    
    addToLeague : function(req, res, next) {
        
        var teams = req.body.teams;
        var firstLegMatchs = [];
        
        for(var i = 0; i < teams.length ; i++){

            for(var j = i+1; j < teams.length; j++){
                
                var match = new Match();
                match.homeTeam = teams[i]._id;
                match.awayTeam = teams[j]._id;
                
                match.save(function(err){
                    if(err)
                        console.log(err);
                });
                
                firstLegMatchs.push(match);
            }
        }

        var firstLegMatchsOrdered = [];
        var present = false;
        var present2 = false;
        var cpt;

        //Ordered array for a league
        for(var i = 0; i < firstLegMatchs.length; i++){
            for(var j = 0; j < firstLegMatchsOrdered.length; j ++){
                if(firstLegMatchsOrdered[j] == firstLegMatchs[i])
                    present = true;
            }

            cpt = i;

            if(!present){
                firstLegMatchsOrdered.push(firstLegMatchs[i]);

                for(var k = (teams.length-1); k >= 2; k --){
                    cpt = k + cpt;

                    if(firstLegMatchs[cpt] != null){
                        for(var l = 0; l < firstLegMatchsOrdered.length; l ++){
                            if(firstLegMatchsOrdered[l] == firstLegMatchs[cpt])
                                present2 = true;
                        }
                        if(present2 == false)
                            firstLegMatchsOrdered.push(firstLegMatchs[cpt]);

                        present2 = false;
                    }
                }
            }

            present = false;
        }

        var returnLegMatchsOrdered = [];

        for(var i = 0; i < firstLegMatchsOrdered.length; i ++) {
            
            var match = new Match();
            match.homeTeam = firstLegMatchsOrdered[i].awayTeam;
            match.awayTeam = firstLegMatchsOrdered[i].homeTeam;
            match.save(function(err){
                if(err)
                    console.log(err);
            });
            returnLegMatchsOrdered.push(match);
        }

        League.findById(req.params.league_id, function(err, league){
           if(err)
               console.log(err);
            
            for(var m = 0; m <firstLegMatchsOrdered.length; m++){
                league.firstLeg.push(firstLegMatchsOrdered[m]._id);    
                league.returnLeg.push(returnLegMatchsOrdered[m]._id);
            }
            
            league.save(function(err){
                if(err)
                    console.log(err);
                res.json(league);
            });
        });
    },
    
    get : function(req, res, next){
        
        Match.findById(req.params.match_id, function(err, match){
           if(err)
               console.log(err);
            res.json(match);
        });
    },
    
    update : function(req, res, next){
        
        Match.findById(req.params.match_id, function(err, match){
            if(err)
               console.log(err);
            
            if (typeof req.body.played !== 'undefined') {
                match.played = req.body.played;
            }
            
            if (typeof req.body.live !== 'undefined') {
                match.live = req.body.live;
            }
            
            if (typeof req.body.goalHomeTeam !== 'undefined') {
                match.goalHomeTeam = req.body.goalHomeTeam;
            }
            
            if (typeof req.body.goalAwayTeam !== 'undefined') {
                match.goalAwayTeam = req.body.goalAwayTeam;
            }
            
            match.save(function(err){
                if(err)
                    console.log(err);
                res.json(match);
            }); 
        });
    }
}