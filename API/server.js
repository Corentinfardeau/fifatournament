// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var gameCtrl = require('./controllers/gameController');
var leagueCtrl = require('./controllers/leagueController');
var playersCtrl = require('./controllers/playerController');
var teamsCtrl = require('./controllers/teamController');
var clubsCtrl = require('./controllers/clubsController');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

router.get('/', function(req, res) {
    res.json({ message: 'API fifatournament' });   
});

router.route('/game')

    // create a game
    .post(function(req, res) {
        gameCtrl.create(req, res);
    });

router.route('/league')

    // create a league
    .post(function(req, res) {
       leagueCtrl.create(req, res);
    });

router.route('/teams')

    // create a team
    .post(function(req, res) {
       teamsCtrl.create(req, res);
    });

router.route('/players')

    // create a player
    .post(function(req, res) {
       playersCtrl.create(req, res);
    });

router.route('/clubs')

    // get all clubs
    .get(function(req, res) {
       clubsCtrl.getAll(req, res);
    });

router.route('/clubs/:nb_stars')

    // get clubs by number of stars
    .get(function(req, res) {
       clubsCtrl.getClubsByStars(req, res);
    });


// all of our routes will be prefixed with /api
app.use('/api', router);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);