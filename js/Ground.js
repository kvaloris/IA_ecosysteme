import {displayFloor, displayFloorElmt } from "/main.js";

// Class defining the possible elements
class Element{
    e_type;
    e_size;
    e_id_3d_object;
    e_deltaX;
    e_deltaY;

    constructor(type=0,x=0,y=0){
       this.e_type=type;
       this.e_size= getRandomInt(CONST_sizeElement_MAX , CONST_sizeElement_MIN);
       this.e_deltaX=x;
       this.e_deltaY=y; 
    }
}

export class Ground{
    static groundArray=[];
    static ruleMatrix= [];
    static nbCoralsPerLine;
    static sizeGround;

    static init(sizeGround,nbCoralsPerLine , ruleMatrixSize){
        this.sizeGround=sizeGround;
        this.nbCoralsPerLine=nbCoralsPerLine;
        this.ruleMatrix= generateRuleMatrix(ruleMatrixSize); 
        this.groundArray= getNewTabWFC (this.nbCoralsPerLine, this.ruleMatrix); 

        // Ramdomize more the position of the corals
        for (let i = 0; i < this.groundArray.length; i++) { 
            for (let j = 0; j < this.groundArray.length; j++) {
                if(this.groundArray[i][j].e_type!=0){
                    this.groundArray[i][j].e_deltaX=getXYDelta(this.sizeGround,this.nbCoralsPerLine);
                    this.groundArray[i][j].e_deltaY=getXYDelta(this.sizeGround,this.nbCoralsPerLine);
                }
            }
        }
    }

    static toString(){
        return 'Sol: \n'+ this.groundArray.toString() +
            '\n matrice de règle \n'+this.ruleMatrix.toString();
    }

    static getGroundArray(){
        var tabTmp = this.groundArray;
        return tabTmp;
    }

    static nextYear(){
        for (let i = 0; i < this.groundArray.length; i++) {
            for (let j = 0; j < this.groundArray.length; j++) {
                if(this.groundArray[i][j].e_type==0){
                    // Remove items that no longer exist
                    displayFloorElmt.remove(displayFloorElmt.getObjectById(this.groundArray[i][j].e_id_3d_object));
                    // Generate a new element in the empty location 
                    this.groundArray[i][j] = new Element( getSolutionWithNeibourgh(this.ruleMatrix,this.groundArray, i, j),getXYDelta(this.sizeGround,this.nbCoralsPerLine),getXYDelta(this.sizeGround,this.nbCoralsPerLine));
                    displayFloor(i,j);
                }
            }
        }
    }

    // Remove eaten coral
    static eatCoral(i,j){
        this.groundArray[i][j].e_type=0;
        displayFloorElmt.remove(displayFloorElmt.getObjectById(this.groundArray[i][j].e_id_3d_object));
    }

    // Find the coordinates of a type 
    static findCoordinatesType(type){
        let tabCoordinatesCorals = new Array();
        for (let i = 0; i < this.groundArray.length; i++) {
            for (let j = 0; j < this.groundArray.length; j++) {
                if(this.groundArray[i][j].e_type==type){
                    tabCoordinatesCorals.push( {i: i, j: j, x: this.getCoralX(i, j), z: this.getCoralY(i, j)});
                }            
            }
        }
        if (tabCoordinatesCorals.length == 0){
            return false;
        }
        return tabCoordinatesCorals [getRandomInt(tabCoordinatesCorals.length-1) ];
    }

    static coralExists(i,j){
        if(this.groundArray[i][j].e_type!=0){
            return true;
        }
        return false;
    }

    static getCoralX(i,j){
        this.groundArray;
        return i *(this.sizeGround/this.nbCoralsPerLine) -((this.sizeGround)/2)+(this.sizeGround/this.nbCoralsPerLine)/2
                +this.getGroundArray()[i][j].e_deltaX;
    }

    static getCoralY(i,j){
        return j* (this.sizeGround/this.nbCoralsPerLine)-((this.sizeGround)/2)+(this.sizeGround/this.nbCoralsPerLine)/2
                +this.getGroundArray()[i][j].e_deltaY;
    }

    static getTypeElement(i,j){
        return this.groundArray[i][j].e_type;
    }

    static getSizeElement(i,j){
        return this.groundArray[i][j].e_size;
    }
    
    static setGround3DId(i,j, id){
        this.groundArray[i][j].e_id_3d_object = id;
    }

    static getSizeElement(i, j){
        return this.groundArray[i][j].e_size;
    }
}

