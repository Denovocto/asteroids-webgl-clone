
var canvas;
var gl;

// NOTE: Used to construct transforms after being passed down to drawCube()
var transform = {
	thetas: [0, 0, 0],
	center: [0, 0, 0],
	scale: [1, 1, 1],
	distance: 0.5,
};

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
	eye: vec3(0, 0, 1),
	at: vec3(0, 0, 0),
	up: vec3(0, 1, 0)
};

var perspectiveProj = {
	fov: 25,
	aspect: 1,
	near: 1,
	far: 100,
	mode: projection_modes.PERSPECTIVE
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
var selection = projection_modes.ORTHOGONAL;
window.onload = function init() {
	canvas = document.getElementById("gl-canvas");
	gl = canvas.getContext('webgl2');
	if (!gl) {alert("WebGL 2.0 isn't available");}
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear( gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
	program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);
	var options = {
		'orthogonal': function () {selection = projection_modes.ORTHOGONAL;},
		'perspective': function () {selection = projection_modes.PERSPECTIVE;},
	};
	// NOTE: this is a parameter dictionary used to create the event listeners to perform the function defined 
	var key_events = {
		'a': function () { theta += 0.1; },
		'd': function () { theta -= 0.1; },
		'w': function () { cyllinder.height += 1; },
		's': function () { cyllinder.height -= 1; },
		'[': function () { cyllinder.radius -= 1; },
		']': function () { cyllinder.radius += 1; }
	};

	keys(key_events);
	animate(
	function () {
		changeView(camera);
		changePerspective(selection == projection_modes.ORTHOGONAL ? orthogonalProj : perspectiveProj);
		drawObject(object, object.colors, transform, colorization_type.MULTI, gl.TRIANGLES);
	},
	function () {
		camera.eye[0] = cyllinder.radius * Math.cos(theta);
		camera.eye[1] = cyllinder.height;
		camera.eye[2] = cyllinder.radius * Math.sin(theta);
	});
};