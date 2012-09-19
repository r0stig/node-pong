var http = require('http');
var express = require('express');
var socketio = require('socket.io');
var gameObj = require('./static/shared/game_objects');
var slots = require('./slots');
var logic = require('./game_logic');
var gamePlayer = require('./player');


var app = express();
var server = http.createServer(app);
var sio = socketio.listen(server);


app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(require("stylus").middleware({
	    src: __dirname + "/static",
	    compress: true
	}));
	app.use(express.static(__dirname + '/static'));

});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', function(req, res) {
	res.render('canvas');
});

server.listen(3000, function() {
	console.log('http listening');

});


function Game() {
	this.ball = new gameObj.Ball(null, 100, 50, -5, 6, 20, 20, 700, 500);
	this.players = [];
	this.running = false;
	this.MAX_PLAYERS = 2;
	this.SPEED_UP_FACTOR = 1.2;

	setInterval(this.loop.bind(this), 100);

	// Find first open slot, returns -1 if no open slot
	// available
	this.findOpenSlot = function() {
		// TODO: Use function-global for paddles
		// (so it will be easy to extend with more paddles)
		var paddles = [0, 1];
		// Find free paddle
		for(var i = 0; i < this.players.length; ++i) {
			var index = paddles.indexOf(this.players[i].getPaddleID());
			if (index != -1) {
				paddles.splice(index, 1);
			}
		}
		return (paddles.length > 0 ? paddles[0] : -1);

	}
}
// Connect player, find free slot
// Send message to player with paddle
// Bind all socket events to functions
Game.prototype.playerConnected = function(socket) {
	var paddle = this.findOpenSlot();
	if (paddle == -1) {
		console.log('paddle == -1');
		return;
	}
	var player = new gamePlayer.Player(socket, paddle);
	this.players.push(player);

	socket.emit('assignedPaddle', {paddle: paddle});

	// 2 players? Run the game!
	if (this.players.length == this.MAX_PLAYERS) {
		this.start();
	} else {
		this.pause();
	}
	
	// Each player sends their paddle movement to server
	// Check for some sort of speed hack should be implemented here
	socket.on('paddlemovement', player.onPaddleMovement.bind(player));


	// When a player disconnects the game is paused
	// Next player joining will use the disconnected players
	// place
	socket.on('disconnect', (function() {
		this.playerDisconnected(socket)
	}).bind(this));
}

// Free slot, pause game
Game.prototype.playerDisconnected = function(socket) {
	//console.log(this);
	console.log('playerDisconnected');
	var index = -1;
	for (var i = 0; i < this.players.length; ++i) {
		if (this.players[i].socket.id == socket.id) {
			index = i;
			break;
		}
	}
	this.players.splice(index, 1);
	this.pause();
	//slots.slotRemove(socket.id);
	//pause();
}
// Reset the ball to the center position
Game.prototype.resetBall = function() {
	this.ball.setX(350);
	this.ball.setY(250);
	this.ball.setVelX(Math.random()*10);
	this.ball.setVelY(Math.random()*10);
}
// Start game
Game.prototype.start = function() {
	this.running = true;
	sio.sockets.emit('statusUpdate', {running: true});
}
// Pause game
Game.prototype.pause = function() {
	this.running = false;
	sio.sockets.emit('statusUpdate', {running: false});
}
Game.prototype.loop = function() {
	if (! this.running) {
		return;
	}
	this.moveBall();
	var v = this.checkVictory();

	if ( v != -1 ) {
		var player = this.players[v];
		player.addScore();
		this.sendScore();
		this.resetBall();
	} else {
		sio.sockets.emit('ballmovement', this.ball);
	}
}
Game.prototype.moveBall = function() {
	this.ball.move( this.ball.getVelX(), this.ball.getVelY());
	//console.log('ball move:', ball, ball.getX(), ball.getY());
	if ( logic.isColliding(this.players[0].getPaddle(), this.ball) || logic.isColliding(this.players[1].getPaddle(), this.ball)) {
		this.ball.setVelX( -(this.ball.getVelX()*this.SPEED_UP_FACTOR) );
	}
}
Game.prototype.checkVictory = function() {
	// Someone lost?
	if (this.ball.getX() < 0) {
		return 0;
	} else if (this.ball.getX() > 700) {
		return 1;
	} else {
		return -1;
	}
}
Game.prototype.sendScore = function() {
	var score = [];
	for (var i = 0; i < this.players.length; ++i) {
		score.push(this.players[i].getScore());
	}

	sio.sockets.emit('scoreUpdate', score);
}

var game = new Game();
sio.sockets.on('connection', game.playerConnected.bind(game));
