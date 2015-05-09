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
    
    addToTournament : function(req, res, next){

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
        
        Tournament.findById(req.params.tournament_id, function(err, tournament) {
            if (err)
                res.send(err);
            
            var players = req.body.players;
            var nbPlayers = req.body.players.length;
            var nbPlayersByTeam = tournament.nbPlayersByTeam;
            
            var nbTeamsComplete = (nbPlayers - (nbPlayers % nbPlayersByTeam))/nbPlayersByTeam;
            var nbPlayersLastTeam = nbPlayers - (nbPlayersByTeam*nbTeamsComplete);
            var playersLastTeam = [];
            var teams = [];
            var t = [];
            
            var playersShuffle = shuffleArray(players);
            
            //Create full team
            for (var i = 0 ; i < nbTeamsComplete ; i++){

                var playersId = [];

                for(var k =0; k < nbPlayersByTeam; k++){ 

                    playersId.push(players[playersShuffle.length-1]._id);
                    playersShuffle.pop();
                    
                }

                var team = new Team();
                team.nbPlayer = nbPlayersByTeam;
                team.teamName = "Nom d'équipe "+(i+1);
                team.players.push(playersId);
                teams.push(team);
            }
            
            // create last team
            if(nbPlayersLastTeam != 0){

                playersId = [];

                for(var i =0 ; i < nbPlayersLastTeam; i++){

                    playersLastTeam.push('');
                    playersId.push(playersShuffle[i]._id);

                }

                if(tournament.alea){
                    
                    var team = new Team();
                    team.nbPlayer = nbPlayersLastTeam;
                    team.teamName = "Nom d'équipe "+(teams.length+1);
                    team.players.push(playersId);
                    teams.push(team);
   
                }else{
                    
                    var team = new Team();
                    team.nbPlayer = nbPlayersLastTeam;
                    team.teamName = "Nom d'équipe "+(teams.length+1);
                    teams.push(team);

                }

                teams.push(team);
            }
            
            console.log(teams);
            
            tournament.teams.concat(teams, function(err, teams){
                if(err)
                    console.log(err);
                tournament.save(function(err){
                    if(err)
                        console.log(err);
                    res.json({teams : teams, tournament : tournament});
                });
                
            });
            
        });
        
    }
    
}