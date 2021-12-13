class Fish {
    id;
    x;y;z;
    color=[0,0,0];
    size;
    appearance=[0,0,0]; //[yeux, queu, nageoir]
    ageMax;
    yearsOld=0;

    constructor(id, x,y,z,color,size,appearance,ageMax ){
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
    static fishRamdom(id){
        return new this(
            id,
            Math.random() * (XMAX - XMIN) + XMIN,
            Math.random() * (YMAX - YMIN) + YMIN,
            Math.random() * (ZMAX - ZMIN) + ZMIN,
            colorRamdom(),
            Math.floor(Math.random() * (MAXSIZE - MINSIZE) + MINSIZE),
            appearanceRamdon(),
            Math.floor(Math.random() * (MAXAGEMAX - MINAGEMAX) + MINAGEMAX));
    }

    //returne l'enfant des deux poissons passés en parametre
    static generateChild(fish1, fish2){
        if (fish1 instanceof Fish && fish2 instanceof Fish ){
            return new this(
                (fish1.x+fish2.x)/2,
                (fish1.y+fish2.y)/2,
                (fish1.z+fish2.z)/2,
                mixColor(fish1.color, fish2.color),
                Math.floor((fish1.size+fish2.size)/2),
                mixAppearance(fish1.appearance, fish2.appearance),
                Math.floor((fish1.ageMax+fish2.ageMax)/2));
        }
        console.error(" Erreur generateChild fish1 or fish2 is not a fish; return fishRamdom ");
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
    return [
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255)];
}

//retourne le mélange des 2 couleurs
function mixColor(color1,color2){
    if (Array.isArray(color1)&& Array.isArray(color2)
        && color1.length==3 &&color2.length==3){
            return [
                Math.floor((color1[0]+color2[0])/2),
                Math.floor((color1[1]+color2[1])/2),
                Math.floor((color1[2]+color2[2])/2)];
    }
    return "Erreur";
}

//retourne une apparence de poisson aléatoire
function appearanceRamdon(){ //TODO

    return  [
        Math.floor(Math.random() * MAXeye),
        Math.floor(Math.random() * MAXtail),
        Math.floor(Math.random() * MAXfin)];
}

//retourne une recombinaison d'apparence avec le pivot aléatoire
function mixAppearance(appearance1,appearance2){ //TODO
    var indice = Math.floor(Math.random() * (appearance1.length))
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


/*--------------------------------------------------------------------*/
/*--------------------        CONCTANTES          --------------------*/
/*--------------------------------------------------------------------*/

const XMIN=0, XMAX=100, YMIN=0, YMAX=100, ZMIN=0, ZMAX=100;
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
