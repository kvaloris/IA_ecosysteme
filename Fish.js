class Fish {
    x;
    y;
    z;
    color=[0,0,0];
    size;
    appearance=[0,0,0]; //[yeux, queu, nagoir]
    ageMax;
    yearsOld=0;
    constructor(x,y,z,color,size,appearance,ageMax ){
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
                '<br/>';
    }

    static fishLambda(){
        return new this(0,0,0,[0,0,0],2,'normale',10);
    }

    static fishRamdom(xMin, xMax, yMin, yMax, zMin, zMax ){
        var minSize =1;
        var maxSize =10;
        var minAgeMax=1;
        var maxAgeMax=30;
        return new this(
            Math.random() * (xMax - xMin) + xMin,
            Math.random() * (yMax - yMin) + yMin,
            Math.random() * (zMax - zMin) + zMin,
            colorRamdom(),
            Math.floor(Math.random() * (maxSize - minSize) + minSize),
            appearanceRamdon(),
            Math.floor(Math.random() * (maxAgeMax - minAgeMax) + minAgeMax));
    }

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
        return "Erreur";
    }

    static bestFishlife = new this(0,0,0,[0,200,30],5,[2,1,2],5);
    

    getScoreLife(){
        var score = 0; // meilleur score= 0

        // improtance
        var xFacteur = 0;
        var yFacteur = 0;
        var zFacteur = 0;
        var colorFacteur=0.01;
        var sizeFacteur=1;
        var appearanceFacteur=3;
        var yearsOldFacteur=2;

        Fish.bestFishlife.yearsOld = Fish.bestFishlife.ageMax;


        //x y z
        score = score + Math.abs(this.x - Fish.bestFishlife.x)*xFacteur //x
        score = score + Math.abs(this.y - Fish.bestFishlife.y)*yFacteur //y
        score = score + Math.abs(this.z - Fish.bestFishlife.z)*zFacteur //z

        //color
        score = score + Math.abs(this.color[0] - Fish.bestFishlife.color[0])*colorFacteur // color[0]
        score = score + Math.abs(this.color[1] - Fish.bestFishlife.color[1])*colorFacteur // color[1]
        score = score + Math.abs(this.color[2] - Fish.bestFishlife.color[2])*colorFacteur // color[2]

        //size
        score = score + Math.abs(this.size - Fish.bestFishlife.size)*sizeFacteur

        //Appearance
        score = score + Math.abs(this.appearance[0] - Fish.bestFishlife.appearance[0])*appearanceFacteur //yeux
        score = score + Math.abs(this.appearance[1] - Fish.bestFishlife.appearance[1])*appearanceFacteur //queu
        score = score + Math.abs(this.appearance[2] - Fish.bestFishlife.appearance[2])*appearanceFacteur //nagoires
        
        //age
        score = score + Math.abs(this.yearsOld - Fish.bestFishlife.ageMax)*yearsOldFacteur

        return score;
    }

    
}

function colorRamdom(){
    return [
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255)];
}

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

function appearanceRamdon(){ //TODO

    return  [
        Math.floor(Math.random() * 4),
        Math.floor(Math.random() * 2),
        Math.floor(Math.random() * 4)];
}
function mixAppearance(appearance1,appearance2){ //TODO
    var indice = Math.floor(Math.random() * (appearance1.length))
    for (var i=0; i<indice; i++ ){
        appearance1[i]= appearance2[i];
    }
    return appearance1;
}

function dec2bin(dec) {
    return (dec >>> 0).toString(2);
}

