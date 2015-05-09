var mongoose = require('mongoose');

var matchSchema = mongoose.Schema({
    
    'homeTeam' : String, //id of the home team
    'awayTeam' : String, //id of the away team
    'goalHomeTeam' : 0,
    'goalAwayTeam' : 0,
    'played' : Boolean,
    'date' : Date
    
});

module.exports = mongoose.model('Match', matchSchema);