/* Pour l'utiliser:
*  pour créer un sol
*  Ground.init(5,5); avec la taille que tu veux
*
*  pour l'utiliser
*  Ground.getGroundArray());
*/



class Ground{
    static groundArray=[];
    static ruleMatrix= [];

    static init(I, J, ruleMatrix){
        this.ruleMatrix= generateRuleMatrix(); 
        this.groundArray= getNewTabWFC (I , J, this.ruleMatrix);
        
    }

    static toString(){
        return 'Sole: \n'+ this.groundArray.toString() +
            '\n matrice de règle \n'+this.ruleMatrix.toString();
    }

    static getGroundArray(){
        var tabTmp = this.groundArray;
        return tabTmp;
    }
}

function generateRuleMatrix(newMatrixPercent){
    let matrixPercentDefault = 
    [//  0   1  2  3   // 3 color + neutre
        [40,20,20,20], //0
        [10,70,10,10], //1
        [10,10,70,10], //2
        [10,10,10,70]  //3
    ];
    
    if(newMatrixPercent==null ){ // il n't a pas de matrice passer en parametre
        return matrixPercentDefault;
    }else if (!isCorrectRuleMatrice(newMatrixPercent)){ // la matrice n'est pas conforme
        return matrixPercentDefault;
    }
    return newMatrixPercent;
}

function isCorrectRuleMatrice(matToVerif){
    if(newMatrixPercent.length!= matrixPercentDefault.length){
        console.error("la matrice en % n'a pas la bonne taille");
        return false;
    }

    newMatrixPercent.forEach(element => {
        if(element[0]+element[1]+element[2]+element[3] != 100){
            let somme= element[0]+element[1]+element[2]+element[3];
            console.error("la somme des éléments de la matrice en % doit donner 100; ici "+ element[0]+"+"+element[0]+"+"+element[0]+"+"+element[3]+"="+ somme);
            return false;
        }
        if(element.length!= matrixPercentDefault[0].length){
            console.error("la matrice en % n'a pas la bonne taille");
            return false;
        }
    });
    return true;
}

/*renvoi un tableau d'entier en fonction des paramètres
*   I,J taille du tableau
*   ruleMatrix matrice des règles
*
*    les entiers seront compris entre 0 et ruleMatrix.lenght-1
*/
function getNewTabWFC (I, J, ruleMatrix){
    //assert I J != 0
    var newTab= makeIntMatrix (I , J, -1);
    for (let i = 0; i < newTab.length; i++) {
        for (let j = 0; j < newTab.length; j++) {
            newTab[i][j] = getSolutionWithNeibourgh(I, J, ruleMatrix,newTab, i, j);
        }
        
    }
    return newTab;
}


/*
*  1|0|2
*  0|X|1
*  2|0|2 
*
* retourne la valeur de X en fonction de ses voisins existant
*
*/
function getSolutionWithNeibourgh(I, J, ruleMatrix,tab, x, y){
    var tabOfType= getTypeOfNeibourgh(I, J,tab, x, y);

    return getSolutionWhitTabState(ruleMatrix,tabOfType);

    
}

function getTypeOfNeibourgh(I, J,tab, x, y){
    var tabOfType = new Array(NB_TYPE) // nombre d'éléments du même type 
    tabOfType.fill(0);
    let minI = Math.max(0, x-1);
    let maxI = Math.min(I, x+2); //car boucle <maxI
    let minJ = Math.max(0, y-1);
    let maxJ = Math.min(J, y+2);

    console.warn("Neibourg");
    var textTps  = x +',' + y+'   : ';
    var textAjout="garder: "
    for (let i = minI; i < maxI; i++) {
        for (let j = minJ; j < maxJ; j++) {
            var typeTps= tab[i][j];
            textTps+= tab[i][j] + ", "
            if (! (i==x && j==y)){ //ne doit pas etre lui meme
                if( tab[i][j]!=-1){
                    tabOfType[tab[i][j]]+=1
                    textAjout+= tab[i][j] + ", "
                }else{
                    textAjout+= " , "
                }
            }
        
        }
        
    }
    console.warn(textTps);
    console.warn(textAjout);
    console.warn(tabOfType);
    return tabOfType;
}

/* à partir d'un tableau du nombre de chaque type d'éléments
*  retourne le choix de l'élément du milieu
*/
function getSolutionWhitTabState (ruleMatrix, tabStateElement){
    var chanceForElement = new Array(ruleMatrix.length); //pour chaque élément sa chance de définir la case actuel
    chanceForElement.fill(0);
    for (let element = 0; element < tabStateElement.length; element++) {
        for (let index = 0; index < chanceForElement.length; index++) {
            chanceForElement[index]+= tabStateElement[element]*ruleMatrix[element][index];
        }
    };

    let maxTab = Math.max(...chanceForElement);
    var maxChanceIndice =[], i;
    for(i = 0; i < chanceForElement.length; i++){
        if (chanceForElement[i] === maxTab){
            maxChanceIndice.push(i);
        }
    }
    return maxChanceIndice[getRandomInt(maxChanceIndice.length-1)];
    

}

/*--------------------------------------------------------------------*/
/*--------------------        CONSTANTES          --------------------*/
/*--------------------------------------------------------------------*/

const NB_TYPE = 4; //0 1 2 3