require('mongo-relation');
var Team = require('../models/team.js');
var Tournament = require('../models/tournament.js');

module.exports = {
    
    
//    create : function(req, res) {
//        
//        // Shuffle an array
//        function shuffleArray(array) {
//
//            var currentIndex = array.length, temporaryValue, randomIndex ;
//            while (0 !== currentIndex) {
//                randomIndex = Math.floor(Math.random() * currentIndex);
//                currentIndex -= 1;
//                temporaryValue = array[currentIndex];
//                array[currentIndex] = array[randomIndex];
//                array[randomIndex] = temporaryValue;
//            }
//            
//            return array;
//        };
//        
//        var players = req.body.players;
//        var nbPlayers = req.body.playersName.length;
//        var nbPlayersByTeam = req.body.nbPlayersByTeam;
//        
//        var nbTeamsComplete = (nbPlayers - (nbPlayers % nbPlayersByTeam))/nbPlayersByTeam;
//        var nbPlayersLastTeam = nbPlayers - (nbPlayersByTeam*nbTeamsComplete);
//        var playersLastTeam = [];
//
//        var teams = [];
//
//        var playersShuffle = shuffleArray(players);
//
//            //Create full team
//            for (var i = 0 ; i < nbTeamsComplete ; i++){
//
//                var playersName = [];
//
//                for(var k =0; k < nbPlayersByTeam; k++){ 
//
//                    var player = {
//                        'name' : playersShuffle[playersShuffle.length-1],
//                        'nbGoal' : 0
//                    }
//
//                    playersName.push(player);
//                    playersShuffle.pop();
//                }
//
//                var k =i;
//                if(!colors[i]) {
//                    k = Math.floor(Math.random() * (colors.length - 0)) + 0;
//                }
//
//                var team = {
//                    'nbPlayer' : config.nbPlayersByTeam,
//                    'name' : "Nom d'équipe "+(i+1),
//                    'colors' : colors[k],
//                    'playersName' : playersName,
//                    'stats' : {
//                        'played' : 0,
//                        'won' : 0,
//                        'drawn' : 0,
//                        'lost' : 0,
//                        'gf' : 0,
//                        'ga' : 0,
//                        'gd' : 0,
//                        'pts' : 0
//                    }
//                };
//
//                 if(config.alea) {
//                     team.name = clubsRangeSuffle[i].name;
//                     team.img = clubsRangeSuffle[i].img;
//                 }
//                teams.push(team);
//            }
//
//
//
//            // create last team
//            if(nbPlayersLastTeam != 0){
//
//                var playersName = [];
//
//                for(var i =0 ; i < nbPlayersLastTeam; i++){
//
//                    playersLastTeam.push('');
//
//                    var player = {
//                        name : playersNameShuffle[i],
//                        nbGoal : 0
//                    }
//
//                    playersName.push(player);
//                }
//
//                if(config.alea){
//                    var k = teams.length + 1;
//                    if(k > colors.length) {
//                        k = Math.floor(Math.random() * (colors.length - 0)) + 0;
//                    }
//                    var team = {
//                        'nbPlayers' : nbPlayersLastTeam,
//                        'name' : "Nom d'équipe "+(teams.length+1),
//                        'colors' : colors[teams.length+1],
//                        'playersName' : playersName,
//                        'stats' : {
//                            'played' : 0,
//                            'won' : 0,
//                            'drawn' : 0,
//                            'lost' : 0,
//                            'gf' : 0,
//                            'ga' : 0,
//                            'gd' : 0,
//                            'pts' : 0
//                        }
//                    };         
//                }else{
//                    var team = {
//                        'nbPlayers' : nbPlayersLastTeam,
//                        'name' : "Nom d'équipe "+(teams.length+1),
//                        'colors' : colors[teams.length+1],
//                        'playersName' : playersLastTeam,
//                        'stats' : {
//                            'played' : 0,
//                            'won' : 0,
//                            'drawn' : 0,
//                            'lost' : 0,
//                            'gf' : 0,
//                            'ga' : 0,
//                            'gd' : 0,
//                            'pts' : 0
//                        }
//                    }; 
//                }
//
//                 if(config.alea) {
//                     team.name = clubsRangeSuffle[teams.length + 1].name;
//                     team.img = clubsRangeSuffle[teams.length + 1].img;
//                 }
//                teams.push(team);
//            }
//            
//        res.json(teams);
//    },
    
    getAll : function(req, res, next) {
        
        Team.find(function(err, team) {
            if (err)
                res.send(err);
            
            res.json(team);
        });
    
    },
    
    get : function(req, res, next) {
        
        Team.findById(req.params.team_id, function(err, team) {
            if (err)
                res.send(err);
            
            res.json(team);
        });

    },
    
    addToTournament : function(req, res, next){
        
        Tournament.findById(req.params.tournament_id, function(err, tournament) {
            if (err)
                res.send(err);
            
            var t = [];

            for(var i = 0; i < req.body.teams.length; i++){
                var team = new Team();
                team.teamName = req.body.teams[i].teamName;
                team.nbPlayer = req.body.teams[i].nbPlayer;
                t.push(team);
            }  
            
            tournament.teams.concat(t, function(err, teams){
                tournament.save(function(err){
                    if(err)
                        console.log(err);
                    res.json(teams);
                });
            });
            
        });
        
    }
    
}