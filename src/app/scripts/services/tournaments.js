'use strict';

angular.module('fifatournament')

	.service('Tournaments', function tournaments() {
        
        // create all the components of a league and return it
        this.createLeague = function(teams) {
             
            var matchsAller = [];

                for(var i = 0; i < teams.length ; i++){

                    for(var j = i+1; j < teams.length; j++){
                        var match = {};
                        match["0"] = teams[i];
                        match["1"] = teams[j];
                        match["b0"] = 0;
                        match["b1"] = 0;
                        match["played"] = false;
                        match["date"] = '';
                        match["state"] = "Aller";

                        matchsAller.push(match);
                    }
                }

                var matchsAllerOrdered = [];
                var present = false;
                var present2 = false;
                var cpt;

                //Ordered array for a league
                for(var i = 0; i < matchsAller.length; i++){
                    for(var j = 0; j < matchsAllerOrdered.length; j ++){
                        if(matchsAllerOrdered[j] == matchsAller[i])
                            present = true;
                    }

                    cpt = i;

                    if(!present){
                        matchsAllerOrdered.push(matchsAller[i]);

                        for(var k = (teams.length-1); k >= 2; k --){
                            cpt = k + cpt;

                            if(matchsAller[cpt] != null){
                                for(var l = 0; l < matchsAllerOrdered.length; l ++){
                                    if(matchsAllerOrdered[l] == matchsAller[cpt])
                                        present2 = true;
                                }
                                if(present2 == false)
                                    matchsAllerOrdered.push(matchsAller[cpt]);

                                present2 = false;
                            }
                        }
                    }

                    present = false;
                }

                var matchsRetourOrdered = [];

                for(var i = 0; i < matchsAllerOrdered.length; i ++) {
                    var match = {};
                    match["0"] = matchsAllerOrdered[i]["1"];
                    match["1"] = matchsAllerOrdered[i]["0"];
                    match["b0"] = 0;
                    match["b1"] = 0;
                    match["played"] = false;
                    match["date"] = '';
                    match["state"] = "Retour";

                    matchsRetourOrdered.push(match);
                }

                var league = {
                        "aller" : matchsAllerOrdered,
                        "retour" : matchsAllerOrdered 
                };
            
            return league;
        };
        
        // create all the components of a Cup and return it
        this.createCup = function() {

        };

  });
