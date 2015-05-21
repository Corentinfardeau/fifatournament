var mongoose = require('mongoose');
require('mongo-relation');
var Team = require('../models/team.js');

var tournamentSchema = mongoose.Schema({
    
    'public' : { type: Boolean, default: false },
    'token' : { type : String, required : true },
    'password' : String,
    'type' : String,
    'random' : Boolean,
    'competition_id' : String,
    'nbPlayersByTeam' : {type : Number, required: true},
    'nbPlayers' : {type : Number, required: true},
    'players' : [mongoose.Schema.ObjectId],
    'teams' : [mongoose.Schema.ObjectId]
});

tournamentSchema.hasMany('Player');
tournamentSchema.hasMany('Team');

module.exports = mongoose.model('Tournament', tournamentSchema);