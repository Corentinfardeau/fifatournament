// Load Middleware
var Middleware    = require('../middleware/middleware');
var routes        = require('../config/routes');

var requester = {
  createRoute: function(router, path, route, io) {
    // Add socket;
    this.io = io;

    // Express Rouyter
    this.router = router;

    // Config router
    this.route  = route;

    // Adding path in route object
    this.route.path = path;

    // Check the method
    this.checkMethod();

    // Check middlewares
    this.checkMiddleware();

    // Add controller
    this.route.controller = (typeof this.route.action == 'function') ? null : require('../controllers/'+this.route.controller);

    this.initRouter();
  },

  hasController: function(route) {
    return (route.controller) ? true : false;
  },

  checkMethod: function() {
    var method = this.route.method
      ? this.route.method.toLowerCase()
      : 'get';

    if (['get', 'post', 'put', 'delete'].indexOf(method) > -1)
      return method;
    else
      return 'get';
  },

  checkParameter: function(req, res, route) {
    var parameters = route.parameters;

    var missing = {
      message:'Bad request : Missing parameters';
      status : 400;
    };

    if (parameters) {
      var params = [];
      for(var p in parameters) {
          if(!req.body[parameters[p]]) { params.push(parameters[p]); }
      }
      missing.parameters = (params.length > 0) ? params : false;
    }

    if (missing.parameters) {
      res.json(missing);
      return false;
    }

    return true;
  },

  checkMiddleware: function() {
    if(this.route.middlewares) {
            for(m in this.route.middlewares) {
                this.route.middlewares[m] = Middleware[this.route.middlewares[m]];
            }
        }else { this.route.middlewares = []; }

        if(this.route.auth) { this.addAuth(); }

        return this.route.middlewares;
  },

  checkNeed: function(req, res, route) {
    var need = route.need;
    var user = req.user;

    for(var n in need) {
      if(typeof need[n] == 'boolean') {
        // Is user can and if the variable exist
        if(user[n] != need[n] || user[n]){
          res.status(400).send({ status: 400, message: "You d'ont have permissions." });
              return false;
        }
      }else {
        // Couper la string
        // Récuperer les 2 premiers mots
        // First time --> Just a simple string --> Use a module for next !!!
        if(user[n] != need[n] || !user[n]){
          res.status(400).send({ status: 400, message: "You d'ont have permissions." });
              return false;
        }
      }
    }

    return true;
  },

  addAuth: function() {
    this.route.middlewares.unshift(Middleware['auth']);
  },

  callBeforeRoute: function(req, res, next) {
    Middleware.beforeRoute(req, res, next);
  },

  callAfterRoute: function(req, res) {
    Middleware.afterRoute(req, res);
  },

  useSocket: function(route) {
    return (route.socket) ? true : false;
  },

  sendSocket: function(io, route, req) {
    io.sockets.emit(route.method + ' ' + route.path, req.socketData);
    io.sockets.emit(route.method + ' ' + req.url, req.socketData);
    console.log('Socket sur : (' + route.method + ' ' + route.path + ')');
    console.log('Socket sur : (' + route.method + ' ' + req.url + ')');
  },

  initRouter: function() {
    var self = this;

    var routing = function(router, route) {
      // Lauch router here
      router[route.method](route.path, route.middlewares, function(req, res, next) {

        // Check necessary parameters
        var p = self.checkParameter(req, res, route);
        if(!p) return false;

        // Check need
        var n = self.checkNeed(req, res, route);
        if(!n) return false;

        // Launch before route
        self.callBeforeRoute();

        // Add route infos in the request
        req.routeInfos = route;

        // Launch the right method from the righr controller
        if(self.hasController(route)) {
          route.controller[route.action](req, res, function(req, res) {
            if(!res.headersSent) { self.callAfterRoute(req, res); }
            if(self.useSocket(route)) { self.sendSocket(self.io, route, req); }
          });
        }else {
          route.action(req, res, function(req, res) {
            if(!res.headersSent) { self.callAfterRoute(req, res); }
            if(self.useSocket(route)) { self.sendSocket(self.io, route, req); }
          });
        }

      });
    }
    routing(this.router, this.route);

  }
};

module.exports = function(router, io) {

  if(routes['default']) {
    // Init Default
    // Requester.initDefautl();
  }
  for(var r in routes) {
    if(r != 'default') {
      requester.createRoute(router, r, routes[r], io);
    }
    }

    router.all('*', function(req, res, next) {
      res.status(404).send({ status: 404, message: 'No ressources find. Please read the doc.' });
    });
}