var configuration = require('../config/configuration');

module.exports = {
    
    basicAuth : function(req, res, next) {
        var apikey = req.body.apikey || req.params.apikey;
        
        if(apikey == configuration.secretKey)
            next();
        else
            res.json({status : '400', message : 'Failed to authenticate'});
    },
    
  /**
  * This function will be executing before route
  * /!\ WARNING /!\
  * -----
  * Don't set header in this function
  * -----
  */
  beforeRoute: function(req, res, next) {
    console.log("Before route");
  },

  /**
  * This function will be executing after route
  * /!\ WARNING /!\
  * -----
  * If you already wrote header in your route it will not be executing
  * -----
  */
  afterRoute: function(req, res) {
    res.json({message: 'after route'});
  }
};