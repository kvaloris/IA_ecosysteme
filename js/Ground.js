/* Pour l'utiliser:
*  pour créer un sol
*  Ground.init(5,5, nombreDeType); avec la taille que tu veux
*
*  pour l'utiliser
*  Ground.getGroundArray());
*
*  pour passer un année:
*  Ground.nextYear()
*/



class Ground{
    static groundArray=[];
    static ruleMatrix= [];
    static nbCoralsPerLine;
    static sizeGround;

    static init(sizeGround,nbCoralsPerLine , ruleMatrixSize){
        this.sizeGround=sizeGround;
        this.nbCoralsPerLine=nbCoralsPerLine;
        this.ruleMatrix= generateRuleMatrix(ruleMatrixSize); 
        this.groundArray= getNewTabWFC (this.nbCoralsPerLine, this.ruleMatrix); 
    }

    static toString(){
        return 'Sole: \n'+ this.groundArray.toString() +
            '\n matrice de règle \n'+this.ruleMatrix.toString();
    }

    static getGroundArray(){
        var tabTmp = this.groundArray;
        return tabTmp;
    }

    static nextYear(){
        this.groundArray= getTabWithWFC(this.groundArray.length, this.groundArray[0].length, ruleMatrix, this.groundArray)
    }

    static eatCoral(i,j){
        this.groundArray[i][j]=0;
    }

    //TODO trouver les coordonee d'un type
    static findCoordinatesType(type){
        var j;
        for (let i = 0; i < this.groundArray.length; i++) {
            j= this.groundArray[i].indexOf(type);
            if( j!=-1){
                return [this.getCoralX(i),this.getCoralY(j)];
            }
        }
        return false;
    }

    static getCoralX(i){
        return i *(this.sizeGround/this.nbCoralsPerLine) -((this.sizeGround)/2)+(this.sizeGround/this.nbCoralsPerLine)/2;
    }

    static getCoralY(j){
        return j* (this.sizeGround/this.nbCoralsPerLine)-((this.sizeGround)/2)+(this.sizeGround/this.nbCoralsPerLine)/2;
    }

    static getTypeElement(i,j){
        return this.groundArray[i][j];
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
            console.error("ruleMatrixSize >5 ou non defini")
            break;
    }
    return newMatRule;
}

/*renvoi un tableau d'entier en fonction des paramètres
*   I,J taille du tableau
*   ruleMatrix matrice des règles
*
*    les entiers seront compris entre 0 et ruleMatrix.lenght-1
*/
function getNewTabWFC (sizeTabElement, ruleMatrix){
    //assert sizeTabElement  != 0
    var newTab= makeIntMatrix (sizeTabElement,sizeTabElement , 0);
    return getTabWithWFC( ruleMatrix, newTab);
}

function getTabWithWFC(ruleMatrix, tab){
    for (let i = 0; i < tab.length; i++) {
        for (let j = 0; j < tab.length; j++) {
            tab[i][j] = getSolutionWithNeibourgh(ruleMatrix,tab, i, j);
        }
    }
    return tab;

}

/*
*  1|0|2
*  0|X|1
*  2|0|2 
*
* retourne la valeur de X en fonction de ses voisins existant
*
*/
function getSolutionWithNeibourgh(ruleMatrix,tab, x, y){
    var tabOfType= getTypeOfNeibourgh(tab, ruleMatrix.length, x, y);

    return getSolutionWhitTabState(ruleMatrix,tabOfType);
}

function getTypeOfNeibourgh(tab,nbType, x, y){
    var tabOfType = new Array(nbType) // nombre d'éléments du même type 
    tabOfType.fill(0);
    let minI = Math.max(0, x-1);
    let maxI = Math.min(tab.length , x+2); //car boucle <maxI
    let minJ = Math.max(0, y-1);
    let maxJ = Math.min(tab.length , y+2);

    for (let i = minI; i < maxI; i++) {
        for (let j = minJ; j < maxJ; j++) {
            if (! (i==x && j==y)){ //ne doit pas etre lui meme
                tabOfType[tab[i][j]]+=1;
            }
        }
    }
    return tabOfType;
}

/* à partir d'un tableau du nombre de chaque type d'éléments
*  retourne le choix de l'élément du milieu
*/
function getSolutionWhitTabState (ruleMatrix, tabStateElement){
    var chanceForElement = new Array(ruleMatrix.length); //pour chaque élément sa chance de définir la case actuel
    chanceForElement.fill(0);
    for (let element = 0; element < ruleMatrix.length; element++) {
        for (let index = 0; index < chanceForElement.length; index++) {
            chanceForElement[index]+= tabStateElement[element]*ruleMatrix[element][index]; //on ajoute les poucentages
        }
    };

    var total = chanceForElement.reduce((a, b)=> a + b); 
    var chanceForElementMap= chanceForElement;
    for (let i = 0; i < chanceForElementMap.length-1; i++) {
        chanceForElementMap[i+1]=chanceForElementMap[i]+chanceForElementMap[i+1];
    }

    //on map les élément: 0 a total ->  0 a 1
    chanceForElementMap = chanceForElementMap.map(x => x /total);

    var valAleat = rand();
    var indice=0;
    while(chanceForElementMap.length > indice && chanceForElementMap[indice]<valAleat){
        indice++;
    }
    return indice;
}

/*--------------------------------------------------------------------*/
/*--------------------        CONSTANTES          --------------------*/
/*--------------------------------------------------------------------*/


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
    [//  0   1  2  3   // 3 color + neutre
        [40,20,20,20], //0
        [10,70,10,10], //1
        [10,10,70,10], //2
        [10,10,10,70]  //3
    ];

const MATRIX_RULE_5 = 
    [//  0   1  2  3  4  // 3 color + neutre
        [40,15,15,15,15], //0
        [10,60,10,10,10], //1
        [10,10,60,10,10], //2
        [10,10,10,60,10], //3
        [10,10,10,10,60]  //4
    ];
