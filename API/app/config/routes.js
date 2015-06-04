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
    * @apiSuccess {Object} Tournament Return an empty tournament with all the properties.
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
    * @apiParam (Url parameters) {objectId} tournament_id Tournament unique ID.
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
    * @apiDescription A competition can be a league or a cup. This method let you find the competition of a tournament.
    *
    * @apiVersion 0.0.1
    *
    * @apiParam (Url parameters) {objectId} tournament_id Tournament unique ID.
    *
    * @apiName getTournamentCompetition
    * @apiGroup Tournament
    *
    * @apiSuccess {Object} Competition Return the competition of the tournament (league / cup).
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
    * @apiParam (Url parameters) {objectId} tournament_id Tournament unique ID.
    *
    * @apiName getTournamentsTeams
    * @apiGroup Tournament
    *
    * @apiSuccess {Object} Teams Return an array of teams of the tournament.
    */
    
    '/tournament/:tournament_id/teams' : {
        method: 'GET',
        controller: 'tournamentController',
        action : 'getTeams'
    },
    
    /**
    * @api {GET} /tournament/join/:token Get a tournament by token
    *
    * @apiDescription Let you find a tournament by the token of six numbers generate at the creation of the tournament.
    *
    * @apiVersion 0.0.1
    *
    * @apiParam (Url parameters) {String} token Tournament unique token.
    *
    * @apiName getTournamentByToken
    * @apiGroup Tournament
    *
    * @apiSuccess {Object} Tournament Return the tournament in function of the token.
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
    * @apiDescription The league created is automatically added to the tournament. You need to have created the tournament before.
    *
    * @apiVersion 0.0.1
    *
    * @apiParam (Url parameters) {objectId} tournament_id ID of the tournament where we want to insert the competition : league .
    *
    * @apiName createLeague
    * @apiGroup League
    *
    * @apiSuccess {Object} League Return the empty league just created.
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *         "tournament_id": "555b3dd6df9638e2be000016",
    *         "_id": "555b3dd6df9638e2be000001",
    *         "returnLeg": [],
    *         "firstLeg": []
    *     }
    *
    */
    
    '/league/create/:tournament_id' : {
        method: 'POST',
        controller: 'leagueController',
        action : 'addToTournament'
    },
    
    /**
    * @api {GET} /league/league_id Get a league
    *
    * @apiVersion 0.0.1
    *
    * @apiParam (Url parameters) {objectId} league_id League unique ID.
    *
    * @apiName getLeague
    * @apiGroup League
    *
    * @apiSuccess {Object} League Return the league.
    */
    
    '/league/:league_id' : {
        method: 'GET',
        controller: 'leagueController',
        action : 'get'
    },
    
    /**
    * @api {GET} /league/league_id/teams Get teams' league
    *
    * @apiVersion 0.0.1
    *
    * @apiParam (Url parameters) {objectId} league_id League unique ID.
    *
    * @apiName getTeamsLeague
    * @apiGroup League
    *
    * @apiSuccess {Array} Teams Return an array of teams' league.
    */
    
    '/league/:league_id/teams' : {
        method: 'GET',
        controller: 'leagueController',
        action : 'getTeams'
    },
    
    /**
    * @api {GET} /league/league_id/ranking/:order_by Get the ranking of a league
    *
    * @apiVersion 0.0.1
    *
    * @apiParam (Url parameters) {objectId} league_id League unique ID.
    * @apiParam (Url parameters) {string="classic"} order_by Parameter for ordered the ranking.
    *
    * @apiName getRankingLeague
    * @apiGroup League
    *
    * @apiSuccess {Array} Teams Return an array of teams ordered by the given parameter.
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
    * @api {POST} /team/create/:tournament_id Create teams
    *
    * @apiDescription Create teams and add them to the tournament. You need to have created the tournament before.
    * @apiVersion 0.0.1
    *
    * @apiParam (Url parameters) {objectId} tournament_id Tournament unique ID.
    * @apiParam (Parameters (object)) {Object} nbPlayers Object with the number of player. 
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
    * @api {GET} /team/:team_id Get a team
    *
    * @apiVersion 0.0.1
    *
    * @apiParam (Url parameters) {objectId} team_id Team unique ID.
    *
    * @apiName getTeam
    * @apiGroup Team
    *
    * @apiSuccess {Object} Team Return the team.
    */
    
    '/team/:team_id' : {
        method: 'GET',
        controller: 'teamController',
        action : 'get'
    },
    
    /**
    * @api {GET} /team/:team_id/players Get team players
    *
    * @apiVersion 0.0.1
    *
    * @apiParam (Url parameters) {objectId} team_id Team unique ID.
    *
    * @apiName getTeamPlayers
    * @apiGroup Team
    *
    * @apiSuccess {Array} Players Return an array of players ID.
    *
    */
    
    '/team/:team_id/players' : {
        method: 'GET',
        controller: 'teamController',
        action : 'getPlayers'
    },
    
    
    /**
    * @api {POST} /team/update/:team_id Update a team
    *
    * @apiVersion 0.0.1
    *
    * @apiParam (Url parameters) {objectId} team_id Team unique ID.
    *
    * @apiParam (Parameters (object)) {String} teamName Update team's name.
    * @apiParam (Parameters (object)) {Number} played Number of played matchs.
    * @apiParam (Parameters (object)) {Number} won Number of won matchs.
    * @apiParam (Parameters (object)) {Number} lost Number of lost matchs.
    * @apiParam (Parameters (object)) {Number} drawn Number of drawn matchs.
    * @apiParam (Parameters (object)) {Number} gf Number of goal scored by the team.
    * @apiParam (Parameters (object)) {Number} ga Number of goal scored against the team.
    * @apiParam (Parameters (object)) {Number} gd Difference of gf and ga.
    * @apiParam (Parameters (object)) {Number} pts Number of points.
    * @apiParamExample {json} Request-Example:
    *
    *   {
    *       teamName : "FC Nantes",
    *       played : 3,
    *       won : 2,
    *       drawn : 0,
    *       lost : 1,
    *       gf : 10,
    *       ga : 3,
    *       gd : 7,
    *       pts : 6
    *   }
    *
    * @apiName updateTeam
    * @apiGroup Team
    *
    * @apiSuccess {Object} Team Return the team updated. 
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
    * @api {POST} /player/create/:tournament_id Create players
    *
    * @apiVersion 0.0.1
    * @apiDescription Create all the players and insert them to the tournament and the teams. You need to have created the teams and the tournament before.
    *
    * @apiParam (Url parameters) {objectId} tournament_id ID of the tournament where we want to add the players.
    * @apiParam (Parameters (object)) {Object} players Object which contains an array with all the name.
    * @apiParamExample {json} Request-Example:
    *
    *   {
    *       players : [
    *           "Corentin",
    *           "Damien",
    *           "Florian",
    *           "Valentin",
    *           "Benjamin",
    *           "Jean"
    *       ]
    *   }
    *
    * @apiName createPlayers
    * @apiGroup Player
    *
    * @apiSuccess {Array} Players Return all the players created.
    *
    */
    
    '/player/create/:tournament_id' : {
        method: 'POST',
        controller: 'playerController',
        action : 'addToTeams'
    },
    
    /**
    * @api {GET} /player/:player_id Get a player
    *
    * @apiVersion 0.0.1
    *
    * @apiParam (Url parameters) {objectId} player_id Player unique ID.
    *
    * @apiName getPlayer
    * @apiGroup Player
    *
    * @apiSuccess {Object} Player Return the player.
    *
    */
    
    '/player/:player_id' : {
        method: 'GET',
        controller: 'playerController',
        action : 'get'
    },
    
    /**
    * @api {POST} /player/update/:player_id Update a player
    *
    * @apiVersion 0.0.1
    *
    * @apiParam (Url parameters) {objectId} player_id Player unique ID.
    * @apiParam (Parameters (object)) {String} playerName Update player's name.
    * @apiParam (Parameters (object)) {Number} nbGoal Ppdate player's number of goals.
    * @apiParamExample {json} Request-Example:
    *
    *   {
    *       playerName : "Corentin",
    *       nbGoal : 2
    *   }
    *   
    * @apiName updatePlayer
    * @apiGroup Player
    *
    * @apiSuccess {Object} Player Return the player updated.
    *
    */
    
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
    
    
    /**
    * @api {POST} /matchs/create/:league_id Create matchs' league
    *
    * @apiVersion 0.0.1
    * @apiDescription You need to have created the league and teams before.
    *
    * @apiParam (Url parameters) {objectId} league_id League unique ID.
    * @apiParam (Parameters (object)) {Object} teams Object which contains an array with all the teams created before.
    *
    * @apiName createMatchsLeague
    * @apiGroup Match
    *
    * @apiSuccess {Object} Macths Return the league with all the matchs ID added.
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "firstLeg": ['555b2ac4490920a7b9000007','555b2ac4490920a7b9000002'],
    *       "returnLeg": ['555b2ac4490920a7b9000002','555b2ac4490920a7b9000007']
    *     }
    *
    */
    
    '/matchs/create/:league_id' : {
        method: 'POST',
        controller: 'matchController',
        action : 'addToLeague'
    },
    
    /**
    * @api {GET} /match/:match_id Get a match
    *
    * @apiVersion 0.0.1
    *
    * @apiParam (Url parameters) {objectId} match_id Match unique ID.
    *
    * @apiName getMatch
    * @apiGroup Match
    *
    * @apiSuccess {Object} Match Return the match.
    *
    */
    
    '/match/:match_id' : {
        method: 'GET',
        controller: 'matchController',
        action : 'get'
    },
    
    /**
    * @api {POST} /match/update/:match_id Update a match
    *
    * @apiVersion 0.0.1
    *
    * @apiParam (Url parameters) {objectId} match_id Player unique ID.
    * @apiParam (Parameters (object)) {Boolean} played Match is played or not.
    * @apiParam (Parameters (object)) {Number} goalHomeTeam Number of homeTeam's goal.
    * @apiParam (Parameters (object)) {Number} goalAwayTeam Number of awayTeam's goal.
    *
    * @apiParamExample {json} Request-Example:
    *
    *   {
    *       played : true,
    *       goalHomeTeam : 1,
    *       goalAwayTeam : 2,
    *   }
    *   
    * @apiName updateMatch
    * @apiGroup Match
    *
    * @apiSuccess {Object} Match Return the match updated.
    *
    */
    
    '/match/update/:match_id' : {
        method: 'POST',
        controller: 'matchController',
        action : 'update'
    }

};