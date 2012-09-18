var http = require('http');
var express = require('express');
var socketio = require('socket.io');
var gameObj = require('./static/shared/game_objects');
var slots = require('./slots');
var logic = require('./game_logic');


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




var ball = new gameObj.Ball(null, 100, 50, -5, 6, 20, 20, 700, 500);
var padL = new gameObj.Paddle(null, 650, 50, 10, 50);
var padR = new gameObj.Paddle(null, 50, 50, 10, 50);
var padLId;
var padRId;
var running = false;

function loop() {
	if (! running) {
		return;
	}
	logic.moveBall(ball, padL, padR);
	var v = logic.checkVictory(ball);

	if ( v == 0) {
		var slot = slots.slotGetByPaddle(1);
		slot.addScore();
		sendScore();
		resetBall();
	} else if (v == 1 ) {
		var slot = slots.slotGetByPaddle(0);
		slot.addScore();
		sendScore();
		resetBall();
	} else {
		sio.sockets.emit('ballmovement', ball);
	}
}
setInterval(loop, 100);


sio.sockets.on('connection', function(socket) {
	//console.log('connection');

	var mySlot = slots.slotInsert(socket.id);
	socket.emit('assignedPaddle', {paddle: mySlot.getPaddle()});

	// 2 players? Run the game!
	if (slots.slotCount() == 2) {
		start();
	} else {
		pause();
	}
	
	// Each player sends their paddle movement to server
	// Check for some sort of speed hack should be implemented here
	socket.on('paddlemovement', function(data) {
		if (mySlot.paddle == 0) {
			padL.setX(data.x);
			padL.setY(data.y);
			//console.log('paddlemovement for left', data);
			socket.broadcast.emit('opponentmovement', {paddle: 0, 
				x: padL.getX(),
				y: padL.getY()});
		} else if (mySlot.paddle == 1) {
			padR.setX(data.x);
			padR.setY(data.y);
			//console.log('paddlemovement for right', data);
			socket.broadcast.emit('opponentmovement', {paddle: 1, 
				x: padR.getX(),
				y: padR.getY()});
		}
	});

	// When a player disconnects the game is paused
	// Next player joining will use the disconnected players
	// place
	socket.on('disconnect', function() {
		//console.log('client disconnected');
		
		slots.slotRemove(socket.id);
		pause();
	});


});

function resetBall() {
	ball.setX(350);
	ball.setY(250);
	ball.setVelX(Math.random()*10);
	ball.setVelY(Math.random()*10);

}

function pause() {
	running = false;
	sio.sockets.emit('statusUpdate', {running: false});
}

function start() {
	running = true;
	sio.sockets.emit('statusUpdate', {running: true});
}

function sendScore() {
	var score = slots.slotGetAllScores();
	sio.sockets.emit('scoreUpdate', score);
}


