exports.start = spheroStart;
exports.startAndDoWhenReady = spheroStartAndDoWhenReady;
exports.stop = spheroStop;
exports.roll = spheroRoll;
exports.setColor = spheroSetColor;
exports.turn = spheroTurn;
exports.isReady = isReady;

var Cylon = require('cylon');

var ROBOT_NAME = 'Purple with joy';

var spheroReady = false;

Cylon.robot({
  connection: {
      name: 'sphero',
      adaptor: 'sphero',
//      port: '/dev/tty.Sphero-RYR-AMP-SPP-6'
      port: '/dev/cu.Sphero-RRP-AMP-SPP'
  },
//  device: { name: 'Sphero-RYR', driver: 'sphero' },
  device: { name: 'Sphero-RRP', driver: 'sphero' },

  name: ROBOT_NAME,

  myAngle : 0,
  myColor : 'yellow',
  mySpeed : 60,
  rolling : false,

  work: function(my) {
    var white = true;
    every((0.5).second(), function(){
      if (!my.amIRolling()) {
        var color = my.readMyColor();
        if (white) {
          my.sphero.setColor('white');
        } else {
          my.sphero.setColor(color);
        }
        white = !white
      }
    });
  },

  readMyColor : function() {
    return this.myColor;
  },

  amIRolling : function() {
    return this.rolling;
  },

  startedRolling : function() {
    this.rolling = true;
  },

  stoppedRolling: function() {
    this.rolling = false;
  },

  setColor: function(color) {
    console.log("Sphero changing to color " + color);
    this.myColor = color;
    this.stop();
  },

  turn: function(direction) {
    if (direction == "left") {
      this.myAngle += 270;
    } else if (direction == "right") {
      this.myAngle += 90;
    } else {
      console.error("Sphero can't turn in direction " + direction
        + ". It only understands left and right.");
      return;
    }

    if (this.myAngle >= 360) this.myAngle -= 360;
    console.log("Sphero turning " + direction + ", will roll at " + this.myAngle + " degrees");
    this.stop();
  },

  roll: function(units, direction, callback) {
    if (direction != "forward" && direction != "backward") {
     console.error("Sphero can't roll in direction " + direction
        + ". It only understands forward and backward.");
      return;
    }
    var rollAngle = direction == "forward" ? this.myAngle : (this.myAngle + 180);
    if (rollAngle >= 360) rollAngle -= 360;
    console.log("Sphero rolling at speed " + this.mySpeed
        + " for " + units + " seconds"
        + " in a " + rollAngle + " degree angle ");
    this.startedRolling();
    this.sphero.roll(this.mySpeed, rollAngle, 1);
    after((units).seconds(), function() {
      console.log("Sphero stopping after " + units + " seconds");
      this.stop();
      this.stoppedRolling();
      callback.call();
    }.bind(this));
  },

  stop: function() {
    console.log("Sphero stopping");
    this.sphero.roll(0, this.myAngle, 0);
    queue.shift();

    if (queue.length) {
      queue[0].handler.apply(Cylon.robots[ROBOT_NAME], queue[0].params);
    }
  }
});

var queue = [];

function spheroStart() {
  Cylon.robots[ROBOT_NAME].on('ready', function() {
    spheroReady = true;
  });
  Cylon.start();
}

function spheroStartAndDoWhenReady(callback) {
  spheroStart();
  callbackWhenReady = function() {
    if (spheroReady) {
      callback.call();
    } else {
      console.log("SpheroDriver not ready, waiting a sec...");
      setTimeout(function() {callbackWhenReady.call()}, 1000);
    }
  }
  callbackWhenReady();
}

function spheroStop() {
  Cylon.robots[ROBOT_NAME].stop();
}

function spheroRoll(units, direction, callback) {
  //Cylon.robots[ROBOT_NAME].roll(units, direction);
  console.log(JSON.stringify(queue))

  queue.push({
    'handler': Cylon.robots[ROBOT_NAME].roll,
    'params': [units, direction, callback]
  });
  console.log('spheroRoll', queue);
  if (queue.length == 1) {
    queue[0].handler.apply(Cylon.robots[ROBOT_NAME], queue[0].params);
  }

}

function spheroSetColor(color) {
  //Cylon.robots[ROBOT_NAME].setColor(color);

  queue.push({
    'handler': Cylon.robots[ROBOT_NAME].setColor,
    'params': [color]
  });
  console.log('spheroSetColor queue', queue);
  if (queue.length == 1) {
    queue[0].handler.apply(Cylon.robots[ROBOT_NAME], queue[0].params);
  }
}

function spheroTurn(direction) {
  //Cylon.robots[ROBOT_NAME].turn(direction)

  queue.push({
    'handler': Cylon.robots[ROBOT_NAME].turn,
    'params': [direction]
  });
  console.log('spheroturn queue', queue);
  if (queue.length == 1) {
    queue[0].handler.apply(Cylon.robots[ROBOT_NAME], queue[0].params);
  }
}

function restart() {
  Cylon.halt(function() {
    Cylon.start();
  });
}

function isReady() {
  return spheroReady;
}
