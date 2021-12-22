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


    static updatePosition(){
        for(var i=0; i< this.fishesArray.length; i++){
            //this.fishesArray[i].updatePosition;
            
            
        }
    }


    static nextYear(){
        for(var i=0; i< this.fishesArray.length; i++){
            this.fishesArray[i].yearsOld ++;
            if (this.fishesArray[i].yearsOld > this.fishesArray[i].ageMax){
                this.fishesArray.splice(i,1);
            }
        }
        this.fishesArray = generateNewGeneration(this.fishesArray);
    }
}

// Generate a new generation of fishes
function generateNewGeneration(fishesTab) {

    const couples = selection(fishesTab); // [  [fish1, fish2], ...]

    couples.forEach(couple => {
        if(Math.random() < CHANCEreproduction){
            let child1 = Fish.generateChild(fishesTab.length, couple[0], couple[1], fishesTab);
            fishesTab.push(child1);
        }
    });
    return fishesTab;
}

function shoalCenter(fishesTab){
    let center = { x: 0, y: 0, z: 0 };
    for(var i=0; i< fishesTab.length; i++){
        center.x += fishesTab[i].getPosition()[0];
        center.y += fishesTab[i].getPosition()[1];
        center.z += fishesTab[i].getPosition()[2];
    }
    center = divideV3(center, fishesTab.length);

    return center;
}

//Temporaire TODO
function divideV3(v, c) {
    return { x: v.x / c, y: v.y / c, z: v.z / c};
}



/*--------------------------------------------------------------------*/
/*--------------------        CONSTANTES          --------------------*/
/*--------------------------------------------------------------------*/

const CHANCEreproduction= 0.1;