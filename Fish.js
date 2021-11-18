class Fish {
    x;
    y;
    color=[0,0,0];
    size;
    typeFish;
    ageMax;
    yearsOld=0;
    constructor(x,y,color,size,typeFish,ageMax ){
        this.x = x;
        this.y = y;
        this.color=color;
        this.size=size;
        this.typeFish=typeFish;
        this.ageMax= ageMax;
        this.yearsOld=0;
    }


    toString (){
        return 'Caractéristique: <br/>' + 
                '     - position: ('+this.x+';'+this.y+')'+
                '<br/>- color: '+this.color+
                '<br/>- size: '+this.size+
                '<br/>- typeFish: '+this.typeFish+
                '<br/>- ageMax: '+ this.ageMax+
                '<br/>- yearsOld: '+ this.yearsOld;
    }

    static fishLambda(){
        return new this(0,0,[0,0,0],2,'normale',10);
    }

    static fishRamdom(xMin, xMax, yMin, yMax){
        var minSize =1;
        var maxSize =10;
        var minAgeMax=5;
        var maxAgeMax=50;
        return new this(
            Math.random() * (xMax - xMin) + xMin,
            Math.random() * (yMax - yMin) + yMin,
            colorRamdom(),
            Math.floor(Math.random() * (maxSize - minSize) + minSize),
            typeFishRamdon(),
            Math.floor(Math.random() * (maxAgeMax - minAgeMax) + minAgeMax));
    }

    static generateChild(fish1, fish2){
        if (fish1 instanceof Fish && fish2 instanceof Fish ){
            return new this(
                (fish1.x+fish2.x)/2,
                (fish1.y+fish2.y)/2,
                mixColor(fish1.color, fish2.color),
                Math.floor((fish1.size+fish2.size)/2),
                mixTypeFish(fish1.typeFish, fish2.typeFish),
                Math.floor((fish1.ageMax+fish2.ageMax)/2));
        }
        return "Erreur";
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

function typeFishRamdon(){ //TODO
    return "unType";
}
function mixTypeFish(typeFish1,typeFish2){ //TODO
    return "ramdom type";
}
