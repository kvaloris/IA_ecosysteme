class FishShoal{

    static fishesArray = [];
    static nbFishInit;

    static init(number) {
        for(let i=0; i< number; i++){
            this.fishesArray.push(Fish.fishRandom(i, this.fishesArray));
        }
        this.nbFishInit =number;
    }

    
    static toString(){
        var text ="";
        for(var i=0; i< this.fishesArray.length; i++){
            text = text + this.fishesArray[i].toString()+ '</br>';
        }
        return text;
    }


    static updatePosition(c_ag, c_s,c_al,fishesGroup){
        //console.log("c_ag = ", c_ag, " / c_s = ", c_s, " / c_al = ", c_al);
        this.fishesArray.forEach(fish => fish.move(this.fishesArray, c_ag, c_s, c_al));
        for (let i = 0; i < fishesGroup.children.length; i++) {
            let x = this.fishesArray[i].x;
            let y = this.fishesArray[i].y;
            let z = this.fishesArray[i].z;
            fishesGroup.children[i].position.x = x;
            fishesGroup.children[i].position.y = y;
            fishesGroup.children[i].position.z = z;
        }
    }


    static nextYear(){
        for(var i=0; i< this.fishesArray.length; i++){
            this.fishesArray[i].yearsOld ++;
            if (this.fishesArray[i].yearsOld > this.fishesArray[i].ageMax){
                this.fishesArray.splice(i,1);
            }
        }
        this.fishesArray = generateNewGeneration(this.fishesArray, this.nbFishInit);
        console.log(this.fishesArray.length);
    }
}

// Generate a new generation of fishes
function generateNewGeneration(fishesTab, nbFInit) {

    const couples = selection(fishesTab); // [  [fish1, fish2], ...]

    couples.forEach(couple => {
        if(Math.random() < getChanceReproduction(fishesTab,nbFInit)){
            let child1 = Fish.generateChild(fishesTab.length, couple[0], couple[1], fishesTab);
            fishesTab.push(child1);
        }
    });
    return fishesTab;
}

function getChanceReproduction(fishesTab, nbFInit){
    if(fishesTab.length>nbFInit*2){
        return CHANCEreproductionInitial/GROWpopulation;
    }
    return CHANCEreproductionInitial;
}

/*--------------------------------------------------------------------*/
/*--------------------        CONSTANTES          --------------------*/
/*--------------------------------------------------------------------*/

const CHANCEreproductionInitial= 0.2;
const GROWpopulation=2; //tolérence du nombre de membre (multiplicateur)