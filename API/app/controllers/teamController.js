require('mongo-relation');
var colors = require('../assets/JSON/colors.json');
var https = require('https');
var Team = require('../models/team.js');
var Tournament = require('../models/tournament.js');


module.exports = {
    
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
    
    getPlayers : function(req, res, next) {
        
        Team.findById(req.params.team_id, function(err, team) {
            if (err){
                res.send(err);
            }else{      
                team.players.find(function(err, players){
                    if(err){
                        res.send(err);
                    }else{
                        res.json(players);    
                    }
                }); 
            }
        });
        
    },
    
    update : function(req, res, next) {

        Team.findById(req.params.team_id, function(err, team) {
            if (err)
                res.send(err);
            if(req.body.teamName)
                team.teamName = req.body.teamName;
            if(req.body.played)
                team.played = req.body.played;
            if(req.body.won)
                team.won = req.body.won;
            if(req.body.lost)
                team.lost = req.body.lost;
            if(req.body.drawn)
                team.drawn = req.body.drawn;
            if(req.body.gf)
                team.gf = req.body.gf;
            if(req.body.ga)
                team.ga = req.body.ga;
            if(req.body.gd)
                team.gd = req.body.gd;
            if(req.body.pts)
                team.pts = req.body.pts;
            
            team.save(function(err){
                if(err)
                    console.error(err);
                console.log(team);
                res.json(team);  
            })
        });
    },
    
    addToTournament : function(req, res, next){
        
        function saveTeamsToTournament(teams, tournament){
            
            tournament.teams.concat(teams, function(err, teams){
                if(err)
                    console.log(err);
                tournament.save(function(err){
                    if(err)
                        console.log(err);
                    res.json(teams);
                });
            });  
        };
        
        function shuffle(array) {
            var currentIndex = array.length, temporaryValue, randomIndex ;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        }
        
        function createTeams(tournament){

            var nbPlayers = req.body.nbPlayers;
            var nbPlayersByTeam = tournament.nbPlayersByTeam;
            var nbTeamsComplete = (nbPlayers - (nbPlayers % nbPlayersByTeam))/nbPlayersByTeam;
            var nbPlayersLastTeam = nbPlayers - (nbPlayersByTeam*nbTeamsComplete);
            var colorsShuffle = shuffle(colors.colors);
            var teams = [];
            
            //Create full team
            for (var i = 0 ; i < nbTeamsComplete ; i++){
                var team = new Team();
                team.nbPlayers = nbPlayersByTeam;
                team.teamName = "Nom d'équipe "+(i+1);  
                team.color = colorsShuffle[i];
                teams.push(team);
            }
            
            // create last team
            if(nbPlayersLastTeam != 0){

                var team = new Team();
                team.nbPlayers = nbPlayersLastTeam;
                team.teamName = "Nom d'équipe "+(teams.length+1);
                var index = Math.random() * (colorsShuffle.length - 0) + 0;
                team.color = colorsShuffle[index];
                teams.push(team);
            }
            
            saveTeamsToTournament(teams, tournament);
        };
        
        Tournament.findById(req.params.tournament_id, function(err, tournament) {
            if (err)
                res.send(err);
            createTeams(tournament);
        });
    }
}