function generateRuleMatrix(ruleMatrixSize){
    var newMatRule;
    switch (ruleMatrixSize) {
        case 0:
            console.error("ruleMatrixSize ==0")
            break;
        case 1:
            console.error("ruleMatrixSize ==1")
            break;
        case 2:
            newMatRule= MATRIX_RULE_2;
            break;
        case 3:
            newMatRule= MATRIX_RULE_3;
            break;
        case 4:
            newMatRule= MATRIX_RULE_4;
            break;
        case 5:
            newMatRule= MATRIX_RULE_5;
            break;
        default:
            console.error("ruleMatrixSize > 5 or undefined");
            break;
    }
    return newMatRule;
}

/* Returns a 2D array of elements
*   I,J array size
*   ruleMatrix
* The elements' type will be between 0 and ruleMatrix.lenght-1
*/
function getNewTabWFC (sizeTabElement, ruleMatrix){
    // Array of type elements = 0
    var newTab= makeIntMatrix (sizeTabElement,sizeTabElement , new Element());
    // Generate with WFC (several times to increase the number of corals)
    newTab = applyWFCtoArray( ruleMatrix, newTab);
    newTab = applyWFCtoArray( ruleMatrix, newTab);
    return applyWFCtoArray( ruleMatrix, newTab);
}

// Apply the WFC to each array element
function applyWFCtoArray(ruleMatrix, tab){
    for (let i = 0; i < tab.length; i++) {
        for (let j = 0; j < tab.length; j++) {
            tab[i][j] = new Element( getSolutionWithNeibourgh(ruleMatrix,tab, i, j),0,0) ;
        }
    }
    return tab;
}

/*
*  1|0|2
*  0|X|1
*  2|0|2 
*
* Returns the value of X given its neighbors
*/
function getSolutionWithNeibourgh(ruleMatrix,tab, x, y){
    var tabOfType= getTypeOfNeibourgh(tab, ruleMatrix.length, x, y);

    return getSolutionWhitTabState(ruleMatrix,tabOfType);
}

// Counts the number of elements of each type 
function getTypeOfNeibourgh(tab,nbType, x, y){
    var tabOfType = new Array(nbType) // number of elements of same type
    tabOfType.fill(0);
    let minI = Math.max(0, x-1);
    let maxI = Math.min(tab.length , x+2); // because loop < maxI
    let minJ = Math.max(0, y-1);
    let maxJ = Math.min(tab.length , y+2);

    for (let i = minI; i < maxI; i++) {
        for (let j = minJ; j < maxJ; j++) {
            if (! (i==x && j==y)){ // mustn't be itself
                tabOfType[tab[i][j].e_type]+=1;
            }
        }
    }
    return tabOfType;
}

/* From an array of the number of each type of elements
* Returns the choice of the middle element
*/
function getSolutionWhitTabState (ruleMatrix, tabTypeElement){
    var chanceForElement = new Array(ruleMatrix.length); // for each element its chance to set the current square
    chanceForElement.fill(0);
    for (let element = 0; element < ruleMatrix.length; element++) {
        for (let index = 0; index < chanceForElement.length; index++) {
            chanceForElement[index]+= tabTypeElement[element]*ruleMatrix[element][index]; // add the percentages together
        }
    };

    var total = chanceForElement.reduce((a, b)=> a + b); 
    var chanceForElementMap= chanceForElement;
    for (let i = 0; i < chanceForElementMap.length-1; i++) {
        chanceForElementMap[i+1]=chanceForElementMap[i]+chanceForElementMap[i+1];
    }

    // Map element: 0 a total ->  0 a 1
    chanceForElementMap = chanceForElementMap.map(x => x /total);

    var valAleat = rand();
    var indice=0;
    while(chanceForElementMap.length > indice && chanceForElementMap[indice]<valAleat){
        indice++;
    }
    return indice;
}


function getXYDelta(sizeGround,nbCoralsPerLine){
    var maxDelta= (sizeGround/nbCoralsPerLine)/4;
    return getRandomFloat(-maxDelta,maxDelta) ;
}
/*--------------------------------------------------------------------*/
/*--------------------        CONSTANTS          --------------------*/
/*--------------------------------------------------------------------*/
const CONST_sizeElement_MIN= 300;
const CONST_sizeElement_MAX= 800;

const MATRIX_RULE_2 = 
    [//  0   1 
        [55,45], //0
        [45,55] //1
    ];

const MATRIX_RULE_3 = 
    [//  0   1  2
        [55,25,25], //0
        [15,70,15], //1
        [15,15,70], //2
    ];
const MATRIX_RULE_4 = 
    [//  0   1  2  3   // 3 color + neutral
        [94,2,2,2], //0
        [30,70,0,0], //1
        [30,0,70,0], //2
        [30,0,0,70]  //3
    ];

const MATRIX_RULE_5 = 
    [//  0   1  2  3  4  // 3 color + neutral
        [40,15,15,15,15], //0
        [10,60,10,10,10], //1
        [10,10,60,10,10], //2
        [10,10,10,60,10], //3
        [10,10,10,10,60]  //4
    ];
