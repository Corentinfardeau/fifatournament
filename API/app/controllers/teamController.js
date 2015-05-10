require('mongo-relation');
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
            if (err)
                res.send(err);
            
            team.players.find(function(err, players){
                if(err)
                    res.send(err);
                res.json({team : team, players : players});
            }); 
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
                    res.json({teams : teams, tournament : tournament});
                });
            });  
        };
        
        function createTeams(tournament){

            var nbPlayers = req.body.players.length;
            var nbPlayersByTeam = tournament.nbPlayersByTeam;
            var nbTeamsComplete = (nbPlayers - (nbPlayers % nbPlayersByTeam))/nbPlayersByTeam;
            var nbPlayersLastTeam = nbPlayers - (nbPlayersByTeam*nbTeamsComplete);
            var teams = [];
            
            //Create full team
            for (var i = 0 ; i < nbTeamsComplete ; i++){
                var team = new Team();
                team.nbPlayers = nbPlayersByTeam;
                team.teamName = "Nom d'équipe "+(i+1);  
                teams.push(team);
            }
            
            // create last team
            if(nbPlayersLastTeam != 0){

                var team = new Team();
                team.nbPlayer = nbPlayersLastTeam;
                team.teamName = "Nom d'équipe "+(teams.length+1);
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