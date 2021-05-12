var then = 0;
/**
 * requests an animation frame and redraws figure drawn with the figure functiion
 * @param  {Function} figure figure to be drawn constantly in the screen
 * @param  {Function} update values to be updated each frame if desired
 * @return {None} returns nothing
 */
function animate(figure, update)
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	update();
	figure();
	window.requestAnimationFrame(function (now) {
		now *= 0.001;
		deltaTime = now - then;
		then = now;
		animate(figure, update);
	});
}