var gameObj = require('./static/shared/game_objects');


function Player(socket, paddleID) {
	this.socket = socket;
	this.paddleID = paddleID;
	this.score = 0;
	console.log('Creating player, paddleID ', paddleID)
	if (paddleID == 0) {
		this.paddle = new gameObj.Paddle(null, 50, 50, 10, 50);
	} else {
		this.paddle = new gameObj.Paddle(null, 650, 50, 10, 50);
	}
}

Player.prototype.getPaddleID = function() {
	return this.paddleID;
}
Player.prototype.getPaddle = function() {
	return this.paddle;
}
Player.prototype.addScore = function() {
	this.score += 1;
}
Player.prototype.getScore = function() {
	return this.score;
}

Player.prototype.onPaddleMovement = function(data) {
	this.paddle.setX(data.x);
	this.paddle.setY(data.y);
	this.socket.broadcast.emit('opponentmovement', {
		paddle: this.paddleID,
		x: this.paddle.getX(),
		y: this.paddle.getY()
	});
}
// Checks if the client paddle matches the server position
// for the paddle (to prevent cheating!)
Player.prototype.onSync = function() {

}

exports.Player = Player;