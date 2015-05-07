var Game = require('../models/game.js');

module.exports = {
    create : function(req, res, next) {
        res.json({status : 'test', message : 'ok'});
    }
}