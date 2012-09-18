//var can2 = document.getElementById('canvas2');
//var ctx2 = can2.getContext('2d');

var socket = io.connect('http://localhost');
/*socket.on('setimage', function(data) {
	console.log('got image data, putting on CTX2');
	console.log(data.data);
	var img = new Image();
	img.width = 500;
	img.height = 500;
	img.src = data.data;

	img.onload = function() {
		ctx2.drawImage(img, 0, 0, 500, 500);
	}
	
	//ctx2.putImageData((ImageData)data.data);
})	


function draw() {
	var can = document.getElementById('canvas');
	var ctx = can.getContext('2d');
	var img = new Image();
	var f = document.getElementById('uploadimage').files[0]
	var url = window.URL || window.webkitURL
	var src = url.createObjectURL(f);

	img.src = src;
	img.onload = function() {
		ctx.drawImage(img, 0, 0, 60, 60);
		url.revokeObjectURL(src);

		var data = can.toDataURL("image/jpeg");
		//ctx2.putImageData(imageData, 0, 0);
		//console.log(imageData);
		console.log(data);
		socket.emit('sendimage', { width: 500, height: 500, 
			data: data});
	}
}

document.getElementById('uploadimage').addEventListener('change', draw, false);


if (navigator.getUserMedia) {
	navigator.getUserMedia({video:true, audio:false}, function(stream) {
		document.getElementById('video').src = stream
	}, function() {
		console.log('asd');
	}); 
} else {
	console.log('no support for getUserMedia');
}
*/

var can = document.getElementById('canvas');
can.width = 700;
can.height = 500;
var ctx = can.getContext('2d');
var speed = 6;
var width = can.width
var height = can.height;




// Game variables
var padL;
var padR;
var ball;
var myPaddle;



function resetGame() {
	padL = new Paddle(ctx, 50, 50, 10, 50);
	padR = new Paddle(ctx, 650, 50, 10, 50);
	ball = new Ball(ctx, 100, 10, speed, speed+1, 10, 10);

}
function startGame() {
	resetGame();

	setInterval(function() {
		mainLoop(ctx);
	}, 50);
}

// Socket events
socket.on('ballmovement', function(data) {
	ball.setX(data.x);
	ball.setY(data.y);
});
socket.on('assignedPaddle', function(data) {
	myPaddle = data.paddle;
});
socket.on('opponentmovement', function(data) {
	if (data.paddle == 0) {
		padL.setX(data.x);
		padL.setY(data.y);
	} else if (data.paddle == 1) {
		padR.setX(data.x);
		padR.setY(data.y);
	}
});
socket.on('statusUpdate', function(data) {
	if (data.running == true) {
		$('#status').html('Running!');
	} else if (data.running == false) {
		$('#status').html('Pause!');
	}
});
socket.on('scoreUpdate', function(data) {
	console.log('scoreUpdate', data);
	$('#left_score').html(data[0]);
	$('#right_score').html(data[1]);
});


// Key events
$(document).keydown(function(e) {
	switch(e.which) {
		case 38: // Up arrow
			if (myPaddle == 0) {
				padL.move(0, -speed);
				socket.emit('paddlemovement', { x: padL.getX(), y: padL.getY()});
			} else if (myPaddle == 1) {
				padR.move(0, -speed);
				socket.emit('paddlemovement', { x: padR.getX(), y: padR.getY()});
			}
			
			
			e.preventDefault();
		break;
		case 40: // Down arrow
			if (myPaddle == 0) {
				padL.move(0, speed);
				socket.emit('paddlemovement', { x: padL.getX(), y: padL.getY()});
			} else if (myPaddle == 1) {
				padR.move(0, speed);
				console.log(padR.getX(), padR.getY());
				socket.emit('paddlemovement', { x: padR.getX(), y: padR.getY()});
			}
			
			e.preventDefault();
		break;
	}
	
});

function mainLoop(context) {
	// Clear
	clear(context);

	// Do logic
	/*ball.move( ball.getVelX(), ball.getVelY());

	if ( isColliding(padL, ball)) {
		ball.setVelX( -ball.getVelX() );
	}


	*/

	// Draw
	padL.draw();
	padR.draw();
	ball.draw();

	
	
}

function clear(context) {
	context.fillStyle = '#000';
	context.fillRect(0, 0, width, height);
}

startGame();


