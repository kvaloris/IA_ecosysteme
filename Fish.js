class Fish {
    x;
    y;
    color;
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
        return new this(0,0,'red',2,'normale',10);
    }
}