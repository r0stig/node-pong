/*
var slots = [];

function Slot(socketid, paddle) {
	this.socketid = socketid;
	this.paddle = paddle;
	this.score = 0;

}
Slot.prototype.setSocketID = function(socketid) {
	this.socketid = socketid;
}
Slot.prototype.getSocketID = function() {
	return this.socketid;
}
Slot.prototype.setPaddle = function(paddle) {
	this.paddle = paddle;
}
Slot.prototype.getPaddle = function() {
	return this.paddle;
}
Slot.prototype.getScore = function() {
	return this.score;
}

Slot.prototype.addScore = function() {
	this.score += 1;
}

function slotInsert(socketid) {
	if (slots.length < 2) {
		var paddles = [0, 1];
		// Find free paddle
		for(var i = 0; i < slots.length; ++i) {
			var index = paddles.indexOf(slots[i].getPaddle());
			if (index != -1) {
				paddles.splice(index, 1);
			}
		}
		// Add the new slot with the remaining paddle in paddles
		slots.push(new Slot(socketid, paddles[0]));
		return slots[slots.length-1];
	} else {
		return false;
	}
}

function slotRemove(socketid) {
	var index = -1;
	for(var i = 0; i < slots.length; i++) {
		if (slots[i].getSocketID() == socketid) {
			index = i;
			break;
		}
	}
	slots.splice(index, 1);
}

function slotGet(socketid) {
	for(var i = 0; i < slots.length; i++) {
		if (slots[i].getSocketID() == socketid) {
			return slots[i];
		}
	}
}
function slotGetByPaddle(paddle) {
	for(var i = 0; i < slots.length; i++) {
		if (slots[i].getPaddle() == paddle) {
			return slots[i];
		}
	}
}

function slotGetAllScores() {
	var scores = [];
	for (var i = 0; i < slots.length; ++i) {
		scores.push(slots[i].getScore());
	}
	return scores;
}

function slotCount() {
	return slots.length;
}

exports.Slot = Slot;
exports.slotInsert = slotInsert;
exports.slotRemove = slotRemove;
exports.slotGet = slotGet;
exports.slotGetByPaddle = slotGetByPaddle;
exports.slotGetAllScores = slotGetAllScores;
exports.slotCount = slotCount;
*/