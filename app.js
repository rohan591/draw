/**
 * Module dependencies.
 */

/*
var express = require('express'),
  app = express(),
  http = require('http'),
  server = http.createServer(app),
  socket = require('socket.io'),
  io = socket.listen(server);
*/

// Express requires these dependencies
var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();

// Configure our application
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

// SESSIONS
app.use(express.cookieParser());
app.use(express.session({secret: 'secret', key: 'express.sid'}));

// DEV MODE
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// PRODUCTON MODE
app.configure('production', function(){
  app.use(express.errorHandler());
});

// ROUTES
app.get('/', function(req, res){
  res.render('index', {
    title: 'title'
  });
});

// LISTEN FOR REQUESTS
// Enable Socket.io
var server = http.createServer(app).listen( app.get('port') );
var io = require('socket.io').listen( server );

// SOCKET IO
var active_connections = 0;
io.sockets.on('connection', function (socket) {

  active_connections++

  io.sockets.emit('user:connect', active_connections);

  socket.on('disconnect', function () {
    active_connections--
    io.sockets.emit('user:disconnect', active_connections);
  });

  // EVENT: User stops drawing something
  socket.on('draw:progress', function (uid, co_ordinates) {
    
    io.sockets.emit('draw:progress', uid, co_ordinates)

  });

  // EVENT: User stops drawing something
  socket.on('draw:end', function (uid, co_ordinates) {
    
    io.sockets.emit('draw:end', uid, co_ordinates)

  });
  
});


