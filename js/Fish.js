import { NeuralNetwork } from "./NeuralNetwork";
import { Ground } from "./Ground"

const pat = [ //modif
    [[0], [0 / (SPECIES.length - 1)]], // Specie A
    [[0.5], [1 / (SPECIES.length - 1)]], // Specie B
    [[1], [2 / (SPECIES.length - 1)]], // Specie C
];

//Creation of the Neural Network
const neuralNetwork = new NeuralNetwork(1, 2, 1);

//Training of the Neural Network
neuralNetwork.train(pat);
console.log("TEST");
neuralNetwork.test(pat);
console.log("FIN TEST");

export class Fish {
    id_3dobject;
    id;
    x; y; z;
    color = [0, 0, 0];
    size;
    appearance = [0, 0, 0]; // [eyes, tail, fin]
    ageMax;
    yearsOld = 0;
    velocity = { x: 0, y: 0, z: 0 }
    specie = SPECIES[0];
    hunger;
    eatObjectifCoordinate;

    constructor(id, x, y, z, color, size, appearance, ageMax, yearsOld = 0, hunger=true, eatObjectifCoordinate) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.z = z;
        this.color = color;
        this.size = size;
        this.appearance = appearance;
        this.ageMax = ageMax;
        this.yearsOld = yearsOld;
        this.specie = this.getSpecie();
        this.hunger = hunger;
        this.eatObjectifCoordinate= eatObjectifCoordinate;

    }

    toString() {
        return 'Poisson id:' + this.id + '; (' + this.x + ',' + this.y + ',' + this.z + '); ' +
            ' color: ' + this.color + ';' +
            ' size: ' + this.size + ';' +
            ' appearance: ' + this.appearance + ';' +
            ' ageMax: ' + this.ageMax + ';' +
            ' yearsOld: ' + this.yearsOld + ';' +
            ' scoreLife: ' + this.getScoreLife() + ';';
    }

    // Return a random fish
    static fishRandom(id, fishes) {
        let pos = positionRamdon();
        let colorRand = colorRandom(); 
        let newMaxAge = ageMaxRandom();
        return new this(
            id,
            pos[0],
            pos[1],
            pos[2],
            colorRand,
            sizeRandom(),
            appearanceRamdon(),
            newMaxAge,
            Math.round(Math.random() * (newMaxAge - 1)),
            true,
            false);
    }

    // Return the child of fish 1 and fish 2
    static generateChild(id, fish1, fish2, fishes, mutChance) {
        if (fish1 instanceof Fish && fish2 instanceof Fish) {

            let pos = mixPosition([fish1.x,fish1.y,fish1.z], [fish2.x,fish2.y,fish2.z]);
            var child = new this(
                id,
                pos[0],
                pos[1],
                pos[2],
                mixColor(fish1.color, fish2.color),
                Math.round((fish1.size + fish2.size) / 2),
                mixAppearance(fish1.appearance, fish2.appearance),
                Math.round((fish1.ageMax + fish2.ageMax) / 2)
            );
            if (Math.random() < mutChance) {
                child = mutFish(child);
            }
            return child;
        }
        console.error(" Erreur generateChild fish1 or fish2 is not a fish; return fishRandom ");
        return "Erreur";
    }


    // Return the score for its ability to live ( 0 = best)
    getScoreLife() {
        return getScoreComparedToTheBestFish(this, bestFishlife, importanceLife)
    }

    getScoreToFishObjectif(color, colorFactor, size,sizeFactor, eye, tail, fin, appearanceFactor, yearsOld, yearsOldFactor) {
        var score = 0; //  best score = 0

        if(color!=null){
            score = score + (this.color === color ? 0 : 1 * colorFactor); // color
        }
        
        if(size!=null){
            score = score + Math.abs(this.size - size) * sizeFactor;
        }
        if(eye!=null){
            score = score + Math.abs(this.appearance[0] - eye) * appearanceFactor; //yeux
        }

        if(tail!=null){
            score = score + Math.abs(this.appearance[1] - tail) * appearanceFactor; //yeux
        }

        if(fin!=null){
            score = score + Math.abs(this.appearance[2] - fin) * appearanceFactor; //yeux
        }

        if(yearsOld!=null){
            score = score + Math.abs(this.yearsOld - yearsOld) * yearsOldFactor;
        }
        return score;
    }


    // BOIDS

    // Separation
    separate(fishes, c) {

        const dmin = 50;

        let v = { x: 0, y: 0, z: 0 };

        if(fishes.length < 2) return v;

        // Operate on all fishes other than this
        fishes.filter(fish => fish !== this).forEach(fish => {
            let d = getDistance(this.x, this.y, this.z, fish.x, fish.y, fish.z);
            // If there are fishes with a distance of dmin of this
            // move this fish in the opposite direction
            if (d < dmin) {
                let TF = substractV3({ x: fish.x, y: fish.y, z: fish.z }, { x: this.x, y: this.y, z: this.z });
                v = substractV3({ x: v.x, y: v.y, z: v.z }, { x: TF.x, y: TF.y, z: TF.z });
            }
        });

        v = multiplyV3(v, c);

        return v;
    }

    // Alignement
    align(fishes, c) {

        let v = { x: 0, y: 0, z: 0 };

        if(fishes.length < 2) return v;

        // Operate on all fishes other than this
        fishes.filter(fish => fish !== this).forEach(fish => {
            v = addV3(v, fish.velocity);
        });

        v = divideV3(v, fishes.length - 1);
        v = substractV3(v, this.velocity);
        v = multiplyV3(v, c);

        return v;
    }

    // Cohesion
    aggregate(fishes, c) {

        let v = { x: 0, y: 0, z: 0 };
        
        if(fishes.length < 2) return v;

        // Operate on all fishes other than this
        fishes.filter(fish => fish !== this).forEach(fish => {
            v = addV3(v, { x: fish.x, y: fish.y, z: fish.z });
        });

        v = divideV3(v, fishes.length - 1);
        v = substractV3(v, { x: this.x, y: this.y, z: this.z });
        v = multiplyV3(v, c);

        return v;
    }

    // Keep the flock within a certain area
    bound() {
        const xmin = XMIN; const xmax = XMAX;
        const ymin = YMIN; const ymax = YMAX;
        const zmin = ZMIN; const zmax = ZMAX;

        const d = 0.1;

        let v = { x: 0, y: 0, z: 0 };

        if (this.x < xmin) v.x = d;
        else if (this.x > xmax) v.x = -d;
        if (this.y < ymin) v.y = d;
        else if (this.y > ymax) v.y = -d;
        if (this.z < zmin) v.z = d;
        else if (this.z > zmax) v.z = -d;

        return v;
    }

    // Limit the speed of the boid
    limitSpeed() {
        const vlim = 3;

        if (moduleV3(this.velocity) > vlim) {
            this.velocity = divideV3(this.velocity, moduleV3(this.velocity));
            this.velocity = multiplyV3(this.velocity, vlim);
        }
    }

    // Update the position of fish
    move(fishes, c_ag, c_s, c_al) {
        this.velocity = addV3(this.velocity, this.separate(fishes, c_s));
        this.velocity = addV3(this.velocity, this.aggregate(fishes, c_ag));
        this.velocity = addV3(this.velocity, this.align(fishes, c_al));
        this.velocity = addV3(this.velocity, this.bound());
        // this.velocity = addV3(addV3(addV3(addV3(this.velocity, this.aggregate(fishes, c_ag)), this.separate(fishes, c_s)), this.bound()), this.align(fishes, c_al));
    }

    // Return true if fish is no longer searching for food
    moveToEat() {
        if(!this.hunger) return true;

            // Searches a target
            if (!this.eatObjectifCoordinate
                ||( this.eatObjectifCoordinate &&!Ground.coralIsExiste(this.eatObjectifCoordinate.i,this.eatObjectifCoordinate.j))){
                this.eatObjectifCoordinate = Ground.findCoordinatesType(getTypeOfCoral(this.color));
            }
            //Ground.coralIsExiste(x,y);
            // If no target, end
            if(!this.eatObjectifCoordinate) return true;

            // Target's coordinates
            const x = this.eatObjectifCoordinate.x;
            const y = -290;
            const z = this.eatObjectifCoordinate.z;
            const coralPositionVector = {x: x, y: y, z: z};
            
            let v = substractV3(coralPositionVector, {x: this.x, y: this.y, z: this.z});
            v = multiplyV3(v, 0.01);
            this.velocity = addV3(this.velocity, v);
            
            if(getDistance(this.x, this.y, this.z, x, y, z) <= 10) { // If very close, eats
                this.hunger=false;
                // this.eatObjectifCoordinate = false;
                const type = Ground.getTypeElement(this.eatObjectifCoordinate.i, this.eatObjectifCoordinate.j);
                Ground.eatCoral(this.eatObjectifCoordinate.i, this.eatObjectifCoordinate.j); 
                return true;
            }

            return false;
        
    }

    update(){
        this.limitSpeed();
        let position = addV3({ x: this.x, y: this.y, z: this.z }, this.velocity);
        this.x = position.x;
        this.y = position.y;
        this.z = position.z;
    }

    updatePosition(fishes, c_ag, c_s, c_a) {
        this.move(fishes, c_ag, c_s, c_a);
        this.limitSpeed();
        let position = addV3({ x: this.x, y: this.y, z: this.z }, this.velocity);
        this.x = position.x;
        this.y = position.y;
        this.z = position.z;
    }
    
    getSpecie() {
        // Normalize
        const size = map(this.size, [MINSIZE, MAXSIZE], [0, 1]);
        const ageMax = map(this.ageMax, [MINAGEMAX, MAXAGEMAX], [0, 1]);
        const color = map(this.color, [0, TABColor.length - 1], [0, 1]);
        const eyes = map(this.color, [0, MAXeye], [0, 1]);
        const index = neuralNetwork.output([color]); //modif
        return SPECIES[index];
    }
}


