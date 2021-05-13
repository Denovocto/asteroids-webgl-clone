// NOTE:  used as a type of pseudo "enum" to indicate the type of a colorization on a buffer to indicate if a color buffer is to be created or not, main use is for better readability
const colorization_type  = {
	MULTI: "multi",
	SINGLE: "single"
}

// NOTE:  used as a type of pseudo "enum" to indicate the rotation direction of a shape, main use is for better readability
const rotation_direction = {
	LEFT: "left",
	RIGHT: "right"
}
// NOTE:  used as a type of pseudo "enum" to indicate if a buffer is 3d or not, main use is for better readability
const dimension = {
	TWO: "two",
	THREE: "three"
}
// NOTE: default transform parameters
const transform_default = {
	thetas: [0, 0, 0],
	center: [0, 0, 0],
	scale: [1, 1, 1],
	distance: 0.1,
}
// TODO: update to dictionary
function drawSquare(center_x, center_y, distance, theta, colors, colorization_option = colorization_type.SINGLE, draw_mode = gl.TRIANGLE_FAN)
{
	var vertices = [
		vec2(distance, distance),
		vec2(distance, - distance),
		vec2(- distance,- distance),
		vec2(- distance, distance)];
	initBuffers(vertices, colors, colorization_option);
	var tMatrixLocation = gl.getUniformLocation(program, "tMatrix");
	var translation = translationMatrix3(center_x, center_y);
	var rMatrix = rotationMatrix3(theta);
	var matrix = multiplyMatrix3(rMatrix, translation, 3, 3, 3);
	gl.uniformMatrix3fv(tMatrixLocation, false, matrix);

	gl.drawArrays(draw_mode, 0, 4 );
}
// TODO: update to dictionary
function drawRectangle(center_x, center_y, width, length, theta, colors, colorization_option = colorization_type.SINGLE, draw_mode = gl.TRIANGLE_FAN)
{
	var vertices = [
		vec2(length / 2, width / 2),
		vec2(length / 2, - width / 2),
		vec2(length / 2, - width / 2),
		vec2(- length / 2, width / 2)
	];
	initBuffers(vertices, colors, colorization_option);
	var tMatrixLocation = gl.getUniformLocation(program, "tMatrix");
	var translation = translationMatrix3(center_x, center_y);
	var rMatrix = rotationMatrix3(theta);
	var matrix = multiplyMatrix3(rMatrix, translation, 3, 3, 3);
	gl.uniformMatrix3fv(tMatrixLocation, false, matrix);
	gl.drawArrays(draw_mode, 0, 4);
}
// TODO: update to dictionary
function drawCircle(center_x, center_y, radius, up2degrees, theta, colors, squish_factor_x = 1, squish_factor_y = 1, colorization_option = colorization_type.SINGLE, draw_mode = gl.TRIANGLE_FAN){
	var vertices = [];
    for(theta = 0; theta < up2degrees; theta+=1)
    {
        var x = radius * Math.cos(radians(theta));
        var y = radius * Math.sin(radians(theta));
        vertices.push(vec2(x*squish_factor_x, y*squish_factor_y));
    }
	initBuffers(vertices, colors, colorization_option);
	var tMatrixLocation = gl.getUniformLocation(program, "tMatrix");
	var translation = translationMatrix3(center_x, center_y);
	var rMatrix = rotationMatrix3(theta);
	var matrix = multiplyMatrix3(rMatrix, translation, 3, 3, 3);
	gl.uniformMatrix3fv(tMatrixLocation, false, matrix);
	// gl.drawElements(gl., count, type, offset)
	gl.drawArrays(draw_mode, 0, vertices.length);
}
function drawCirclePoints(transform_params = transform_default, segments, colors, colorization_option = colorization_type.SINGLE, draw_mode = gl.TRIANGLE_FAN)
{
	var vertexes = [];
	var radius = transform_params.distance;
	vertexes.push(vec3(0, 0, 0));
	for (i = 0; i <= segments; i++) 
	{
		vertexes.push(vec3(
			radius * Math.sin(i / segments * Math.PI * 2),
			radius * Math.cos(i / segments * Math.PI * 2),
			0
		));
	}
	var buffers = initBuffers(vertexes, colors, [], colorization_option, dimension.TWO);
	var tMatrixLocation = gl.getUniformLocation(program, "tMatrix");

	var scale = scaleMatrix4(transform_params["scale"][0], transform_params["scale"][1], transform_params["scale"][2]);
	var rotate = rotationMatrix4(transform_params["thetas"]);
	var translation = translationMatrix4(transform_params["center"][0], transform_params["center"][1], transform_params["center"][2]);

	var matrix = multiplyMatrix(scale, rotate, 4, 4, 4);
	matrix = multiplyMatrix(matrix, translation, 4, 4, 4);
	gl.uniformMatrix4fv(tMatrixLocation, false, matrix);
	gl.drawArrays(draw_mode, 0, vertexes.length);
	gl.deleteBuffer(buffers.vertexBuffer);
	gl.deleteBuffer(buffers.indexBuffer);
	gl.deleteBuffer(buffers.colorBuffer);
}
function generateAsteroid(transform, segments)
{
	var radius = transform["distance"];
	var vertexes = [];
	for (i = 1; i <= segments; i++) 
	{
		var quantity = Math.random() * 0.2 * radius;
		var sum = Math.floor(Math.random() * 2);
		sum == Boolean(sum);
		var x = radius * Math.sin(i / segments * Math.PI * 2);
		var y = radius * Math.cos(i / segments * Math.PI * 2);
		
		vertexes.push(vec3(
			sum ? x + quantity : x - quantity,
			sum ? y + quantity : y - quantity,
			0
		));
	}

	return vertexes;
}

