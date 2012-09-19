 

// Checks if some player has won, returns -1 for no win
// or the slot id for the player that is the winner
/*function checkVictory(ball) {
	// Someone lost?
	if (ball.getX() < 0) {
		return 0;
	} else if (ball.getX() > 700) {
		return 1;
	} else {
		return -1;
	}
}

function moveBall(ball, padL, padR) {
	ball.move( ball.getVelX(), ball.getVelY());
	//console.log('ball move:', ball, ball.getX(), ball.getY());
	if ( isColliding(padL, ball) || isColliding(padR, ball)) {
		ball.setVelX( -ball.getVelX() );
	}
}
*/

function isColliding(objA, objB) {
	var leftA = objA.getX()
		, rightA = objA.getX() + objA.getW()
		, topA = objA.getY()
		, bottomA = objA.getY() + objA.getH()

		, leftB = objB.getX()
		, rightB = objB.getX() + objB.getW()
		, topB = objB.getY()
		, bottomB = objB.getY() + objB.getH();

	if (bottomA <= topB) {
		return false;
	}
	if (topA >= bottomB) {
		return false;
	}
	if (rightA <= leftB) {
		return false;
	}
	if (leftA >= rightB) {
		return false;
	}

	return true;
}

//exports.checkVictory = checkVictory;
//exports.moveBall = moveBall;
exports.isColliding = isColliding;