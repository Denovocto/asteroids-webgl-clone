function collision(ship, asteroid){ //problema con distance

	var collisionX, collisionY;
	var ax = parseFloat(ship["center"][0].toFixed(2)) - ship["distance"];
	var bx = parseFloat(ship["center"][0].toFixed(2)) + ship["distance"];
	var cx = parseFloat(asteroid["center"][0].toFixed(2)) - asteroid["distance"];
	var dx = parseFloat(asteroid["center"][0].toFixed(2)) + asteroid["distance"];
	var ay = parseFloat(ship["center"][1].toFixed(2)) - ship["distance"];
	var by = parseFloat(ship["center"][1].toFixed(2)) + ship["distance"];
	var cy = parseFloat(asteroid["center"][1].toFixed(2)) - asteroid["distance"];
	var dy = parseFloat(asteroid["center"][1].toFixed(2)) + asteroid["distance"];
    collisionX = (bx > cx && bx < dx) || (ax < dx && ax > cx); 
    collisionY = (by > cy && by < dy) || (ay < dy && ay > cy);
	return collisionX && collisionY;
};
function torusGeometry(transform)
{
    if (transform["center"][0] > 1) {
        transform["center"][0] = -1;
    } else if (transform["center"][0] < -1) {
        transform["center"][0] = 1;
    }
    
    if (transform["center"][1] > 1) {
        transform["center"][1] = -1;
    } else if (transform["center"][0] < -1) {
        transform["center"][1] = 1;
    }
}
