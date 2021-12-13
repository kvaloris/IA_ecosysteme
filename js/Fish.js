class Fish {
    id;
    x;y;z;
    color=[0,0,0];
    size;
    appearance=[0,0,0]; // [eyes, tail, fin]
    ageMax;
    yearsOld=0;

    constructor(id,x,y,z,color,size,appearance,ageMax ){
        this.id = id;
        this.x = x;
        this.y = y;
        this.z = z;
        this.color=color;
        this.size=size;
        this.appearance=appearance;
        this.ageMax= ageMax;
        this.yearsOld=0;
    }

    toString (){
        return 'Caractéristique: <br/>' + 
                '     - position: ('+this.x+';'+this.y+';'+this.z+')'+
                '<br/>- color: '+this.color+
                '<br/>- size: '+this.size+
                '<br/>- appearance: '+this.appearance+
                '<br/>- ageMax: '+ this.ageMax+
                '<br/>- yearsOld: '+ this.yearsOld+
                '<br/>- scoreLife: '+this.getScoreLife()+
                '<br/>- scoreToHumain: '+this.getScoreToHumain()+
                '<br/>';
    }

    // Return a random fish
    static fishRandom(id, fishes){
        
        let pos = [];
        if(id === 0) {
            pos.push(Math.random() * (XMAX - XMIN) + XMIN);
            pos.push(Math.random() * (YMAX - YMIN) + YMIN);
            pos.push(Math.random() * (ZMAX - ZMIN) + ZMIN);
        }
        else {
            pos = generateCorrectPosition(fishes);
        }

        return new this(
            id,
            pos[0],
            pos[1],
            pos[2],
            colorRamdom(),
            Math.round(Math.random() * (MAXSIZE - MINSIZE) + MINSIZE),
            appearanceRamdon(),
            Math.round(Math.random() * (MAXAGEMAX - MINAGEMAX) + MINAGEMAX));
    }

    // Return the child of fish 1 and fish 2
    static generateChild(id, fish1, fish2, fishes){
        if (fish1 instanceof Fish && fish2 instanceof Fish ){

            let pos = [];
            if(id === 0) {
                pos.push(Math.random() * (XMAX - XMIN) + XMIN);
                pos.push(Math.random() * (YMAX - YMIN) + YMIN);
                pos.push(Math.random() * (ZMAX - ZMIN) + ZMIN);
            }
            else {
                pos = generateCorrectPosition(fishes);
            }

            return new this(
                id,
                pos[0],
                pos[1],
                pos[2],
                mixColor(fish1.color, fish2.color),
                Math.round((fish1.size+fish2.size)/2),
                mixAppearance(fish1.appearance, fish2.appearance),
                Math.round((fish1.ageMax+fish2.ageMax)/2));
        }
        console.error(" Erreur generateChild fish1 or fish2 is not a fish; return fishRandom ");
        return "Erreur";
    }
    

    // Return the score for its ability to live ( 0 = best)
    getScoreLife(){
        return getScoreComparedToTheBestFish(this, bestFishlife, improtanceLife)
    }

    // Return its score for human interest ( 0 = best)
    getScoreToHumain(){
        return getScoreComparedToTheBestFish(this, bestFishToHumain, improtanceToHumain)
    }
}

// Return a random color
function colorRamdom(){
    return Math.round(Math.random() * (TABColor.length - 1));
}

// Return the mix of 2 colors
function mixColor(color1,color2){
    var aleat= Math.round(Math.random());
    // console.log(aleat);
    if(aleat ==0){
        return color1;
    }
    return color2;
}

// Return a random appearance 
function appearanceRamdon(){ //TODO

    return  [
        Math.round(Math.random() * MAXeye),
        Math.round(Math.random() * MAXtail),
        Math.round(Math.random() * MAXfin)];
}

