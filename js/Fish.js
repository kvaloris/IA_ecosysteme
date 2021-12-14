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
        return 'Poisson id:'+ this.id+'; ('+this.x+','+this.y+','+this.z+'); ' + 
                ' color: '+this.color+';'+
                ' size: '+this.size+';'+
                ' appearance: '+this.appearance+';'+
                ' ageMax: '+ this.ageMax+';'+
                ' yearsOld: '+ this.yearsOld+';'+
                ' scoreLife: '+this.getScoreLife()+';'+
                ' scoreToHuman: '+this.getScoreToHuman()+';';
    }

    // Return a random fish
    static fishRandom(id, fishes){
        
        let pos = generateCorrectPosition(fishes);

        return new this(
            id,
            pos[0],
            pos[1],
            pos[2],
            colorRandom(),
            Math.round(Math.random() * (MAXSIZE - MINSIZE) + MINSIZE),
            appearanceRamdon(),
            Math.round(Math.random() * (MAXAGEMAX - MINAGEMAX) + MINAGEMAX));
    }

    // Return the child of fish 1 and fish 2
    static generateChild(id, fish1, fish2, fishes){
        if (fish1 instanceof Fish && fish2 instanceof Fish ){

            let pos =  generateCorrectPosition(fishes);

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
        return getScoreComparedToTheBestFish(this, bestFishlife, importanceLife)
    }

    // Return its score for human interest ( 0 = best)
    getScoreToHuman(){
        return getScoreComparedToTheBestFish(this, bestFishToHuman, importanceToHuman)
    }
}

// Return an array of correct coordinates 
function generateCorrectPosition(fishes) {

    // Generate random coordinates
    let x = getRandomFloat(XMIN, XMAX);
    let y = getRandomFloat(YMIN, YMAX);
    let z = getRandomFloat(ZMIN, ZMAX);

    if(fishes.length != 0) {
        fishes.forEach(fish => {
            while(getDistance(x, y, z, fish.x, fish.y, fish.z) <= 1 + Fish.MAXSIZE) {
                x = getRandomFloat(XMIN, XMAX);
                y = getRandomFloat(YMIN, YMAX);
                z = getRandomFloat(ZMIN, ZMAX);
            }
        });
    }

    return [x, y, z];
}

// Return a random color
function colorRandom(){
    return Math.round(Math.random() * (TABColor.length - 1));
}

// Return the mix of 2 colors
function mixColor(color1,color2){
    var aleat = Math.round(Math.random());
    if(aleat == 0){
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
function getScoreComparedToTheBestFish(fishToComp, bestFish, importanceFactor){
    var score = 0; //  best score = 0

    bestFish.yearsOld = bestFish.ageMax;


    //x y z
    score = score + Math.abs(fishToComp.x - bestFish.x)*importanceFactor["xFactor"]; //x
    score = score + Math.abs(fishToComp.y - bestFish.y)*importanceFactor["yFactor"]; //y
    score = score + Math.abs(fishToComp.z - bestFish.z)*importanceFactor["zFactor"]; //z

    //color
    score = score + (fishToComp.color === bestFish.color ? 0 : 1*importanceFactor["colorFactor"]); // color
    
    //size
    score = score + Math.abs(fishToComp.size - bestFish.size)*importanceFactor["sizeFactor"];
    
    //Appearance
    score = score + Math.abs(fishToComp.appearance[0] - bestFish.appearance[0])*importanceFactor["appearanceFactor"]; //yeux
    score = score + Math.abs(fishToComp.appearance[1] - bestFish.appearance[1])*importanceFactor["appearanceFactor"]; //queu
    score = score + Math.abs(fishToComp.appearance[2] - bestFish.appearance[2])*importanceFactor["appearanceFactor"]; //nageoires
    
    //age
    score = score + Math.abs(fishToComp.yearsOld - bestFish.ageMax)*importanceFactor["yearsOldFactor"];

    return score;
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
bestFishlife = new Fish(0,0,0,0,1,5,[2,1,2],5);

// importance coefficient
var importanceLife = { 
    "xFactor" : 0/XMAX,
    "yFactor" : 0/YMAX,
    "zFactor" : 0/ZMAX,
    "colorFactor" : 5,
    "sizeFactor" : 1/MAXSIZE,
    "appearanceFactor" : 0,
    "yearsOldFactor" : 0/MAXAGEMAX
};

// reference for fish most suited for being eaten by humans
bestFishToHuman = new Fish(0,0,0,0,[50,60,80],10,[2,1,2],2);
// importance coefficient
var importanceToHuman = { 
    "xFactor" : 0/XMAX,
    "yFactor" : 0/YMAX,
    "zFactor" : 0/ZMAX,
    "colorFactor" : 0.05,
    "sizeFactor" : 2/MAXSIZE,
    "appearanceFactor" : 3,
    "yearsOldFactor" : 10/MAXAGEMAX
};


