var is = require('is_js');

module.exports = {

  /**
  * Check what the user should be
  */
  check: function(req, route) {
    // TODO
    // =======
    // TESTER FONCTION DU TYPE AVEC IS_JS
    // => BOOLEAN
    // => STRING
    // => INTEGER
    // => FLOAT
    // => DATE

    var need = route.need;
    var user = req.user;

    for(var n in need) {
      // SWITCH
      if (typeof need[n] == 'boolean') {
        // Is user can and if the variable exist
        if (user[n] != need[n] && user[n])
          return false;
      }else {
        // It's not a boolean string
        if (user[n] != need[n] && user[n])
          return false;
      }
    }

    return true;
  },

  /**
  * Check Boolean
  */
  isBoolean: function() {

  },

  /**
  * Check Integer
  */
  isInteger: function() {

  },

  /**
  * Check String
  */
  isString: function() {

  },

  /**
  * Check Float
  */
  isFloat: function() {

  },

  /**
  * Check Date
  */
  isDate: function() {

  }

}