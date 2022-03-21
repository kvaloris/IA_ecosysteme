/*--------------------------------------------------------------------*/
/*--------------------        CONSTANTES          --------------------*/
/*--------------------------------------------------------------------*/

const BOXSIZE = 600;
const MARGIN = 80;
const XMIN = -BOXSIZE/2 + MARGIN, XMAX = BOXSIZE/2 - MARGIN, YMIN = - BOXSIZE/2 + MARGIN, YMAX = BOXSIZE/2 - MARGIN, ZMIN = - BOXSIZE/2 + MARGIN, ZMAX = BOXSIZE/2 - MARGIN;
const TABColor = [0, 1, 2];
const MINSIZE = 3, MAXSIZE = 10;
const MINAGEMAX = 1, MAXAGEMAX = 6;
const MAXeye = 4, MAXtail = 2, MAXfin = 4; //yeux, queue, nageoir

const SPECIES = ["Mola Mola", "Triclopse",  "Creeps"];

let fishesArray = [];
let eatingPeriod = "no";

function getDistance(x1, y1, z1, x2, y2, z2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
}

function getRandomInt(max, min = 0) {
    return Math.floor(Math.random() *(max - min) + min);
}

const rand = mulberry32(1);
// const randNb = rand();
// console.log("rand : ", randNb);

function getRandomFloat(min, max) {
    // return Math.random() * (max - min) + min;
    return rand() * (max - min) + min;
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

function makeIntMatrix (I , J, a){
	var tab = new Array();
	for (var i=0; i<I; i++) {
		tab.push (new Array);
		for (var j=0; j<J; j++) {
			tab[i].push(a);
		}
	}
	return tab;
}

// Map values from interval1 [A, B] to interval2 [a, b]
function map(value, interval1, interval2) {
	return (value - interval1[0]) / (interval1[1] - interval1[0]) * (interval2[1] - interval2[0]) + interval2[0];
}

function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}