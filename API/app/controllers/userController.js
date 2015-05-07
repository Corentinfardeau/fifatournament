var User = require('../models/user');

module.exports = {

  /**
  * Get All todos
  */
  signup: function(req, res, next) {

    if (!req.body.username) {
      res.json({message: 'Missing credentials username'});
      return;
    }
    if (!req.body.password) {
      res.json({message: 'Missing credentials password'});
      return;
    }

    var user_send =  {
      username: req.body.username,
      password: req.body.password
    }

    User.findOne({username: user_send.username}, function(err, user) {
      if (err) throw err;
      if(user) {
        res.status(400).send({status: 400, message: "Username already exist"});
      }
      else {
        User.create(user_send, function(err, user) {
          if(err) throw err;
          res.json(user);
        });
      }
    });
  }

};