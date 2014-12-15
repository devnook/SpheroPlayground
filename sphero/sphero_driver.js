exports.start = spheroStart;
exports.startAndDoWhenReady = spheroStartAndDoWhenReady;
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
      port: '/dev/cu.Sphero-OYR-AMP-SPP'
   //   port: '/dev/cu.Sphero-RYR-AMP-SPP'
   //   port: '/dev/cu.Sphero-RRP-AMP-SPP'
  },
  device: { name: 'Sphero-OYR', driver: 'sphero' },
//  device: { name: 'Sphero-RYR', driver: 'sphero' },
//  device: { name: 'Sphero-RRP', driver: 'sphero' },

  name: ROBOT_NAME,

  myAngle : 0,
  myColor : 'yellow',
  mySpeed : 150,
  rolling : false,

  work: function(my) {
    console.log('Setting up collision detection.');
//    my.sphero.detectCollisions();
    my.sphero.configureCollisionDetection(0x01, 0x30, 0x30, 0x50, 0x50, 0x50)
    my.sphero.on('collision', function() {
      console.log("Ouch, collision!")
      my.sphero.setColor('purple');
      my.sphero.stop();
      my.markCollision();
    });

    var black = true;
    every((0.5).second(), function(){
 //     if (!my.amIRolling()) {
        var color = my.readMyColor();
        if (black) {
          my.sphero.setColor('black');
        } else {
          my.sphero.setColor(color);
        }
        black = !black
  //    }
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

  setColor: function(color, callback) {
    console.log("Sphero changing to color " + color);
    this.myColor = color;
    callback(null, {'message': "Sphero changed to color " + color});
  },

  turn: function(direction, callback) {
    if (direction == "left") {
      this.myAngle += 270;
    } else if (direction == "right") {
      this.myAngle += 90;
    } else {
      var message = "Sphero can't turn in direction " + direction
        + ". It only understands left and right.";
      console.error(message);
      callback(message, null);
      return;
    }

    if (this.myAngle >= 360) this.myAngle -= 360;
    console.log("Sphero turning " + direction + ", will roll at " + this.myAngle + " degrees");
    this.sphero.roll(0, this.myAngle, 0);
    callback(null, {'message': "Sphero turned " + direction});
  },

  roll: function(units, direction, callback) {
    if (direction != "forward" && direction != "backward") {
      var errorMessage = "Sphero can't roll in direction " + direction
        + ". It only understands forward and backward.";
      console.error(errorMessage);
      callback(errorMessage, null);
      return;
    }
    var rollAngle = direction == "forward" ? this.myAngle : (this.myAngle + 180);
    if (rollAngle >= 360) rollAngle -= 360;
    console.log("Sphero rolling at speed " + this.mySpeed
        + " for " + units + " seconds"
        + " in a " + rollAngle + " degree angle ");
    this.startedRolling();
    this.sphero.roll(0, rollAngle, 1);
    after((0.5).seconds(), function() {
      this.sphero.roll(this.mySpeed, rollAngle, 2);
      after((units).seconds(), function() {
        console.log("Sphero stopping after " + units + " seconds");
        this.stop(rollAngle);
        var justHitSomething = this.hitSomething;
        this.clearCollision();
        message = "Sphero rolled " + units + " units " + direction;
        if (justHitSomething) message = message + " but hit something on the way";
        callback(null, {
          'message': message,
          'collision': justHitSomething,
        });
      }.bind(this));
    }.bind(this));
  },

  stop: function(rollAngle) {
    if (rollAngle == null) rollAngle = this.myAngle;
    this.sphero.roll(0, rollAngle, 0);
    this.stoppedRolling();
  },

  hitSomething: false,
  markCollision: function() {
    this.hitSomething = true;
  },
  clearCollision: function() {
    this.hitSomething = false;
  },
});

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
      callback();
    } else {
      console.log("SpheroDriver not ready, waiting a sec...");
      setTimeout(function() {callbackWhenReady.call()}, 1000);
    }
  }
  callbackWhenReady();
}

function spheroRoll(units, direction, callback) {
  console.log('Requested roll ' + units + " units " + direction);
  enqueue(Cylon.robots[ROBOT_NAME].roll, [units, direction, callback]);
}

function spheroSetColor(color, callback) {
  console.log('Requested set color to ' + color);
  enqueue(Cylon.robots[ROBOT_NAME].setColor, [color, callback]);
}

function spheroTurn(direction, callback) {
  console.log('Requested turn ' + direction);
  enqueue(Cylon.robots[ROBOT_NAME].turn, [direction, callback]);
}

function restart() {
  Cylon.halt(function() {
    Cylon.start();
  });
}

function isReady() {
  return spheroReady;
}

var commandQueue = [];
var busy = false;
var pause_ms = 300;

function enqueue(handler, params) {
  commandQueue.push({
    'handler': handler,
    'params': params
  });
}

function processQueue() {
  if (!busy) {
    busy = true;
    var nextCommand = commandQueue.shift();
    if (nextCommand != null) {
      setTimeout(function() {
        var originalCallback = nextCommand.params.pop();
        var queuedCallback = function(err, data) {
          originalCallback(err, data);
          busy = false;
        };
        nextCommand.params.push(queuedCallback);
        nextCommand.handler.apply(Cylon.robots[ROBOT_NAME], nextCommand.params);
      }, pause_ms);
    } else {
      busy = false;
    }
  }
}

setInterval(processQueue, 500);
