
var canvas;
var gl;

var shipTransform = {
	thetas: [0, 0, 0],
	center: [0, 0, 0],
	scale: [1, 1, 1],
	distance: 0.05,
}

var ship = {
	velocity: [0, 0],
	acceleration: 0,
	heading: 90
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
var hit = false;
var lives = 3;
var deltaTime = 1/60;
var frame = 0;
var score = 0;
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
							if (shipTransform.thetas[2] == 0){
								ship.heading = 90;
							}
							else if (shipTransform.thetas[2] > 0){
								ship.heading = 90 - shipTransform.thetas[2];
							}
							else if (shipTransform.thetas[2] < 0){
								ship.heading = 90 + shipTransform.thetas[2];
							}
							shipTransform.thetas[2] -= 200 * deltaTime;
						},
		'd': function () {
							if (shipTransform.thetas[2] == 0){
								ship.heading = 90;
							}
							else if (shipTransform.thetas[2] > 0){
								ship.heading = 90 - shipTransform.thetas[2];
							}
							else if (shipTransform.thetas[2] < 0){
								ship.heading = 90 + shipTransform.thetas[2];
							}
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
							ship.acceleration = 0.01 * deltaTime;
							if (shipTransform.thetas[2] == 0){
								ship.heading = 90;
							}
							else if (shipTransform.thetas[2] > 0){
								ship.heading = 90 - shipTransform.thetas[2];
							}
							else if (shipTransform.thetas[2] < 0){
								ship.heading = 90 + shipTransform.thetas[2];
							}
							ship.velocity[0] -= Math.cos(radians(ship.heading)) * ship.acceleration;
							ship.velocity[1] -= Math.sin(radians(ship.heading)) * ship.acceleration;
						},
		'[': function () { cyllinder.radius -= 1; },
		']': function () { cyllinder.radius += 1; },
		' ': function() {
							if(!(frame % 30))
							{
								document.getElementById("bullet").play();
								bulletList.push(generateBullet());
							}
						}
	};
	keys(keys_pressed);
	attachSound("bullet", "./Assets/laser.mp3");
	attachSound("crash", "./Assets/crash.mp3");
	attachSound("explode", "./Assets/explode.mp3");
	write("instructions", "use WASD to move and space to shoot.");
	var asteroidList = generateAsteroids();
	var bulletList = [];
	animate(
	function () {
		changeView(camera);
		changePerspective(orthogonalProj);
		torusGeometry(shipTransform);
		if (!hit) {
			if(lives > 0){
				drawTriangle(shipTransform, vec3(1, 1, 1), colorization_type.SINGLE, gl.LINE_LOOP);
				for(var i = 0; i < bulletList.length; i++)
				{
					drawBullet(bulletList[i], vec3(1, 1, 1));
				}
			}
		}
		else {
			if( lives > 0)
				lives--;
			shipTransform.center[0] = 0;
			shipTransform.center[1] = 0;
			shipTransform.thetas[2] = 0;
			ship.acceleration = 0;
			ship.velocity[0] = 0;
			ship.velocity[1] = 0;
			hit = false;
			var newAsteroid = generateAsteroids(1);
			asteroidList.push(newAsteroid[0]);
		}
		//collisions
		for(var i = 0; i < asteroidList.length; i++)
		{
			// collision asteroid ship
			if(lives > 0)
			{
				if (asteroidCollision(shipTransform, asteroidList[i].transform))
				{
					asteroidList.splice(i, 1);
					hit = true;
					document.getElementById("crash").play();
					break;
				}
				// collision asteroid bullet
				for (var j = 0; j < bulletList.length ; j++)
				{
					if (bulletCollision(asteroidList[i].transform, bulletList[j]))
					{
						score += 100;
						asteroidList.splice(i, 1);
						bulletList.splice(j, 1);
						var newAsteroid = generateAsteroids(1);
						asteroidList.push(newAsteroid[0]);
						document.getElementById("explode").play();
						// var tinyAsteroids = generateTinyAsteoids(asteroidList[i].transform.center[0], asteroidList[i].transform.center[1], 0.1);
						// for (var k = 0; k < tinyAsteroids.length; k++)
						// {
						// 	console.log(tinyAsteroids);
						// 	asteroidList.push(tinyAsteroids[k]);
						// }
					}
				}
			}
		}
		for(var i = 0; i < asteroidList.length; i++)
		{
			// draw and map geometry of asteroids
			torusGeometry(asteroidList[i].transform);
			draw(asteroidList[i].object, vec3(1,1,1), asteroidList[i].transform, colorization_type.SINGLE, gl.LINE_LOOP);
		}
		write("lives", "Lives Left: ", lives);
		write("score", "Score: ", score);
		if(lives == 0)
		{
			write("end", "Game Over! Try again by refreshing the page.");
		} 
	},
	function () {
		for(var i = 0; i < asteroidList.length; i++)
			updateAsteroidPosition(asteroidList[i], deltaTime);
		if(lives > 0){
			executeKeys(keys_pressed, key_events);
			updateShipPosition();
			updateBulletPositions(bulletList, deltaTime);
		}
		frame++;
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
	asteroid.movement.acceleration = 0.1 * delta;
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
function updateBulletPositions(bulletList, delta)
{
	var acceleration = 0.7 * delta;
	for(var i = 0; i < bulletList.length; i++){
		var west = bulletList[i].center[0] < -1;
		var east = bulletList[i].center[0] > 1;
		var north = bulletList[i].center[1] > 1;
		var south = bulletList[i].center[1] < -1;
		if( west || east || north || south){
			bulletList.splice(i, 1);
			break;
		}
		bulletList[i].center[0] += Math.cos(radians(bulletList[i].heading)) * acceleration;
		bulletList[i].center[1] += Math.sin(radians(bulletList[i].heading)) * acceleration;
	}
}
function generateAsteroids(quantity = 8)
{
	var asteroidList = [];
	for (var i = 1; i <= quantity; i++)
	{
		var x = 0;
		var y = 0;
		var centerX = shipTransform.center[0];
		var centerY = shipTransform.center[1];
		x = centerX + 0.2 + Math.random() * (1 - (centerX + 0.2));
		x *= (Math.round(Math.random()) ? 1 : -1);
		y = centerY + 0.2 + Math.random() * (1 - (centerY + 0.2));
		y *= (Math.round(Math.random()) ? 1 : -1);
		var asteroidTransform = {
			thetas: [0, 0, 0],
			center: [x, y, 0],
			scale: [1, 1, 1],
			distance: (Math.random() + 1) / 10
		}
		var asteroidObject = generateAsteroid(asteroidTransform, Math.floor(Math.random() * 6) + 5);
		var asteroidMovement = {
			velocity: [0, 0],
			acceleration: 0,
			heading: Math.random() * 361
		}
		asteroidList.push({transform: asteroidTransform, object: asteroidObject, movement: asteroidMovement});
	}
	return asteroidList;
}

function generateTinyAsteoids(center_x, center_y, distance)
{
	var asteroidList = [];
	var vertexes = [
		[0, center_y+distance, 0],
		vec3(center_x+distance, center_y-distance, 0),
		vec3(center_x-distance, center_y-distance, 0)
	];
	for(var i = 0; i < 3; i++)
	{
		var asteroidTransform = {
			thetas: [0, 0, 0],
			center: vertexes[i],
			scale: [1, 1, 1],
			distance: (Math.random() + 1) / 5
		};
		var asteroidObject = generateAsteroid(asteroidTransform, Math.floor(Math.random() * 6) + 5);
		var asteroidMovement = {
			velocity: [0, 0],
			acceleration: 0,
			heading: Math.random() * 361
		};
		asteroidList.push({transform: asteroidTransform, object: asteroidObject, movement: asteroidMovement});
	}
	return asteroidList;
}

function generateBullet()
{
	var bullet_x = shipTransform.distance * Math.cos(radians(ship.heading)) + shipTransform.center[0];
	var bullet_y = shipTransform.distance * Math.sin(radians(ship.heading)) + shipTransform.center[1];
	var bullet = {
		center: [bullet_x, bullet_y, 0],
		distance: 5,
		heading: ship.heading
	}
	
	return bullet;
}