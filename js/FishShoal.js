class FishShoal{

    static fishesArray = [];
    static nbFishInit;
    static mutChance= 0.1;

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

    static getNbFishToString(){
        var text="Number of fish in the band: " + this.fishesArray.length+ "</br>";

        //calculation of the number of fish per color, mean ageMax and mean size
        var nbColor= [0];
        var meanAgeMax=0;
        var meanSize=0;
        this.fishesArray.forEach(fish => {
            while ((nbColor.length-1) < fish.color){
                nbColor.push(0);
            }
            nbColor[fish.color]++;
            meanAgeMax+=fish.ageMax;
            meanSize+=fish.size;
        });

        meanAgeMax= meanAgeMax/this.fishesArray.length;
        meanSize= meanSize/this.fishesArray.length;
        text+= "Average life expectancy "+meanAgeMax+"</br>"
        text+= "Average size "+meanSize+"</br>"

        for(var i=0; i< nbColor.length; i++){
            text+= "nb fish "+ i+" color: "+ nbColor[i]+"</br>";
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
        this.fishesArray = generateNewGeneration(this.fishesArray, this.nbFishInit, this.mutChance);
    }

    static setMutChance(newFloat){
        this.mutChance=newFloat;
        console.log("set mut "+ this.mutChance);
    }
}

// Generate a new generation of fishes
function generateNewGeneration(fishesTab, nbFInit, mutChance) {

    const couples = selection(fishesTab); // [  [fish1, fish2], ...]

    couples.forEach(couple => {
        if(Math.random() < getChanceReproduction(fishesTab,nbFInit)){
            let child1 = Fish.generateChild(fishesTab.length, couple[0], couple[1], fishesTab, mutChance);
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