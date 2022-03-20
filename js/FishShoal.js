import { Fish } from "./Fish";
import { Ground } from "./Ground";
import { createClones} from "../main";

    let nbFishInit;
    let mutChance= 0.1;

    function init(number) {
        console.log('fishhsoal init');
        for(let i=0; i< number; i++){
            const fish = Fish.fishRandom(i, fishesArray);
            fishesArray.push(fish);
        }
        nbFishInit =number;
    }

    function getNbFishToString(){
        var text="Number of fish in the band: " + fishesArray.length+ "</br>";
        // Calculation of the number of fish per color, mean ageMax and mean size
        var nbColor= [0];
        var meanAgeMax=0;
        var meanSize=0;
        var scoreLife=0;
        fishesArray.forEach(fish => {
            while ((nbColor.length-1) < fish.color){
                nbColor.push(0);
            }
            nbColor[fish.color]++;
            meanAgeMax+=fish.ageMax;
            meanSize+=fish.size;
            scoreLife+=fish.getScoreLife();
        });

        meanSize= meanSize/fishesArray.length;
        text+= "Average life expectancy: "+meanAgeMax+"</br>"
        meanAgeMax= meanAgeMax/fishesArray.length;
        text+= "Average size: "+meanSize+"</br>"
        text+= "Average score Life: "+scoreLife/fishesArray.length+"</br>"

        for(var i=0; i< nbColor.length; i++){
            let color;
            if(i===0) color = "red";
            else if(i===1) color = "blue";
            else color = "yellow";
            text+= "Nb of "+color+" fish: "+ nbColor[i]+"</br>";
        }

        return text;
    }

    function update(c_ag, c_s, c_al, fishesGroup) {
        updatePosition(c_ag, c_s,c_al,fishesGroup);
        if(eatingPeriod === "ending") {

            nextYear(fishesGroup);
            eatingPeriod = "no";

            const btnNextYear = document.querySelector("#next-year-btn");
            btnNextYear.classList.remove('btn-disabled');
            const fishingConsoleBtn = document.querySelector('#fishing-console-btn');
            fishingConsoleBtn.classList.remove('btn-disabled');

            console.log("EATING PERIOD ENDS");
        }
    }

    // Update the positions of the fishes and rotate them correctly
    function updatePosition(c_ag, c_s,c_al,fishesGroup){

        // Fishes either move aimlessly or move to eat according to if it's eating period or not

        if(eatingPeriod === "no") {
            fishesArray.forEach(fish => {
                fish.move(fishesArray, c_ag, c_s, c_al);
                fish.update();
            })
        }

        else if(eatingPeriod === "ongoing") {
            let endEatingPeriod = true;
            const hungry_fishes = fishesArray.filter(fish => fish.hunger);
            const unhungry_fishes = fishesArray.filter(fish => !fish.hunger);

            fishesArray.forEach(fish => {
                const endEating = fish.moveToEat();
                if(fish.hunger) fish.separate(hungry_fishes, c_s);
                else fish.move(unhungry_fishes, c_ag, c_s, c_al);
                fish.update();

                if(!endEating) endEatingPeriod = false;
            })
            if(endEatingPeriod) {
                eatingPeriod = "ending";
            };
        }

        // fishesArray.forEach(fish => fish.update())k

        for (let i = 0; i < fishesGroup.children.length; i++) {
            if(fishesGroup.children.length !== fishesArray.length) {
                console.log("Group and Array have different lengths");
            }
            let x = fishesArray[i].x;
            let y = fishesArray[i].y;
            let z = fishesArray[i].z;
            let id_3dobject = fishesArray[i].id_3dobject;
            let model = fishesGroup.getObjectById( id_3dobject );
            if(!model) {
                console.log("Undefined model");
            }
            model.position.x = x;
            model.position.y = y;
            model.position.z = z;

            let dir = fishesArray[i].velocity;
            dir = addV3(dir, {x: x, y: y, z: z});
            model.lookAt(dir.x, dir.y, dir.z);
            model.rotateY(Math.PI / 2);
        }
    }

    function nextYear(fishesGroup){
        var i=0;
        // Fishes grow one year older and dies from aging or hunger
        while (i < fishesArray.length) {
            console.log("test nextyear");
            fishesArray[i].yearsOld ++;
            if (fishesArray[i].yearsOld > fishesArray[i].ageMax || fishesArray[i].hunger===true){
                if(fishesArray[i].hunger===true) console.log('fish of color ' + fishesArray[i].color + ' died from hunger');

                fishesGroup.remove(fishesGroup.getObjectById(fishesArray[i].id_3dobject));
                fishesArray.splice(i,1);

            }else{
                i++;
            }
        }
        // New fishes are born
        fishesArray = generateNewGeneration(fishesArray, nbFishInit, mutChance, fishesGroup);
        // They are hungry
        fishesArray.forEach(fish => {
            fish.hunger= true;
        });

        Ground.nextYear();

    }

    function setMutChance(newFloat){
        mutChance=newFloat;
        // console.log("set mut "+ mutChance);
    }

    function getFishesBySpecies() {

        // Create an object with species names as keys and arrays as values
        const species = new Object();
        SPECIES.forEach(specie => {
            species[specie] = [];
        });

        // Fill species arrays with corresponding fishes
        fishesArray.forEach(fish => {
            let specie = fish.specie;
            species[specie].push(fish);
        })

        return species;
    }

    function removeFish(i){

        fishesArray.splice(i,1);
        fishesGroup.remove(fishesGroup.getObjectById(fishesArray[i].id_3dobject));

    }

export { nbFishInit, mutChance, init, getNbFishToString, update, updatePosition, nextYear, setMutChance, getFishesBySpecies, removeFish }

// Generate a new generation of fishes
function generateNewGeneration(fishesTab, nbFInit, mutChance, fishesGroup) {

    if(fishesTab.length < 2) return fishesTab;

    const couples = selection(fishesTab); // [  [fish1, fish2], ...]

    couples.forEach(couple => {
        if(Math.random() < getChanceReproduction(fishesTab,nbFInit)){
            let child1 = Fish.generateChild(fishesTab.length, couple[0], couple[1], fishesTab, mutChance);
            fishesTab.push(child1);
            createClones(fishesGroup, child1);

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