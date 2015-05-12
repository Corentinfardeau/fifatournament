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
      //middlewares : ['basicAuth']
  },

  // REST API ---------------------------------------------------------------------
  // BASE ROUTE =======================
  '/': {
    action: function(req, res) {
      res.json({message: 'Welcome on our Api', status: 200});
    }
  },

  // REQUEST AUTHENTCATION ROUTE =======================

    /**
    *
    *   TOURNAMENT
    *
    **/
    
    '/tournament/create' : {
        method: 'POST',
        controller: 'tournamentController',
        action : 'create'
    },

    '/tournament/:tournament_id/teams' : {
        method: 'GET',
        controller: 'tournamentController',
        action : 'getTeams'
    },
    
    '/tournament/:tournament_id/competition' : {
        method: 'GET',
        controller: 'tournamentController',
        action : 'getCompetition'
    },
    
    '/tournament/:tournament_id' : {
        method: 'GET',
        controller: 'tournamentController',
        action : 'get'
    },
    
    '/tournament/join/:token' : {
        method: 'GET',
        controller: 'tournamentController',
        action : 'join'
    },
    
    /**
    *
    *   TYPE = LEAGUE
    *
    **/
    
    '/league/add/:tournament_id' : {
        method: 'POST',
        controller: 'leagueController',
        action : 'addToTournament'
    },
    
    '/league/:league_id' : {
        method: 'GET',
        controller: 'leagueController',
        action : 'get'
    },
    
    '/league/:league_id/teams' : {
        method: 'GET',
        controller: 'leagueController',
        action : 'getTeams'
    },
    
    /**
    *
    *   TEAM
    *
    **/
    
    '/team/add/:tournament_id' : {
        method: 'POST',
        controller: 'teamController',
        action : 'addToTournament'
    },
    
    '/team/:team_id' : {
        method: 'GET',
        controller: 'teamController',
        action : 'get'
    },
    
    '/team/:team_id/players' : {
        method: 'GET',
        controller: 'teamController',
        action : 'getPlayers'
    },
    
    '/team/update/:team_id' : {
        method: 'POST',
        controller: 'teamController',
        action : 'update'
    },
    
    /**
    *
    *   PLAYER
    *
    **/
    
    '/player/:player_id' : {
        method: 'GET',
        controller: 'playerController',
        action : 'get'
    },
    
    '/player/update/:player_id' : {
        method: 'POST',
        controller: 'playerController',
        action : 'update'
    },
    
    '/player/add/:tournament_id' : {
        method: 'POST',
        controller: 'playerController',
        action : 'addToTeams'
    },
       
    /**
    *
    *   MATCH
    *
    **/
    
    '/matchs/add/:league_id' : {
        method: 'POST',
        controller: 'matchController',
        action : 'addToLeague'
    },
    
    '/match/:match_id' : {
        method: 'GET',
        controller: 'matchController',
        action : 'get'
    },
    
    '/match/update/:match_id' : {
        method: 'POST',
        controller: 'matchController',
        action : 'update'
    }

};