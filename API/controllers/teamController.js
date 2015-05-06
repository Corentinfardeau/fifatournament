module.exports = {
    
    create : function(req, res) {
        
        // Shuffle an array
        function shuffleArray(array) {

            var currentIndex = array.length, temporaryValue, randomIndex ;
            while (0 !== currentIndex) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
            
            return array;
        };
        
        var colors = req.body.colors;
        var clubs = req.body.clubs;
        var config = req.body.config;

        var nbTeamsComplete = (config.nbPlayers - (config.nbPlayers % config.nbPlayersByTeam))/config.nbPlayersByTeam;
        var nbPlayersLastTeam = config.nbPlayers - (config.nbPlayersByTeam*nbTeamsComplete);
        var playersLastTeam = [];

        var teams = [];

        var clubsRange = [];

        if(config.alea) {

            for(var i = 0; i < clubs.length; i++) {
                if(clubs[i].stars <= config.starsMax && clubs[i].stars >= config.starsMin) {
                    clubsRange.push(clubs[i]);
                }
            }

            var clubsRangeSuffle = shuffleArray(clubsRange);
        }

        var playersNameShuffle = shuffleArray(config.playersName);

            //Create full team
            for (var i = 0 ; i < nbTeamsComplete ; i++){

                var playersName = [];

                for(var k =0; k < config.nbPlayersByTeam; k++){ 

                    var player = {
                        'name' : playersNameShuffle[playersNameShuffle.length-1],
                        'nbGoal' : 0
                    }

                    playersName.push(player);
                    playersNameShuffle.pop();
                }

                var k =i;
                if(!colors[i]) {
                    k = Math.floor(Math.random() * (colors.length - 0)) + 0;
                }

                var team = {
                    'nbPlayer' : config.nbPlayersByTeam,
                    'name' : "Nom d'équipe "+(i+1),
                    'colors' : colors[k],
                    'playersName' : playersName,
                    'stats' : {
                        'played' : 0,
                        'won' : 0,
                        'drawn' : 0,
                        'lost' : 0,
                        'gf' : 0,
                        'ga' : 0,
                        'gd' : 0,
                        'pts' : 0
                    }
                };

                 if(config.alea) {
                     team.name = clubsRangeSuffle[i].name;
                     team.img = clubsRangeSuffle[i].img;
                 }
                teams.push(team);
            }



            // create last team
            if(nbPlayersLastTeam != 0){

                var playersName = [];

                for(var i =0 ; i < nbPlayersLastTeam; i++){

                    playersLastTeam.push('');

                    var player = {
                        name : playersNameShuffle[i],
                        nbGoal : 0
                    }

                    playersName.push(player);
                }

                if(config.alea){
                    var k = teams.length + 1;
                    if(k > colors.length) {
                        k = Math.floor(Math.random() * (colors.length - 0)) + 0;
                    }
                    var team = {
                        'nbPlayers' : nbPlayersLastTeam,
                        'name' : "Nom d'équipe "+(teams.length+1),
                        'colors' : colors[teams.length+1],
                        'playersName' : playersName,
                        'stats' : {
                            'played' : 0,
                            'won' : 0,
                            'drawn' : 0,
                            'lost' : 0,
                            'gf' : 0,
                            'ga' : 0,
                            'gd' : 0,
                            'pts' : 0
                        }
                    };         
                }else{
                    var team = {
                        'nbPlayers' : nbPlayersLastTeam,
                        'name' : "Nom d'équipe "+(teams.length+1),
                        'colors' : colors[teams.length+1],
                        'playersName' : playersLastTeam,
                        'stats' : {
                            'played' : 0,
                            'won' : 0,
                            'drawn' : 0,
                            'lost' : 0,
                            'gf' : 0,
                            'ga' : 0,
                            'gd' : 0,
                            'pts' : 0
                        }
                    }; 
                }

                 if(config.alea) {
                     team.name = clubsRangeSuffle[teams.length + 1].name;
                     team.img = clubsRangeSuffle[teams.length + 1].img;
                 }
                teams.push(team);
            }
            
        res.json(teams);
    }
    
}