module.exports = {
  /**
  * Send the token and the user authenticate
  */
  login: function(req, res) {
    res.json({status : 200, token : req.token, user : req.user});
  }
};