var mongoose = require('mongoose');
require('mongo-relation');

var playerSchema = mongoose.Schema({
    
    'playerName' : String,
    'nbGoal' : {type:Number, default:0},
    'team' : mongoose.Schema.ObjectId
});

playerSchema.belongsTo('Team', {through: 'team'});

module.exports = mongoose.model('Player', playerSchema);