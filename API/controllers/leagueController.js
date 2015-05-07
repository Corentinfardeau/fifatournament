module.exports = {
    
    create : function(req, res) {
        
        var teams = req.body;

        var firstLegMatchs = [];
        
        for(var i = 0; i < teams.length ; i++){

            for(var j = i+1; j < teams.length; j++){
                var match = {};
                match['0'] = teams[i];
                match['1'] = teams[j];
                match['b0'] = 0;
                match['b1'] = 0;
                match['played'] = false;
                match['date'] = '';
                match['state'] = 'firstLeg';

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
            var match = {};
            match['0'] = firstLegMatchsOrdered[i]['1'];
            match['1'] = firstLegMatchsOrdered[i]['0'];
            match['b0'] = 0;
            match['b1'] = 0;
            match['played'] = false;
            match['date'] = '';
            match['state'] = 'returnLeg';

            returnLegMatchsOrdered.push(match);
        }

        var league = {
                "firstLeg" : firstLegMatchsOrdered,
                "returnLeg" : returnLegMatchsOrdered 
        };
        
        res.json(league);
    }
    
}