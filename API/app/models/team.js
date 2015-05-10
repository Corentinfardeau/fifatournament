var mongoose = require('mongoose');
require('mongo-relation');

var Player = require('../models/player.js');

var teamSchema = mongoose.Schema({
    
    'teamName' :  { type: String, default: 'Untitled' },
    'colors' : String,
    'played' : { type: Number, default: 0 },
    'won' : { type: Number, default: 0 },
    'drawn' : { type: Number, default: 0 },
    'lost' : { type: Number, default: 0 },
    'gf' : { type: Number, default: 0 },
    'ga' : { type: Number, default: 0 },
    'gd' : { type: Number, default: 0 },
    'pts' : { type: Number, default: 0 },
    'nbPlayers' : { type : Number, require : true},
    'players' : [mongoose.Schema.ObjectId],
    'tournament' : mongoose.Schema.ObjectId
});

teamSchema.belongsTo('Tournament', {through: 'tournament'});
teamSchema.hasMany('Player');

module.exports = mongoose.model('Team', teamSchema);