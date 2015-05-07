var express        = require('express');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');

module.exports = function(configuration) {
  var app = express();

  // Log every request to the console if dev
  if (configuration.dev) app.use(morgan('dev'));

  // Set the static files location /public/img will be /img for users
  app.use(express.static(__dirname + configuration.publicDir));

  // Parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({'extended':'true'}));

  // Parse application/json
  app.use(bodyParser.json());

  // Parse application/vnd.api+json as json
  app.use(bodyParser.json({type: 'application/vnd.api+json'}));

  // For Delete and Put method
  app.use(methodOverride());

  return app;
};