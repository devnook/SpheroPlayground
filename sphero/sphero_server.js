var Http = require('http');
var Director = require('director');
var DirectorExplorer = require('director-explorer');
var SpheroDriver = require('./sphero_driver.js');
var nodeStatic = require('node-static');

var fileServer = new nodeStatic.Server('../app');


var router = new Director.http.Router({
    '/help': {get: printRouter},
//    '/stop': {post: spheroStop},
    '/roll': {post: spheroRoll},
    '/color': {post: spheroColor},
    '/turn': {post: spheroTurn},
    '/.*': {get: staticHandler}
});

startSpheroDriver();
function startSpheroDriver() {
	var port = Number(process.argv[2]);
	SpheroDriver.start();
	var server = Http.createServer(spheroServerDispatch);
	console.log("Listening on port " + port)
	server.listen(port);
}

function spheroServerDispatch(req, res) {
    req.chunks = [];
    req.on('data', function (chunk) {
      req.chunks.push(chunk.toString());
    });

    router.dispatch(req, res, function (err) {
      if (err) {
        console.log(err);
        console.log("req body: " + req.body)
        res.writeHead(err.status ? err.status : 404);
        res.end(err.message);
      }
    });
}

function staticHandler() {
    console.log(this.req, this.res);
    fileServer.serve(this.req, this.res);
}

function printRouter() {
   this.res.writeHead(200, { 'Content-Type': 'text/plain' })
   this.res.write(DirectorExplorer.table(router));
   this.res.end();
}

function spheroStop() {
	SpheroDriver.stop();
	endOk(this.res);
}

function spheroRoll() {
  var params = this.req.body;
  var units = params.units;
  var direction = params.direction;
  console.log("Roll " + units + " units in direction " + direction);
	SpheroDriver.roll(units, direction);
  endOk(this.res);
}

function spheroColor() {
  var color = this.req.body.color;
  console.log("Set color to " + color);
  SpheroDriver.setColor(color);
  endOk(this.res);
}

function spheroTurn() {
  var direction = this.req.body.direction;
  console.log("Turning " + direction);
  SpheroDriver.turn(direction)
  endOk(this.res);
}

function endOk(response) {
  response.writeHead(200);
  response.end();
}
