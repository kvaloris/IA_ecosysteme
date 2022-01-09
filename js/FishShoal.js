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

    // Update the positions of the fishes and rotate them correctly
    static updatePosition(c_ag, c_s,c_al,fishesGroup){
        this.fishesArray.forEach(fish => fish.move(this.fishesArray, c_ag, c_s, c_al));
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



/*--------------------------------------------------------------------*/
/*--------------------        CONSTANTES          --------------------*/
/*--------------------------------------------------------------------*/

const CHANCEreproduction= 0.1;