function drawBullet(transform_params = transform_default, color)
{
	var pSize = gl.getUniformLocation(program, "pSize");
	gl.uniform1f(pSize, transform_params["distance"]);
	var buffers = initBuffers([vec3(0, 0, 0)], color, [], colorization_type.SINGLE, dimension.TWO);

	var tMatrixLocation = gl.getUniformLocation(program, "tMatrix");

	var scale = scaleMatrix4(1, 1, 1);
	var rotate = rotationMatrix4(transform_default["thetas"]);
	var translation = translationMatrix4(transform_params["center"][0], transform_params["center"][1], 0);

	var matrix = multiplyMatrix(scale, rotate, 4, 4, 4);
	matrix = multiplyMatrix(matrix, translation, 4, 4, 4);
	gl.uniformMatrix4fv(tMatrixLocation, false, matrix);
	gl.drawArrays(gl.POINTS, 0, 1);
	
	gl.deleteBuffer(buffers.vertexBuffer);
	gl.deleteBuffer(buffers.indexBuffer);
	gl.deleteBuffer(buffers.colorBuffer);
}

// TODO: update to dictionary
function generateCircleColorSpectrum(segments)
{
	var circle_colors = [vec3(1,1,1)];
	for( i = 0; i <= segments; i++)
    {
        circle_colors.push(vec3(
            (128 + 128 * Math.sin(i / segments * Math.PI * 2))/256,
            (128 + 128 * Math.sin((i / segments + 1 / 3) * Math.PI * 2))/256,
            (128 + 128 * Math.sin((i / segments + 2 / 3) * Math.PI * 2))/256
        ));
    }
	return circle_colors;
}
// TODO: update to dictionary
function drawTriangle(transform_params = transform_default, colors, colorization_option = colorization_type.SINGLE, draw_mode = gl.TRIANGLE_FAN){
	var distance = transform_params["distance"];
	var vertexes = [
		vec3(0, distance, 0),
		vec3(distance, -distance, 0),
		vec3(-distance, -distance, 0)
	];
	var buffers = initBuffers(vertexes, colors, [], colorization_option, dimension.TWO);
	var tMatrixLocation = gl.getUniformLocation(program, "tMatrix");

	var scale = scaleMatrix4(transform_params["scale"][0], transform_params["scale"][1], transform_params["scale"][2]);
	var rotate = rotationMatrix4(transform_params["thetas"]);
	var translation = translationMatrix4(transform_params["center"][0], transform_params["center"][1], transform_params["center"][2]);

	var matrix = multiplyMatrix(scale, rotate, 4, 4, 4);
	matrix = multiplyMatrix(matrix, translation, 4, 4, 4);
	gl.uniformMatrix4fv(tMatrixLocation, false, matrix);
	gl.drawArrays(draw_mode, 0, 3);
	gl.deleteBuffer(buffers.vertexBuffer);
	gl.deleteBuffer(buffers.indexBuffer);
	gl.deleteBuffer(buffers.colorBuffer);
}
function draw(vertexes, colors, transform_params = transform_default, colorization_option = colorization_type.SINGLE, draw_mode = gl.TRIANGLE_FAN)
{
	var buffers = initBuffers(vertexes, colors, [], colorization_option, dimension.TWO);
	var tMatrixLocation = gl.getUniformLocation(program, "tMatrix");

	var scale = scaleMatrix4(transform_params["scale"][0], transform_params["scale"][1], transform_params["scale"][2]);
	var rotate = rotationMatrix4(transform_params["thetas"]);
	var translation = translationMatrix4(transform_params["center"][0], transform_params["center"][1], transform_params["center"][2]);

	var matrix = multiplyMatrix(scale, rotate, 4, 4, 4);
	matrix = multiplyMatrix(matrix, translation, 4, 4, 4);
	gl.uniformMatrix4fv(tMatrixLocation, false, matrix);
	gl.drawArrays(draw_mode, 0, vertexes.length);
	gl.deleteBuffer(buffers.vertexBuffer);
	gl.deleteBuffer(buffers.indexBuffer);
	gl.deleteBuffer(buffers.colorBuffer);
}
/** 
 * @param  {Object} transform_params is a parameter dictionary which contains, the transforms to be performed on the cube as well as its dimensions.
 * @param  {colorization_type} colorization_option is either colorization_type.SINGLE or colorization_type.MULTI to indicate if the object is multi or single-colored.
 * @param  {GLenum} draw_mode is the default gl draw mode 'enums' to indicate which type of drawing is to be performed. Ex. gl.TRIANGLES
 * @return {None}
*/
function drawObject(object, colors, transform_params = transform_default, colorization_option = colorization_type.MULTI, draw_mode = gl.TRIANGLE_FAN)
{
	var vertexes = object.vertexes;
	var indexes = object.indexes;
	// console.log(object.vertexes);
	// console.log(object.indexes);

	var buffers = initBuffers(vertexes, colors, indexes, colorization_option, dimension.THREE);

	var tMatrixLocation = gl.getUniformLocation(program, "tMatrix");

	var scale = scaleMatrix4(transform_params["scale"][0], transform_params["scale"][1], transform_params["scale"][2]);
	var rotate = rotationMatrix4(transform_params["thetas"]);
	var translation = translationMatrix4(transform_params["center"][0], transform_params["center"][1], transform_params["center"][2]);

	var matrix = multiplyMatrix(scale, rotate, 4, 4, 4);
	matrix = multiplyMatrix(matrix, translation, 4, 4, 4);

	gl.uniformMatrix4fv(tMatrixLocation, false, matrix);
	gl.drawElements(draw_mode, indexes.length, gl.UNSIGNED_BYTE, 0 );
	gl.deleteBuffer(buffers.vertexBuffer);
	gl.deleteBuffer(buffers.indexBuffer);
	gl.deleteBuffer(buffers.colorBuffer);
}
/**
 * draws a cube in 0, 0, 0 and then transforms it 
 * @param  {Object} colors is either a list of vec3 or a single vec3 if the cube is to be drawn single-colored.
 * @param  {Object} transform_params is a parameter dictionary which contains, the transforms to be performed on the cube as well as its dimensions.
 * @param  {colorization_type} colorization_option is either colorization_type.SINGLE or colorization_type.MULTI to indicate if the object is multi or single-colored.
 * @param  {GLenum} draw_mode is the default gl draw mode 'enums' to indicate which type of drawing is to be performed. Ex. gl.TRIANGLES
 * @return {None}
 */
