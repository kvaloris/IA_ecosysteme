function getDistance(x1, y1, z1, x2, y2, z2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

// Add two vectors v1 and v2
function addV3(v1, v2) {
    return { x: v1.x + v2.x, y: v1.y + v2.y, z: v1.z + v2.z};
}

// Substract two vectors v1 and v2
function substractV3(v1, v2) {
    return { x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z};
}

// Multiply a vector v by a constant c
function multiplyV3(v, c) {
    return { x: v.x * c, y: v.y * c, z: v.z * c};
}

// Divide a vector v by a constant c
function divideV3(v, c) {
    return { x: v.x / c, y: v.y / c, z: v.z / c};
}

// Calculate module

function moduleV3(v) {
    return Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2) + Math.pow(v.z, 2));
}

function makeRandMatrix (I , J){
   
	var tab = new Array();
	for (var i=0; i<I; i++) {
		tab.push (new Array);
		for (var j=0; j<J; j++) {
			tab[i].push(getRandomFloat(-2.0,2.0));
		}
	}
	return tab;
}

function makeMatrix (I , J){
	var tab = new Array();
	for (var i=0; i<I; i++) {
		tab.push (new Array);
		for (var j=0; j<J; j++) {
			tab[i].push(0);
		}
	}
	return tab;
}