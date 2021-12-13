class Fish {
    id;
    x;y;z;
    color=[0,0,0];
    size;
    appearance=[0,0,0]; //[yeux, queu, nageoir]
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

    //retourne un poisson aléatoire
    static fishRandom(id, z, fishes){
        
        let pos = [];
        if(id === 0) {
            pos.push(Math.random() * (XMAX - XMIN) + XMIN);
            pos.push(Math.random() * (YMAX - YMIN) + YMIN);
            pos.push(z);
        }
        else {
            pos = generateCorrectPosition(z, fishes);
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

    //returne l'enfant des deux poissons passés en parametre
    static generateChild(fish1, fish2){
        if (fish1 instanceof Fish && fish2 instanceof Fish ){
            return new this(
                (fish1.x+fish2.x)/2,
                (fish1.y+fish2.y)/2,
                (fish1.z+fish2.z)/2,
                mixColor(fish1.color, fish2.color),
                Math.round((fish1.size+fish2.size)/2),
                mixAppearance(fish1.appearance, fish2.appearance),
                Math.round((fish1.ageMax+fish2.ageMax)/2));
        }
        console.error(" Erreur generateChild fish1 or fish2 is not a fish; return fishRandom ");
        return "Erreur";
    }
    

    //obtenir sont score pour vivre (0 = le meilleur)
    getScoreLife(){
        return getScoreComparedToTheBestFish(this, bestFishlife, improtanceLife)
    }

    //obtenir sont score d'interet des humains (0 = le meilleur)
    getScoreToHumain(){
        return getScoreComparedToTheBestFish(this, bestFishToHumain, improtanceToHumain)
    }
}

//retourne une couleur aléatoire
function colorRamdom(){
    return Math.round(Math.random() * TABColor.length);
}

//retourne le mélange des 2 couleurs
function mixColor(color1,color2){
    var aleat= Math.round(Math.random());
    console.log(aleat);
    if(aleat ==0){
        return color1;
    }
    return color2;
}

//retourne une apparence de poisson aléatoire
function appearanceRamdon(){ //TODO

    return  [
        Math.round(Math.random() * MAXeye),
        Math.round(Math.random() * MAXtail),
        Math.round(Math.random() * MAXfin)];
}

//retourne une recombinaison d'apparence avec le pivot aléatoire
function mixAppearance(appearance1,appearance2){ //TODO
    var indice = Math.round(Math.random() * (appearance1.length))
    for (var i=0; i<indice; i++ ){
        appearance1[i]= appearance2[i];
    }
    return appearance1;
}

//fonction pour comparé un poisson et une reférence avec les coef d'importance
function getScoreComparedToTheBestFish(fishToComp, bestFish, improtanceLifacteur){
    var score = 0; // meilleur score= 0

    bestFish.yearsOld = bestFish.ageMax;


    //x y z
    score = score + Math.abs(fishToComp.x - bestFish.x)*improtanceLifacteur["xFacteur"] //x
    score = score + Math.abs(fishToComp.y - bestFish.y)*improtanceLifacteur["yFacteur"] //y
    score = score + Math.abs(fishToComp.z - bestFish.z)*improtanceLifacteur["zFacteur"] //z

    //color
    score = score + Math.abs(fishToComp.color[0] - bestFish.color[0])*improtanceLifacteur["colorFacteur"] // color[0]
    score = score + Math.abs(fishToComp.color[1] - bestFish.color[1])*improtanceLifacteur["colorFacteur"] // color[1]
    score = score + Math.abs(fishToComp.color[2] - bestFish.color[2])*improtanceLifacteur["colorFacteur"] // color[2]

    //size
    score = score + Math.abs(fishToComp.size - bestFish.size)*improtanceLifacteur["sizeFacteur"]

    //Appearance
    score = score + Math.abs(fishToComp.appearance[0] - bestFish.appearance[0])*improtanceLifacteur["appearanceFacteur"] //yeux
    score = score + Math.abs(fishToComp.appearance[1] - bestFish.appearance[1])*improtanceLifacteur["appearanceFacteur"] //queu
    score = score + Math.abs(fishToComp.appearance[2] - bestFish.appearance[2])*improtanceLifacteur["appearanceFacteur"] //nageoires
    
    //age
    score = score + Math.abs(fishToComp.yearsOld - bestFish.ageMax)*improtanceLifacteur["yearsOldFacteur"]

    return score;
}

function generateCorrectPosition(z, fishes) {

    // Generate random coordinates
    let x = getRandomFloat(XMIN, XMAX);
    let y = getRandomFloat(YMIN, YMAX);

    fishes.forEach(fish => {
        while(getDistance(x, y, z, fish.x, fish.y, fish.z) <= 2*Fish.MAXSIZE) {
            x = getRandomFloat(XMIN, XMAX);
            y = getRandomFloat(YMIN, YMAX);
        }
    });

    return [x, y, z];
}


/*--------------------------------------------------------------------*/
/*--------------------        CONCTANTES          --------------------*/
/*--------------------------------------------------------------------*/

const XMIN=0, XMAX=100, YMIN=0, YMAX=100, ZMIN=0, ZMAX=100;
const TABColor= [0,1,2];
const MINSIZE =1,  MAXSIZE =10;
const MINAGEMAX=1,  MAXAGEMAX=30;
const MAXeye=4, MAXtail=2, MAXfin=4; //yeux, queue, nageoir


/* -------------------   POISSONS POUR COMPARER   --------------------*/

// refférence pour le poisson le plus apte pour vivre
bestFishlife = new Fish(0,0,0,0,[0,200,30],5,[2,1,2],5);
//facteur d'importance
var improtanceLife = { 
    "xFacteur" : 0,
    "yFacteur" : 0,
    "zFacteur" : 0,
    "colorFacteur" : 0.01,
    "sizeFacteur" : 1,
    "appearanceFacteur" : 3,
    "yearsOldFacteur" : 2
};

// refférence pour le poisson le plus apte pour etre manger
bestFishToHumain = new Fish(0,0,0,0,[50,60,80],10,[2,1,2],2);
//facteur d'importance
var improtanceToHumain = { 
    "xFacteur" : 0,
    "yFacteur" : 0,
    "zFacteur" : 0,
    "colorFacteur" : 0.05,
    "sizeFacteur" : 2,
    "appearanceFacteur" : 3,
    "yearsOldFacteur" : 1
};


