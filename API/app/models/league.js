var mongoose = require('mongoose');
require('mongo-relation');

var leagueSchema = mongoose.Schema({
    
    'firstLeg' : [String],
    'returnLeg' : [String],
    'tournament_id' : String
    
});

module.exports = mongoose.model('League', leagueSchema);