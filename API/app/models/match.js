var mongoose = require('mongoose');

var matchSchema = mongoose.Schema({
    
    'homeTeam' : String, //id of the home team
    'awayTeam' : String, //id of the away team
    'goalHomeTeam' : {type : Number, default : 0},
    'goalAwayTeam' : {type : Number, default : 0},
    'played' : {type : Boolean, default : false},
    'live' : {type : Boolean, default : false}
    
});

module.exports = mongoose.model('Match', matchSchema);