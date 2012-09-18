
function Ball(context, x, y, vx, vy, width, height, boardWidth, boardHeight) {
	this.context = context;
	this.x = x;
	this.y = y;
	this.velocityX = vx;
	this.velocityY = vy;
	this.width  = width;
	this.height = height;
	this.boardWidth = boardWidth;
	this.boardHeight = boardHeight;
}

Ball.prototype.draw = function() {
	this.context.fillStyle = '#ff0';
	this.context.fillRect(this.x, this.y, this.width, this.height);
}
Ball.prototype.move = function(x, y) {
	this.x += x;
	this.y += y;

	// Basic collision detection for the top and bottom edges
	if ( this.y < 0) {
		this.velocityY = -this.velocityY;
		this.y -= y;
	}
	if ( (this.y+10) > this.boardHeight) {
		this.velocityY = -this.velocityY;
		this.y -= y;
	}
}
Ball.prototype.getX = function() { return this.x; }
Ball.prototype.getY = function() { return this.y; }
Ball.prototype.setX = function(x) { this.x = x; }
Ball.prototype.setY = function(y) { this.y = y; }
Ball.prototype.getW = function() { return this.width; }
Ball.prototype.getH = function() { return this.height; }
Ball.prototype.getVelX = function() { return this.velocityX; }
Ball.prototype.getVelY = function() { return this.velocityY; }
Ball.prototype.setVelX = function(velX) { this.velocityX = velX; }
Ball.prototype.setVelY = function(velY) { this.velocityY = velY; }

function Paddle(context, x, y, width, height) {
	this.context = context;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

Paddle.prototype.draw = function() {
	this.context.fillStyle = '#fff';
	this.context.fillRect(this.x, this.y, this.width, this.height);
}
Paddle.prototype.move = function(x, y) {
	this.x += x;
	this.y += y;

	if( this.y < 0) {
		this.y -= y;
	}
	if( (this.y+50) > height) {
		this.y -= y;
	}
}

Paddle.prototype.getX = function() { return this.x; }
Paddle.prototype.getY = function() { return this.y; }
Paddle.prototype.setX = function(x) { this.x = x; }
Paddle.prototype.setY = function(y) { this.y = y; }
Paddle.prototype.getW = function() { return this.width; }
Paddle.prototype.getH = function() { return this.height; }

if (!(typeof process === 'undefined' || !process.versions)) {
	exports.Paddle = Paddle;
	exports.Ball = Ball;
}