function positionRamdon() {
    return [
        getRandomFloat(XMIN, XMAX),
        getRandomFloat(YMIN, YMAX),
        getRandomFloat(ZMIN, ZMAX)];
}

function mixPosition(position1, position2){
    return[
        Math.round((position1[0] + position2[0]) / 2),
        Math.round((position1[1] + position2[1]) / 2),
        Math.round((position1[2] + position2[2]) / 2)
    ]
}


// Return a random color
function colorRandom() {
    return Math.round(Math.random() * (TABColor.length - 1));
}

// Return the mix of 2 colors
function mixColor(color1, color2) {
    var aleat = Math.round(Math.random());
    if (aleat == 0) {
        return color1;
    }
    return color2;
}

function sizeRandom() {
    return Math.round(Math.random() * (MAXSIZE - MINSIZE) + MINSIZE);
}
// Return a random appearance 
function appearanceRamdon() { //TODO

    return [
        Math.round(Math.random() * MAXeye),
        Math.round(Math.random() * MAXtail),
        Math.round(Math.random() * MAXfin)];
}

// Return a recombination of appearance with random pivot
function mixAppearance(appearance1, appearance2) { //TODO
    var indice = Math.round(Math.random() * (appearance1.length))
    for (var i = 0; i < indice; i++) {
        appearance1[i] = appearance2[i];
    }
    return appearance1;
}

