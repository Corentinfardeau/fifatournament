// Set up ======================================================
var configPath      = './app/config/';				
var corePath        = './app/core/';		
var configuration   = require(configPath + 'configuration');
var app  			= require(corePath + 'expressConfig')(configuration);
var router 			= require('express').Router();
var requester 		= require(corePath + 'Newrequester');
var database 		= require(corePath + 'database');
var prefix 			= (configuration.apiPrefix) ? configuration.apiPrefix : '/';
var http 			= require('http');			
var pjson			= require('./package.json');		
var port     		= process.env.PORT || 8080;          
var io 				= require('socket.io');
var server;

// Configuration ==============================================
// ============================================================
// Database =================================================== 
database(configuration);

// Create server http =========================================
server = http.createServer(app).listen(port);

// Add Socket.io ==============================================
io = io.listen(server);
// Faire la connexion .on('connection') ici
// Envoyer socket à router

// Routing HTTP ===============================================
requester(router, io);

// Adding prefix for the api ==================================
app.use(prefix, router);

// Routing Socket.io =======================================
// require(configPath + 'routesSockets')(io.listen(server));

// Log when launch on the server ==============================
console.log('\x1b[34m%s\x1b[0m', "Server launch");
console.log('\x1b[32m%s\x1b[0m: ', "Your amazing app          :  " + pjson.name);
console.log('\x1b[32m%s\x1b[0m: ', "Creating by               :  " + pjson.author);
console.log('\x1b[32m%s\x1b[0m: ', "Runnig version            :  " + pjson.version);
console.log('\x1b[32m%s\x1b[0m: ', configuration.messageOnConsole + port);



