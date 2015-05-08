var mongoose = require('mongoose');
require('mongo-relation');
var Team = require('../models/team.js');

var tournamentSchema = mongoose.Schema({
    
    'name' : { type: String, default: 'Untitled' },
    'password' : String,
    'type' : String,
    'alea' : Boolean,
    'nbPlayersByTeam' : {type : Number, required: true},
    'teams' : [mongoose.Schema.ObjectId]
});

tournamentSchema.hasMany('Team');

module.exports = mongoose.model('Tournament', tournamentSchema);