function ageMaxRandom() {
    return Math.round(Math.random() * (MAXAGEMAX - MINAGEMAX) + MINAGEMAX);
}

function mutFish(fishInit) {
    var parameter = Math.floor(Math.random() * 4) //return 0, 1, 2, 3
    switch (parameter) {
        case 0:
            fishInit.color = colorRandom();
            break;
        case 1:
            fishInit.size = sizeRandom();
            break;
        case 2:
            fishInit.appearance = appearanceRamdon();
            break;
        default:
            fishInit.ageMax = ageMaxRandom();
            break;
    }
    return fishInit;
}

function getTypeOfCoral(color) {
    switch (color) {
        case 0: // yellow fish
            return 2; // yellow coral
        case 1: // blue fish
            return 1; // blue coral
        case 2: // red fish
            return 3; // red coral
        default:
            return -1;
    }
}

// Compare a fish and a reference with importance coefficients
function getScoreComparedToTheBestFish(fishToComp, bestFish, importanceFactor) {
    var score = 0; //  best score = 0

    bestFish.yearsOld = bestFish.ageMax;


    //x y z
    score = score + Math.abs(fishToComp.x - bestFish.x) * importanceFactor["xFactor"]; //x
    score = score + Math.abs(fishToComp.y - bestFish.y) * importanceFactor["yFactor"]; //y
    score = score + Math.abs(fishToComp.z - bestFish.z) * importanceFactor["zFactor"]; //z

    // Color
    score = score + (fishToComp.color === bestFish.color ? 0 : 1 * importanceFactor["colorFactor"]); // color

    // Size
    score = score + Math.abs(fishToComp.size - bestFish.size) * importanceFactor["sizeFactor"];

    // Appearance
    score = score + Math.abs(fishToComp.appearance[0] - bestFish.appearance[0]) * importanceFactor["appearanceFactor"]; //yeux
    score = score + Math.abs(fishToComp.appearance[1] - bestFish.appearance[1]) * importanceFactor["appearanceFactor"]; //queu
    score = score + Math.abs(fishToComp.appearance[2] - bestFish.appearance[2]) * importanceFactor["appearanceFactor"]; //nageoires

    // Age
    score = score + Math.abs(fishToComp.yearsOld - bestFish.ageMax) * importanceFactor["yearsOldFactor"];

    return score;
}


/* -------------------   FISHES FOR REFERENCE  --------------------*/

// Reference for fish most suited for living
const bestFishlife = new Fish(0, 0, 0, 0, 1, 5, [2, 1, 2], 5);

// Importance coefficient
var importanceLife = {
    "xFactor": 0 / XMAX,
    "yFactor": 0 / YMAX,
    "zFactor": 0 / ZMAX,
    "colorFactor": 5,
    "sizeFactor": 1 / MAXSIZE,
    "appearanceFactor": 0,
    "yearsOldFactor": 0 / MAXAGEMAX
};

// Reference for fish most suited for being eaten by humans
const bestFishToHuman = new Fish(0, 0, 0, 0, 1, 10, [2, 1, 2], 2);
// Importance coefficient
var importanceToHuman = {
    "xFactor": 0 / XMAX,
    "yFactor": 0 / YMAX,
    "zFactor": 0 / ZMAX,
    "colorFactor": 3,
    "sizeFactor": 1 / MAXSIZE,
    "appearanceFactor": 3,
    "yearsOldFactor": 0 / MAXAGEMAX
};


