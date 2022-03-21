import * as FishShoal from "./FishShoal.js";

export class Fisherman{

    // Criterias for fish to catch
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

    // Remove fishes corresponding to criteria from the 3D group and the array of fishes
    static goFishing(fishesGroup){
        
        var i=0;
        while (i< fishesArray.length) {
            if (this.isAGoodFish(i)){
                FishShoal.removeFish(i, fishesGroup);
            }else{
                i++;
            }
        }
    }

    static getNbGoodFish(){
        var count = 0;
        for (let i = 0; i < fishesArray.length; i++) {
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
        return fishesArray[i].getScoreToFishObjectif(
            this.colorTarget, this.colorFactor,
            this.sizeTarget, this.sizeFactor, 
            this.nbEyeTarget, this.nbTailTarget, this.nbFinTarget, this.appearanceFactor, 
            this.yearsOldTarget, this.yearsOldFactor);
    }

    static getMeanScoreFish(){
        var mean = 0;
        for (let i = 0; i < fishesArray.length; i++) {
            mean+= this.getScoreFish(i);
        }
        return mean/fishesArray.length;
    }
}