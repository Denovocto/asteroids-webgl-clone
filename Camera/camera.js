var projection_modes = {
    PERSPECTIVE: "perspective",
    ORTHOGONAL: "orthogonal"
};

function changeView(cam){
    var viewMatrix = lookAt(cam.eye, cam.at, cam.up);
    var viewMatrixLocation = gl.getUniformLocation(program, "vMatrix");
    gl.uniformMatrix4fv(viewMatrixLocation, false, flatten(viewMatrix));
}

function changePerspective(projection){
    var projectionMatrixLocation = gl.getUniformLocation(program, "pMatrix");
    if (projection.mode === projection_modes.PERSPECTIVE){
        var perspectiveMatrix = perspective(projection.fov, projection.aspect, projection.near, projection.far);
        gl.uniformMatrix4fv(projectionMatrixLocation, false, flatten(perspectiveMatrix));
    }
    else{
        var orthogonalMatrix = ortho(projection.left, projection.right, projection.bottom, projection.top, projection.near, projection.far);
        gl.uniformMatrix4fv(projectionMatrixLocation, false, flatten(orthogonalMatrix));
    }
}