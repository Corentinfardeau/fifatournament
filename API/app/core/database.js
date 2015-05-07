var mongoose = require('mongoose');

module.exports = function(configuration) {

  var o = {
    user: configuration.dbUser,
    pass: configuration.dbPassword
  };

  mongoose.connect(configuration.dbHost + configuration.dbName, o);
};