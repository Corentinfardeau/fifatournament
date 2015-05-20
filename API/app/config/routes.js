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
    
    /**
    * @api {POST} /tournament/create Create a new tournament
    * 
    * @apiVersion 0.0.1
    *
    * @apiParam (Parameters (object)) {String} Type Type of the tournament.
    * @apiParam (Parameters (object)) {Boolean} Public If true the tournament will be public
    * @apiParam (Parameters (object)) {Boolean} Alea If true the teams will be shuffle
    * @apiParam (Parameters (object)) {Number} nbPlayers The numbers of players in the tournament
    * @apiParam (Parameters (object)) {Number} nbPlayersByTeam The numbers of players by team in the tournament
    *
    * @apiName createTournament
    * @apiGroup Tournament
    *
    * @apiSuccess {Object} Tournament Create an empty tournament with all the properties.
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *         "token": "b94940",
    *         "nbPlayersByTeam": 2,
    *         "nbPlayers": 6,
    *         "_id": "555b2ac4490920a7b9000007",
    *         "teams": [],
    *         "players": []
    *     }
    */
    
    '/tournament/create' : {
        method: 'POST',
        controller: 'tournamentController',
        action : 'create'
    },
    
    /**
    * @api {GET} /tournament/:tournament_id Get a tournament
    *
    * @apiVersion 0.0.1
    *
    * @apiParam (Url parameters) {objectId} tournament_id tournament unique ID.
    *
    * @apiName getTournament
    * @apiGroup Tournament
    *
    * @apiSuccess {Object} Return the tournament.
    */
    
    '/tournament/:tournament_id' : {
        method: 'GET',
        controller: 'tournamentController',
        action : 'get'
    },
    
    /**
    * @api {GET} /tournament/:tournament_id/competition Get tournament's competition
    *
    * @apiVersion 0.0.1
    *
    * @apiParam (Url parameters) {objectId} tournament_id tournament unique ID.
    *
    * @apiName getTournamentCompetition
    * @apiGroup Tournament
    *
    * @apiSuccess {Object} Return the competition of the tournament.
    */
    
    '/tournament/:tournament_id/competition' : {
        method: 'GET',
        controller: 'tournamentController',
        action : 'getCompetition'
    },
    
    /**
    * @api {GET} /tournament/:tournament_id/teams Get tournament's teams
    *
    * @apiVersion 0.0.1
    *
    * @apiParam (Url parameters) {objectId} tournament_id tournament unique ID.
    *
    * @apiName getTournamentTeams
    * @apiGroup Tournament
    *
    * @apiSuccess {Object} Return an array of teams of the tournament.
    */
    
    '/tournament/:tournament_id/teams' : {
        method: 'GET',
        controller: 'tournamentController',
        action : 'getTeams'
    },
    
    /**
    * @api {GET} /tournament/join/:token Get a tournament
    *
    * @apiVersion 0.0.1
    *
    * @apiParam (Url parameters) {String} token tournament unique token.
    *
    * @apiName getTournamentByToken
    * @apiGroup Tournament
    *
    * @apiSuccess {Object} Return the tournament in function of the token.
    */
    
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
    
    /**
    * @api {POST} /league/create/:tournament_id Create a league
    *
    * @apiDescription The league created is automatically added to the tournament.
    *
    * @apiVersion 0.0.1
    *
    * @apiParam (Url parameters) {objectId} tournament_id tournament unique ID.
    *
    * @apiName createLeague
    * @apiGroup League
    *
    * @apiSuccess {Object} Return the empty league created.
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *         "tournament_id": "b94940",
    *         "_id": "555b3dd6df9638e2be000001",
    *         "returnLeg": [],
    *         "firstLeg": []
    *     }
    *
    *
    */
    
    '/league/create/:tournament_id' : {
        method: 'POST',
        controller: 'leagueController',
        action : 'addToTournament'
    },
    
    /**
    * @api {GET} /league/league_id get a league
    *
    * @apiVersion 0.0.1
    *
    * @apiParam (Url parameters) {objectId} league_id league unique ID.
    *
    * @apiName getLeague
    * @apiGroup League
    *
    * @apiSuccess {Object} Return the league.
    */
    
    '/league/:league_id' : {
        method: 'GET',
        controller: 'leagueController',
        action : 'get'
    },
    
    /**
    * @api {GET} /league/league_id/teams get the teams of a league
    *
    * @apiVersion 0.0.1
    *
    * @apiParam (Url parameters) {objectId} league_id league unique ID.
    *
    * @apiName getTeamsLeague
    * @apiGroup League
    *
    * @apiSuccess {Object} Return an array of teams of a league.
    */
    
    '/league/:league_id/teams' : {
        method: 'GET',
        controller: 'leagueController',
        action : 'getTeams'
    },
    
    /**
    * @api {GET} /league/league_id/ranking/:order_by get the ranking of a league
    *
    * @apiVersion 0.0.1
    *
    * @apiParam (Url parameters) {objectId} league_id league unique ID.
    * @apiParam (Url parameters) {string="classic"} order_by 
    *
    * @apiName getRankingLeague
    * @apiGroup League
    *
    * @apiSuccess {Object} Return an array of teams ordered by the given parameter.
    */
    
    '/league/:league_id/ranking/:order_by' : {
        method: 'GET',
        controller: 'leagueController',
        action : 'ranking'
    },
    
    /**
    *
    *   TEAM
    *
    **/
    
    
    /**
    * @api {POST} /team/create/:tournament_id create teams
    *
    * @apiVersion 0.0.1
    *
    * @apiParam (Parameters (object)) {Object} nbPlayers It's an object with the number of player. 
    * @apiParam (Url parameters) {objectId} tournament_id tournament unique ID.
    *
    * @apiName createTeams
    * @apiGroup Team
    *
    * @apiSuccess {Array} Teams Return an array with all the teams created 
    *
    */
    
    '/team/create/:tournament_id' : {
        method: 'POST',
        controller: 'teamController',
        action : 'addToTournament'
    },
        
    /**
    * @api {GET} /team/:team_id get a team
    *
    * @apiVersion 0.0.1
    *
    * @apiParam (Url parameters) {objectId} team_id team unique ID.
    *
    * @apiName getTeam
    * @apiGroup Team
    *
    * @apiSuccess {Object} Return the team with all properties.
    */
    
    '/team/:team_id' : {
        method: 'GET',
        controller: 'teamController',
        action : 'get'
    },
    
    /**
    * @api {GET} /team/:team_id/players get a players team
    *
    * @apiVersion 0.0.1
    *
    * @apiParam (Url parameters) {objectId} team_id team unique ID.
    *
    * @apiName getTeamsPlayer
    * @apiGroup Team
    *
    * @apiSuccess {Object} Players Return an array of players. Player is an object.
    *
    */
    
    '/team/:team_id/players' : {
        method: 'GET',
        controller: 'teamController',
        action : 'getPlayers'
    },
    
    
    /**
    * @api {GET} /team/update/:team_id update team
    *
    * @apiVersion 0.0.1
    *
    * @apiParam (Url parameters) {objectId} team_id team unique ID.
    *
    * @apiName updateTeam
    * @apiGroup Team
    *
    * @apiSuccess {Object} Team return the team.
    *
    */
    
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
    
    /**
    * @api {POST} /player/create/:tournament_id create player
    *
    * @apiVersion 0.0.1
    *
    * @apiParam (Url parameters) {objectId} tournament_id tournament unique ID.
    *
    * @apiName createPlayer
    * @apiGroup Player
    *
    * @apiSuccess {Object} Team return the team.
    *
    */
    
    '/player/create/:tournament_id' : {
        method: 'POST',
        controller: 'playerController',
        action : 'addToTeams'
    },
    
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
       
    /**
    *
    *   MATCH
    *
    **/
    
    '/matchs/create/:league_id' : {
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