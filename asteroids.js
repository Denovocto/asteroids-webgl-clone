
var canvas;
var gl;

// NOTE: Used to construct transforms after being passed down to drawCube()
var transform = {
	thetas: [0, 0, 0],
	center: [0, 0, 0],
	scale: [0.1, 0.1, 1],
	distance: 1,
};

var shipTransform = {
	thetas: [0, 0, 0],
	center: [0, -0.5, 0],
	scale: [0.05, 0.05, 1],
	distance: 1,
}

var ship = {
	velocity: [0, 0],
	acceleration: [0, 0],
}

var object = {
	vertexes: [
		vec3(-0.5, -0.5, 0.5),
		vec3(-0.5, 0.5, 0.5),
		vec3(0.5, 0.5, 0.5),
		vec3(0.5, -0.5, 0.5),
		vec3(-0.5, -0.5, -0.5),
		vec3(-0.5, 0.5, -0.5),
		vec3(0.5, 0.5, -0.5),
		vec3(0.5, -0.5, -0.5)
	],
	indexes: [
		1, 0, 3,
		3, 2, 1,
		2, 3, 7,
		7, 6, 2,
		3, 0, 4,
		4, 7, 3,
		6, 5, 1,
		1, 2, 6,
		4, 5, 6,
		6, 7, 4,
		5, 4, 0,
		0, 1, 5
	],
	colors: [
        vec3( 0.0, 0.0, 0.0),  // black
        vec3( 1.0, 0.0, 0.0),  // red
        vec3( 1.0, 1.0, 0.0),  // yellow
        vec3( 0.0, 1.0, 0.0),  // green
        vec3( 0.0, 0.0, 1.0),  // blue
        vec3( 1.0, 0.0, 1.0),  // magenta
        vec3( 0.0, 0.0, 0.0),  // white
        vec3( 0.0, 1.0, 1.0)   // cyan
	]
};
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
	var key_events = {
		'a': function () { shipTransform.thetas[2] -= 500 * deltaTime;},
		'd': function () { shipTransform.thetas[2] += 500 * deltaTime;},
		'w': function () {
							ship.acceleration = 1 * deltaTime;
							ship.velocity[0] += Math.cos(shipTransform.thetas[2]) * ship.acceleration;
							ship.velocity[1] += Math.sin(shipTransform.thetas[2]) * ship.acceleration;
						},
		's': function () {
							ship.velocity[0] = 0;
							ship.velocity[1] = 0;
						},
		'[': function () { cyllinder.radius -= 1; },
		']': function () { cyllinder.radius += 1; }
	};

	keys(key_events);

	var asteroid = generateAsteroid(0.2, 7);
	animate(
	function () {
		changeView(camera);
		changePerspective(orthogonalProj);
		draw(asteroid, vec3(1,1,1), transform, colorization_type.SINGLE, gl.LINE_LOOP);
		drawCirclePoints(shipTransform, 3, vec3(1, 1, 1), colorization_type.SINGLE, gl.TRIANGLE_FAN);
	},
	function () {
		if (ship.velocity[0] < 2){
			ship.velocity[0] *= 0.95;
		}
		else if (ship.velocity[0] > 2){
			ship.velocity[0] *= 0.95;
		}
		if (ship.velocity[1] < 2){
			ship.velocity[1] *= 0.95;
		}
		else if (ship.velocity[1] > 2){
			ship.velocity[1] *= 0.95;
		}
		shipTransform.center[0] += ship.velocity[0];
		shipTransform.center[1] += ship.velocity[1];
	});
};