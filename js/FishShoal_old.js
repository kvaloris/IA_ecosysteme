import { deleteGroup, displayFishes } from "/main.js";
import { Fish } from "./Fish";

export class FishShoal{

    static fishesArray = [];
    static nbFishInit;
    static mutChance= 0.1;
    static eatingPeriod = "no";

    static init(number) {
        console.log('fishhsoal init');
        for(let i=0; i< number; i++){
            const fish = Fish.fishRandom(i, this.fishesArray);
            this.fishesArray.push(fish);
        }
        this.nbFishInit =number;
    }

    static getNbFishToString(){
        var text="Number of fish in the band: " + this.fishesArray.length+ "</br>";
        // Calculation of the number of fish per color, mean ageMax and mean size
        var nbColor= [0];
        var meanAgeMax=0;
        var meanSize=0;
        var scoreLife=0;
        this.fishesArray.forEach(fish => {
            while ((nbColor.length-1) < fish.color){
                nbColor.push(0);
            }
            nbColor[fish.color]++;
            meanAgeMax+=fish.ageMax;
            meanSize+=fish.size;
            scoreLife+=fish.getScoreLife();
        });

        meanSize= meanSize/this.fishesArray.length;
        text+= "Average life expectancy: "+meanAgeMax+"</br>"
        meanAgeMax= meanAgeMax/this.fishesArray.length;
        text+= "Average size: "+meanSize+"</br>"
        text+= "Average score Life: "+scoreLife/this.fishesArray.length+"</br>"

        for(var i=0; i< nbColor.length; i++){
            let color;
            if(i===0) color = "red";
            else if(i===1) color = "blue";
            else color = "yellow";
            text+= "Nb of "+color+" fish: "+ nbColor[i]+"</br>";
        }

        return text;
    }

    static update(c_ag, c_s, c_al, fishesGroup) {
        this.updatePosition(c_ag, c_s,c_al,fishesGroup);
        if(this.eatingPeriod === "ending") {
            this.nextYear(fishesGroup);
            this.eatingPeriod = "no";
            const btnNextYear = document.querySelector("#next-year-btn");
            btnNextYear.classList.remove('btn-disabled');
            const fishingConsoleBtn = document.querySelector('#fishing-console-btn');
            fishingConsoleBtn.classList.remove('btn-disabled');
            console.log("eatingPeriod finished");
        }
    }


    // Update the positions of the fishes and rotate them correctly
    static updatePosition(c_ag, c_s,c_al,fishesGroup){

        // Fishes either move aimlessly or move to eat according to if it's eating period or not

        if(this.eatingPeriod === "no") {
            this.fishesArray.forEach(fish => fish.move(this.fishesArray, c_ag, c_s, c_al));
        }

        if(this.eatingPeriod === "ongoing") {
            let endEatingPeriod = true;
            const hungry_fishes = this.fishesArray.filter(fish => fish.hunger);
            const unhungry_fishes = this.fishesArray.filter(fish => !fish.hunger);

            this.fishesArray.forEach(fish => {
                const endEating = fish.moveToEat();
                if(fish.hunger) fish.separate(hungry_fishes, c_s);
                else fish.move(unhungry_fishes, c_ag, c_s, c_al);

                if(!endEating) endEatingPeriod = false;
            })
            if(endEatingPeriod) {
                this.eatingPeriod = "ending";
            };
        }

        this.fishesArray.forEach(fish => fish.update());

        for (let i = 0; i < fishesGroup.children.length; i++) {
            let x = this.fishesArray[i].x;
            let y = this.fishesArray[i].y;
            let z = this.fishesArray[i].z;
            fishesGroup.children[i].position.x = x;
            fishesGroup.children[i].position.y = y;
            fishesGroup.children[i].position.z = z;

            let dir = this.fishesArray[i].velocity;
            dir = addV3(dir, {x: x, y: y, z: z});
            fishesGroup.children[i].lookAt(dir.x, dir.y, dir.z);
            fishesGroup.children[i].rotateY(Math.PI / 2);
        }
    }


    static nextYear(fishesGroup){
        var i=0;
        // Fishes grow one year older and dies from aging or hunger
        while (i < this.fishesArray.length) {
            this.fishesArray[i].yearsOld ++;
            if (this.fishesArray[i].yearsOld > this.fishesArray[i].ageMax || this.fishesArray[i].hunger==true){
                if(this.fishesArray[i].hunger==true) console.log('fish of color ' + this.fishesArray[i].color + ' died from hunger');
                this.fishesArray.splice(i,1);
            }else{
                i++;
            }
        }
        // New fishes are born
        this.fishesArray = generateNewGeneration(this.fishesArray, this.nbFishInit, this.mutChance);
        // They are hungry
        this.fishesArray.forEach(fish => {
            fish.hunger= true;
        });
        deleteGroup(fishesGroup);
        displayFishes(fishesGroup);
    }

    static setMutChance(newFloat){
        this.mutChance=newFloat;
        // console.log("set mut "+ this.mutChance);
    }

    static getFishesBySpecies() {

        // Create an object with species names as keys and arrays as values
        const species = new Object();
        SPECIES.forEach(specie => {
            species[specie] = [];
        });

        // Fill species arrays with corresponding fishes
        this.fishesArray.forEach(fish => {
            let specie = fish.specie;
            species[specie].push(fish);
        })

        return species;
    }

    static removeFish(i){
        this.fishesArray.splice(i,1);
    }
}

// Generate a new generation of fishes
function generateNewGeneration(fishesTab, nbFInit, mutChance) {

    if(fishesTab.length < 2) return fishesTab;

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
    if(fishesTab.length>nbFInit){
        return CHANCEreproductionInitial/GROWpopulation;
    }
    return CHANCEreproductionInitial;
}

/*--------------------------------------------------------------------*/
/*--------------------        CONSTANTES          --------------------*/
/*--------------------------------------------------------------------*/

const CHANCEreproductionInitial= 0.2;
const GROWpopulation=2; //tolérence du nombre de membre (multiplicateur)