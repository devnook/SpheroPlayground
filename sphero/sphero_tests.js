var SpheroDriver = require('./sphero_driver.js');

work = function() {
	setTimeout(function() {
		console.log("I want to change the color");
		SpheroDriver.setColor('darkgreen');
	}, 6000);

	setTimeout(function() {
		console.log("I want to roll");
		SpheroDriver.roll(2, "forward");	
		setTimeout(function() {
			console.log("I want to turn");
			SpheroDriver.turn("left");	
			setTimeout(function() {
				console.log("I want to roll");
				SpheroDriver.roll(2, "forward");	
				setTimeout(function() {
					console.log("I want to turn");
					SpheroDriver.turn("left");	
					setTimeout(function() {
						console.log("I want to roll");
						SpheroDriver.roll(2, "forward");	
						setTimeout(function() {
							console.log("I want to turn");
							SpheroDriver.turn("left");	
							setTimeout(function() {
								console.log("I want to roll");
								SpheroDriver.roll(2, "forward");	
								setTimeout(function() {
									console.log("I want to turn");
									SpheroDriver.turn("left");	
								}, 2000);
							}, 2000);
						}, 2000);
					}, 2000);
				}, 2000);
			}, 2000);
		}, 2000);
	}, 13000);

	setTimeout(function() {
  	console.log("Done!");
	}, 20000)
};

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