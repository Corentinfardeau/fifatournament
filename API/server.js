// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var gameCtrl = require('./controllers/gameController');
var leagueCtrl = require('./controllers/leagueController');
var playerCtrl = require('./controllers/playerController');
var teamCtrl = require('./controllers/teamController');

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

router.route('/team')

    // create a team
    .post(function(req, res) {
       teamCtrl.create(req, res);
    });

router.route('/player')

    // create a player
    .post(function(req, res) {
       playerCtrl.create(req, res);
    });


// all of our routes will be prefixed with /api
app.use('/api', router);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);