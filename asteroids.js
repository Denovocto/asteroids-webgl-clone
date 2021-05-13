
var canvas;
var gl;

// NOTE: Used to construct transforms after being passed down to drawCube()
var asteroidTransform = {
	thetas: [0, 0, 0],
	center: [0, 0, 0],
	scale: [1, 1, 1],
	distance: 0.2,
};

var asteroidSpeed = {
	velocity: [0, 0],
	acceleration: 0,
	heading: 20
}

var shipTransform = {
	thetas: [0, 0, 0],
	center: [0, 0, 0],
	scale: [1, 1, 1],
	distance: 0.05,
}

var ship = {
	velocity: [0, 0],
	acceleration: 0,
	heading: 0
}

var bullet = {
	center: [0, 0, 0],
	distance: 2
}

var camera = {
	eye: vec3(0, 0, 0),
	at: vec3(0, 0, 0),
	up: vec3(0, 1, 0)
};
var orthogonalProj = {
	left: -1,
	right: 1,
	bottom: -1,
	top: 1,
	near: -1,
	far: 100,
	mode: projection_modes.ORTHOGONAL
};
var cyllinder = {
	radius: 5,
	height: 0,
};

var theta = 0;

var deltaTime = 1/60;
window.onload = function init() {
	canvas = document.getElementById("gl-canvas");
	gl = canvas.getContext('webgl2');
	if (!gl) {alert("WebGL 2.0 isn't available");}
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(0.0, 0.0, 0.0, 0.5);
	gl.clear( gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
	program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);
	// NOTE: this is a parameter dictionary used to create the event listeners to perform the function defined 
	var keys_pressed = {};
	var key_events = {
		'a': function () { 
							// console.log("theta: ", shipTransform.thetas[2]);
							shipTransform.thetas[2] -= 200 * deltaTime;
						},
		'd': function () {
							// console.log("theta: ", shipTransform.thetas[2]);
							shipTransform.thetas[2] += 200 * deltaTime;

						},
		'w': function () {
							ship.acceleration = 0.01 * deltaTime;
							// console.log("theta: ", shipTransform.thetas[2]);
							// console.log("x: ", Math.cos(radians(shipTransform.thetas[2])) * ship.acceleration);
							// console.log("y: ", Math.sin(radians(shipTransform.thetas[2])) * ship.acceleration);
							if (shipTransform.thetas[2] == 0){
								ship.heading = 90;
							}
							else if (shipTransform.thetas[2] > 0){
								ship.heading = 90 - shipTransform.thetas[2];
							}
							else if (shipTransform.thetas[2] < 0){
								ship.heading = 90 + shipTransform.thetas[2];
							}
							ship.velocity[0] += Math.cos(radians(ship.heading)) * ship.acceleration;
							ship.velocity[1] += Math.sin(radians(ship.heading)) * ship.acceleration;
						},
		's': function () {
							ship.velocity[0] -= Math.cos(radians(shipTransform.thetas[2] + 90)) * ship.acceleration;
							ship.velocity[1] -= Math.sin(radians(shipTransform.thetas[2] + 90)) * ship.acceleration;
						},
		'[': function () { cyllinder.radius -= 1; },
		']': function () { cyllinder.radius += 1; },
		' ': function() {
							drawBullet(bullet, vec3(1, 1, 1));
						}
	};
	keys(keys_pressed);
	var asteroidList = [];
	for (var i = 1; i <= 7; i++)
	{
		var x = 0;
		var y = 0;
		while(x <= 0.2 && x >= -0.2 && y <= 0.2 && y >= -0.2)
		{
			x = Math.random() * 1 * (Math.round(Math.random()) ? 1 : -1);
			y = Math.random() * 1 * (Math.round(Math.random()) ? 1 : -1);
		}
		var asteroidTranform = {
			thetas: [0, 0, 0],
			center: [x, y, 0],
			scale: [1, 1, 1],
			distance: Math.random() * 2 / 10
		}
		var asteroidObject = generateAsteroid(asteroidTransform, Math.floor(Math.random() * 6) + 5);
		var asteroidMovement = {
			velocity: [0, 0],
			acceleration: 0,
			heading: Math.random() * 361
		}
		asteroidList.push({transform: asteroidTranform, object: asteroidObject, movement: asteroidMovement});
	}
	console.log(asteroidList);
	animate(
	function () {
		changeView(camera);
		changePerspective(orthogonalProj);
		torusGeometry(shipTransform);
		torusGeometry(asteroidList[0].transform);
		draw(asteroidList[0].object, vec3(1,1,1), asteroidList[0].transform, colorization_type.SINGLE, gl.LINE_LOOP);
		// if (!collision(shipTransform, transform))

		//var ranNum = Math.random() * 1 * (Math.round(Math.random()) ? 1 : -1)

		drawTriangle(shipTransform, vec3(1, 1, 1), colorization_type.SINGLE, gl.LINE_LOOP);
	},
	function () {
		executeKeys(keys_pressed, key_events);
		updateAsteroidPosition(asteroidList[0], deltaTime);
		updateShipPosition();

	});
}

function executeKeys(keys_pressed, key_events)
{
	for(key in keys_pressed){
		if(keys_pressed[key] && key_events[key])
		{
			key_events[key]();
		}
	}
}
function updateAsteroidPosition(asteroid, delta)
{
	asteroid.movement.acceleration = 0.05 * delta;
	asteroid.movement.velocity[0] = Math.cos(radians(asteroid.movement.heading)) * asteroid.movement.acceleration;
	asteroid.movement.velocity[1] = Math.sin(radians(asteroid.movement.heading)) * asteroid.movement.acceleration;
	asteroid.transform.center[0] += asteroid.movement.velocity[0];
	asteroid.transform.center[1] += asteroid.movement.velocity[1];
}
function updateShipPosition()
{
	shipTransform.center[0] += ship.velocity[0];
	shipTransform.center[1] += ship.velocity[1];
}


//Math.floor(Math.random() * 361);     // returns a random integer from 0 to 360 