function drawCube(colors, transform_params = transform_default, colorization_option = colorization_type.MULTI, draw_mode = gl.TRIANGLE_FAN)
{
	var distance = transform_params["distance"];
	var vertices = [
		vec3(-distance, -distance, distance),
		vec3(-distance, distance, distance),
		vec3(distance, distance, distance),
		vec3(distance, -distance, distance),
		vec3(-distance, -distance, -distance),
		vec3(-distance, distance, -distance),
		vec3(distance, distance, -distance),
		vec3(distance, -distance, -distance)
	];
	var indices = [
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
	];
	initBuffers(vertices, colors, indices, colorization_option, dimension.THREE);
	var tMatrixLocation = gl.getUniformLocation(program, "tMatrix");

	var scale = scaleMatrix4(transform_params["scale"][0], transform_params["scale"][1], transform_params["scale"][2]);
	var rotate = rotationMatrix4(transform_params["thetas"]);
	var translation = translationMatrix4(transform_params["center"][0], transform_params["center"][1], transform_params["center"][2]);
	
	var matrix = multiplyMatrix(scale, rotate, 4, 4, 4);
	matrix = multiplyMatrix(matrix, translation, 4, 4, 4);

	gl.uniformMatrix4fv(tMatrixLocation, false, matrix);
	gl.drawElements( draw_mode, 36, gl.UNSIGNED_BYTE, 0 );

}
/**
 * A generalized form to initialize and set up buffers and opengl program
 * @param  {Object} points is an list of vec3 or vec2 coordinates depending if the graphic is 2d or 3d
 * @param  {Object} colors is either a single vec3 or a list of vec3 depending if the graphic is single or multi colored.
 * @param  {colorization_type} colorization_option is either colorization_type.SINGLE or colorization_type.MULTI to indicate if the object is multi or single-colored.
 * 
 * @param  {dimension} dimension_option is either dimension.TWO or dimension.THREE. dimension.TWO by default
 * @param  {Object} indices is a list of the indices of points that compose a 3d figure, will only be used when dimension is 3d. 
 * @return {WebGLProgram} returns a WebGLProgram object.
 */
