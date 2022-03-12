class Fisherman{
    static delta = 2;
    static colorTarget = 1;
    static colorFactor = 5;

    static sizeTarget = 6;
    static sizeFactor = 0;

    static nbEyeTarget = 2;
    static nbTailTarget = 1;
    static nbFinTarget = 2;
    static appearanceFactor = 1;

    static yearsOldTarget = 4;
    static yearsOldFactor = 0;

    static goFishing(){
        
        var i=0;
        while (i< FishShoal.fishesArray.length) {
            var tmp = FishShoal.fishesArray[i].getScoreToHuman();
            if (this.isAGoodFish(i)){
                FishShoal.remouveFish(i)
            }else{
                i++;
            }
        }
    }

    static getNbGoodFish(){
        var count = 0;
        for (let i = 0; i < FishShoal.fishesArray.length; i++) {
            if (this.isAGoodFish(i)){
                count++;
            }
        }
        return count;
    }
    static isAGoodFish(i){
        return this.getScoreFish(i) < this.delta;
    }

    static getScoreFish(i){
        return FishShoal.fishesArray[i].getScoreToFishObjectif(
            this.colorTarget, this.colorFactor,
            this.sizeTarget, this.sizeFactor, 
            this.nbEyeTarget, this.nbTailTarget, this.nbFinTarget, this.appearanceFactor, 
            this.yearsOldTarget, this.yearsOldFactor);
    }

    static getMeanScoreFish(){
        var mean = 0;
        for (let i = 0; i < FishShoal.fishesArray.length; i++) {
            mean+= this.getScoreFish(i);
        }
        return mean/FishShoal.fishesArray.length;
    }
}