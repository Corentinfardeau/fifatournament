module.exports = {

  /**
  * Here your can configure your routes
  * This is a simple JSOM format
  * Each route is identify by its path like /books/:id
  * Then this object can specify a method for the route --> Default GET
  * There must have an action on each route
  * You can specify a controller where you action is define --> in ../controllers directory
  * You can specify middleware to use
  * You can specify if this route must be authenticate
  * You can specify if you want that this route send socket.
  * You can spaecify necessary parameters
  * You can specify what the user should have to be able to call the route
  **/


  default: {
      
  },

  // REST API ---------------------------------------------------------------------
  // BASE ROUTE =======================
  '/': {
    action: function(req, res) {
      res.json({message: 'Welcome on our Api', status: 200});
    }
  },

  // REQUEST AUTHENTCATION ROUTE =======================

    //TOURNAMENT
    '/tournament/create' : {
        method: 'POST',
        controller: 'tournamentController',
        action : 'create'
        //middlewares : ['basicAuth']
    },

    '/tournament/:tournament_id/teams' : {
        method: 'GET',
        controller: 'tournamentController',
        action : 'getTeams'
        //middlewares : ['basicAuth']
    },
    
    '/tournament/:tournament_id/competition' : {
        method: 'GET',
        controller: 'tournamentController',
        action : 'getCompetition'
        //middlewares : ['basicAuth']
    },
    
    '/tournament/:tournament_id' : {
        method: 'GET',
        controller: 'tournamentController',
        action : 'get'
        //middlewares : ['basicAuth']
    },
    
    '/tournament/join/:token' : {
        method: 'GET',
        controller: 'tournamentController',
        action : 'join'
        //middlewares : ['basicAuth']
    },
    
    //TYPE = LEAGUE
    '/league/add/:tournament_id' : {
        method: 'POST',
        controller: 'leagueController',
        action : 'addToTournament'
        //middlewares : ['basicAuth']
    },
    
    '/league/:league_id' : {
        method: 'GET',
        controller: 'leagueController',
        action : 'get'
        //middlewares : ['basicAuth']
    },
    
    '/league/:league_id/teams' : {
        method: 'GET',
        controller: 'leagueController',
        action : 'getTeams'
        //middlewares : ['basicAuth']
    },
    
    //TEAM
    '/team/add/:tournament_id' : {
        method: 'POST',
        controller: 'teamController',
        action : 'addToTournament'
        //middlewares : ['basicAuth']
    },
    
    '/team/:team_id' : {
        method: 'GET',
        controller: 'teamController',
        action : 'get'
        //middlewares : ['basicAuth']
    },
    
    '/team/:team_id/players' : {
        method: 'GET',
        controller: 'teamController',
        action : 'getPlayers'
        //middlewares : ['basicAuth']
    },
    
    '/team/update/:team_id' : {
        method: 'POST',
        controller: 'teamController',
        action : 'update'
        //middlewares : ['basicAuth']
    },
    
    //PLAYERS
    
    '/player/:player_id' : {
        method: 'GET',
        controller: 'playerController',
        action : 'get'
        //middlewares : ['basicAuth']
    },
    
    '/player/update/:player_id' : {
        method: 'POST',
        controller: 'playerController',
        action : 'update'
        //middlewares : ['basicAuth']
    },
    
    '/player/add/:tournament_id' : {
        method: 'POST',
        controller: 'playerController',
        action : 'addToTeams'
        //middlewares : ['basicAuth']
    },
        
    //MATCHS
    '/matchs/add/:league_id' : {
        method: 'POST',
        controller: 'matchController',
        action : 'addToLeague'
        //middlewares : ['basicAuth']
    },
    
    '/match/:match_id' : {
        method: 'GET',
        controller: 'matchController',
        action : 'get'
        //middlewares : ['basicAuth']
    },
    

};