// Return a recombination of appearance with random pivot
function mixAppearance(appearance1,appearance2){ //TODO
    var indice = Math.round(Math.random() * (appearance1.length))
    for (var i=0; i<indice; i++ ){
        appearance1[i]= appearance2[i];
    }
    return appearance1;
}

// Compare a fish and a reference with importance coefficients
function getScoreComparedToTheBestFish(fishToComp, bestFish, improtanceLifacteur){
    var score = 0; //  best score = 0

    bestFish.yearsOld = bestFish.ageMax;


    //x y z
    score = score + Math.abs(fishToComp.x - bestFish.x)*improtanceLifacteur["xFacteur"]; //x
    score = score + Math.abs(fishToComp.y - bestFish.y)*improtanceLifacteur["yFacteur"]; //y
    score = score + Math.abs(fishToComp.z - bestFish.z)*improtanceLifacteur["zFacteur"]; //z

    //color
    score = score + (fishToComp.color - bestFish.color ==0 ? 0 : 1*improtanceLifacteur["colorFacteur"]); // color[0]
    
    //size
    score = score + Math.abs(fishToComp.size - bestFish.size)*improtanceLifacteur["sizeFacteur"];

    //Appearance
    score = score + Math.abs(fishToComp.appearance[0] - bestFish.appearance[0])*improtanceLifacteur["appearanceFacteur"]; //yeux
    score = score + Math.abs(fishToComp.appearance[1] - bestFish.appearance[1])*improtanceLifacteur["appearanceFacteur"]; //queu
    score = score + Math.abs(fishToComp.appearance[2] - bestFish.appearance[2])*improtanceLifacteur["appearanceFacteur"]; //nageoires
    
    //age
    score = score + Math.abs(fishToComp.yearsOld - bestFish.ageMax)*improtanceLifacteur["yearsOldFacteur"];

    return score;
}

function generateCorrectPosition(fishes) {

    // Generate random coordinates
    let x = getRandomFloat(XMIN, XMAX);
    let y = getRandomFloat(YMIN, YMAX);
    let z = getRandomFloat(ZMIN, ZMAX);

    fishes.forEach(fish => {
        while(getDistance(x, y, z, fish.x, fish.y, fish.z) <= 1 + Fish.MAXSIZE) {
            x = getRandomFloat(XMIN, XMAX);
            y = getRandomFloat(YMIN, YMAX);
            z = getRandomFloat(ZMIN, ZMAX);
        }
    });

    return [x, y, z];
}


/*--------------------------------------------------------------------*/
/*--------------------        CONSTANTES          --------------------*/
/*--------------------------------------------------------------------*/

const XMIN=0, XMAX=100, YMIN=0, YMAX=100, ZMIN=0, ZMAX=100;
const TABColor= [0,1,2];
const MINSIZE =3,  MAXSIZE =10;
const MINAGEMAX=1,  MAXAGEMAX=30;
const MAXeye=4, MAXtail=2, MAXfin=4; //yeux, queue, nageoir


/* -------------------   FISHES FOR REFERENCE  --------------------*/

// reference for fish most suited for living
bestFishlife = new Fish(0,0,0,0,[0,200,30],5,[2,1,2],5);
// importance coefficient
var improtanceLife = { 
    "xFacteur" : 0/XMAX,
    "yFacteur" : 0/YMAX,
    "zFacteur" : 0/ZMAX,
    "colorFacteur" : 5,
    "sizeFacteur" : 1/ MAXSIZE,
    "appearanceFacteur" : 0,
    "yearsOldFacteur" : 0/MAXAGEMAX
};

// reference for fish most suited for being eaten by humans
bestFishToHumain = new Fish(0,0,0,0,[50,60,80],10,[2,1,2],2);
// importance coefficient
var improtanceToHumain = { 
    "xFacteur" : 0,
    "yFacteur" : 0,
    "zFacteur" : 0,
    "colorFacteur" : 0.05,
    "sizeFacteur" : 2,
    "appearanceFacteur" : 3,
    "yearsOldFacteur" : 1
};


