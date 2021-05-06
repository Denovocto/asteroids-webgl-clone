function rotationMatrix3(theta)
{
    var cosine = Math.cos(radians(theta));
    var sine = Math.sin(radians(theta));
    return [
      cosine, sine, 0,
      -sine, cosine, 0,
      0, 0, 1,
    ];
}
function identityMatrix3()
{
    return [
            1, 0, 0,
            0, 1, 0, 
            0, 0, 1
    ];
}

function identityMatrix4()
{
    return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
    ];
}

function translationMatrix3(shift_x, shift_y)
{
    return [
            1, 0, 0,
            0, 1, 0,
            shift_x, shift_y, 1,
      ];
}

/**
 * produces a translation 4x4 matrix to translate a 3d object
 * @param  {Number} shift_x coordinate to be shifted to in x-axis
 * @param  {Number} shift_y coordinate to be shifted to in y-axis
 * @param  {Number} shift_z coordinate to be shifted to in z-axis
 * @return {Array} result matrix
 */
function translationMatrix4(shift_x, shift_y, shift_z)
{
    return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            shift_x, shift_y, shift_z, 1
    ];
}

function inverseTranslationMatrix3(shift_x, shift_y)
{
    return [
        1, 0, 0,
        0, 1, 0,
        -shift_x, -shift_y, 1,
      ];
}

function inverseTranslationMatrix4(shift_x, shift_y, shift_z)
{
    return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 0, 1,
            -shift_x, -shift_y, -shift_z, 1
    ];
}

/**
 * produces a scale 4x4 matrix to scale a 3d object
 * @param  {Number} shift_x scale factor to change x-axis
 * @param  {Number} shift_y scale factor to change y-axis
 * @param  {Number} shift_z scale factor to change z-axis
 * @return {Array} result matrix
 */
function scaleMatrix4(shift_x, shift_y, shift_z)
{
    return [
            shift_x, 0, 0, 0,
            0, shift_y, 0, 0,
            0, 0, shift_z, 0,
            0, 0, 0, 1
    ];
}
/**
 * multiplies in row-major two matrices with dimensions m, l, n
 * @param  {Array} mat_u matrix U
 * @param  {Array} mat_v matrix V
 * @param  {Number} m columns of U
 * @param  {Number} l rows of U
 * @param  {Number} n columns of V
 * @return {Array} product matrix
 */
function multiplyMatrix(mat_u,mat_v,m,l,n) {
    var rMat = [];
    var i = 0;
    var j = 0;
    var k = 0;
    
    for (i = 0; i < m; i++) {
        for (j = 0; j < n; j++) {
            var total = 0;
            
            for (k = 0; k < l; k++) {
                total += mat_u[i*l+k]*mat_v[k*n+j];
            }
            
            rMat[i*n+j] = total;
        }
    }
    
    return rMat;
}
/**
 * returns a constructed rotation 4x4 matrix for a given list of thetas which contains the desired rotations of each axis.
 * @param  {Array} thetas is a list of 3 elements which indicate the rotation in x, y & z respectively Ex. [1, 1, 1]
 * @return {Array}
 */
function rotationMatrix4(thetas)
{
    if(thetas[0] < 0){
        thetas[0] = 360 + thetas[0];
    }
    if(thetas[1] < 0){
        thetas[1] = 360 + thetas[0];
    }
    if(thetas[2] < 0){
        thetas[2] = 360 + thetas[0];
    }
    var cosines = vec3(Math.cos(radians(thetas[0])), Math.cos(radians(thetas[1])), Math.cos(radians(thetas[2])));
    var sines = vec3(Math.sin(radians(thetas[0])), Math.sin(radians(thetas[1])), Math.sin(radians(thetas[2])));
    var matrix = [
        cosines[1]*cosines[2], sines[0]*sines[1]*cosines[2]-cosines[0]*sines[2], cosines[0]*sines[1]*cosines[2]+sines[0]*sines[2], 0,
        cosines[1]*sines[2], sines[0]*sines[1]*sines[2] + cosines[0]*cosines[2], cosines[0]*sines[1]*sines[2] - sines[0]*cosines[2], 0,
        -sines[1], sines[0]*cosines[1], cosines[0]*cosines[1], 0, 
        0, 0, 0, 1
    ];
    /* NOTE: commented code is supposedly the same thing as the above
            only that they aren't multiplied with each other, much better readabilty in the code below,
            but for some reason some axis rotations weren't working.
    */
    // var rotation_z = [
    //     cosines[2], -sines[2], 0, 0,
    //     sines[2], cosines[2], 0, 0,
    //     0, 0, 1, 0,
    //     0, 0, 0, 1
    // ];
    // var rotation_y = [
    //     -sines[1], 0, cosines[1], 0,
    //     cosines[1], 0, sines[1], 0,
    //     0, 1, 0, 0,
    //     0, 0, 0, 1
    // ];
    // var rotation_x = [
    //     0, cosines[0], -sines[0], 0,
    //     0, sines[0], cosines[0], 0,
    //     1, 0, 0, 0,
    //     0, 0, 0, 1
    // ];
    // matrix = multiplyMatrix(rotation_x, rotation_y, 4, 4, 4);
    // matrix = multiplyMatrix(matrix, rotation_z, 4, 4, 4);
    
    
    return matrix;
}