function initBuffers(points, colors, indices = [], colorization_option = colorization_type.SINGLE, dimension_option = dimension.TWO) {
	let bufferIds = {
		vertexBuffer: null,
		indexBuffer: null,
		colorBuffer: null
	};
	components = dimension_option == dimension_option.TWO ? 2 : 3;

	if(dimension_option == dimension.THREE){
		gl.enable(gl.DEPTH_TEST);
		bufferIds["indexBuffer"] = gl.createBuffer(); // index buffer
    	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferIds["indexBuffer"]);
    	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);
	}

	bufferIds["vertexBuffer"] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIds["vertexBuffer"]); // vertex buffer
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

	var aPosition = gl.getAttribLocation(program, "aPosition");
	gl.vertexAttribPointer(aPosition, components, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(aPosition);

	var aColor = gl.getAttribLocation(program, "aColor");
	switch(colorization_option){
		case colorization_type.MULTI:
			bufferIds["colorBuffer"] = gl.createBuffer(); // color buffer
			gl.bindBuffer(gl.ARRAY_BUFFER, bufferIds["colorBuffer"]);
			gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

			gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(aColor);
			break;
		case colorization_type.SINGLE:
			gl.vertexAttrib3f(aColor, colors[0], colors[1], colors[2]);
			break;
		default:
			throw 'Wrong Parameter colorization_option';
	}
	return bufferIds;
}