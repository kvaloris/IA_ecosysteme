class FishShoal{

    static fishesArray = [];

    static init(number) {
        for(let i=0; i< number; i++){
            this.fishesArray.push(Fish.fishRandom(i, this.fishesArray));
        }
    }

    
    static toString(){
        var text ="";
        for(var i=0; i< this.fishesArray.length; i++){
            text = text + this.fishesArray[i].toString()+ '</br>';
        }
        return text;
    }
    static nextYear(){ //TODO
        for(var i=0; i< this.fishesArray.length; i++){
            this.fishesArray[i].yearsOld ++;
            if (this.fishesArray[i].yearsOld > this.fishesArray[i].ageMax){
                this.fishesArray= this.fishesArray.splice(i,1);
            }
        }


    }
}

// Generate a new generation of fishes
/*function generateNewGeneration() { //TODO

    const couples = selection(fishesArray); // [  [fish1, fish2], ...]
    fishesArray = [];

    couples.forEach(couple => {
        let child1 = Fish.generateChild(fishesArray.length, couple[0], couple[1], fishesArray);
        fishesArray.push(child1);
    });

}*/