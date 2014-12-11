var SpheroDriver = require('./sphero_driver.js');

logResult = function(err, data) {
	console.log("Test reads: " + data.message);
}

// Draws a square and turns pink
work = function() {
	SpheroDriver.roll(2, "forward", logResult);
	SpheroDriver.turn("left", logResult);
	SpheroDriver.roll(2, "forward", logResult);
	SpheroDriver.turn("left", logResult);
	SpheroDriver.roll(2, "forward", logResult);
	SpheroDriver.turn("left", logResult);
	SpheroDriver.roll(2, "forward", logResult);
	SpheroDriver.turn("left", logResult);
	SpheroDriver.setColor("pink", logResult);
}

SpheroDriver.start();
canStartTest = false;
workWhenReady = function() {
	if (SpheroDriver.isReady()) {
		work();
	} else {
		console.log("SpheroDriver not ready, waiting...");
		setTimeout(function() {workWhenReady.call()}, 2000);
	}
}
workWhenReady();