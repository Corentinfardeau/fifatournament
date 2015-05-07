module.exports = {
	
	/**
	* Check necessary parameters
	*/
	check: function(req, route) {
	  var parameters = route.parameters;
	  var params = [];

	  if (parameters) {
	    for(var p in parameters) {
	      if(!req.body[parameters[p]]) { return false; }
	    }
	  }
	  return true;
	}

}