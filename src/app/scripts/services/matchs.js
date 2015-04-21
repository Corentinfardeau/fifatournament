'use strict';

angular.module('fifatournament')

	.service('Matchs', function matchs() {
    
    this.setTeamsGoal = function(idMatch, idTeam, idTeamVS, league, matchsType) {
        
        if(matchsType === 'firstLeg'){
            league.firstLeg[idMatch][idTeam].stats.gf++;
            league.firstLeg[idMatch][idTeamVS].stats.ga++;
        }else{
            league.returnLeg[idMatch][idTeam].stats.gf++;
            league.returnLeg[idMatch][idTeamVS].stats.ga++;
        }
        
        return league;
        
    };
    
    this.setPlayerGoal = function(player, teams) {
        
        var nbGoal = player.nbGoal+1;
        for(var i = 0; i < teams.length; i++ ){
            for(var j = 0; j < teams[i].playersName.length; j++){
                if(teams[i].playersName[j].name === player.name){
                    teams[i].playersName[j].nbGoal += nbGoal;
                }  
            }
        }
        
        return teams;
        
    };
    
    this.setTeamStats = function(type, league, state, teams) {
        
            var name0 = league[type][state][0].name;
			var name1 = league[type][state][1].name;
			var b0 = league[type][state].b0;
			var b1 = league[type][state].b1;

			for(var i = 0; i < teams.length; i++) {
				if(teams[i].name === name0) {
					teams[i].stats.gf += b0;
					teams[i].stats.ga += b1;
					teams[i].stats.gd += b0 - b1;
					teams[i].stats.played++;

					if(b0 > b1) {
						teams[i].stats.won++;
						teams[i].stats.pts += 3;
					} else if(b0 < b1) {
						teams[i].stats.lost++;
					} else {
					teams[i].stats.drawn++;
						teams[i].stats.pts += 1;
					}
				}
				else if(teams[i].name === name1) {
					teams[i].stats.gf += b1;
					teams[i].stats.ga += b0;
					teams[i].stats.gd += b1 - b0;
					teams[i].stats.played++;

					if(b1 > b0) {
						teams[i].stats.won++;
						teams[i].stats.pts += 3;
					} else if(b1 < b0) {
						teams[i].stats.lost++;
					} else {
						teams[i].stats.drawn++;
						teams[i].stats.pts += 1;
					}
				}
			}
        
            return teams;
            
    
    };
    
  });
