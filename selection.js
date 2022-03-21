/**
 * RETURN
 * Function will return an array with the couples which are arrays of 2 Fish
 * 
 * PARAMETERS
 * fishes : array of Fish
 */

function selection(fishes) {

    const couples = [];

    for(let i=0; i<fishes.length; i++) {

        // Choose the parameters
        let n = 5; // Number max of suitors for a fish

        const first = fishes[i];

        // A fish can't be coupled with itself
        let others = fishes.slice(0);
        others.splice(i, 1);

        // Get the n nearest single fishes
        let suitors = orderFishesByDistanceFromChosenFish(others, first).slice(0, n);
        
        // Identidy the suitor with best fitness
        // If same, choose the first found who is also the nearest since array ordered by distances
        const fitnesses = suitors.map(suitor => suitor.getScoreLife());
        const partnerIndex = getIndexOfBestScore(fitnesses);
        const partner = suitors[partnerIndex];

        // Add the newly formed couple to the list of happy couples
        couples.push([first, partner]);
        
    }
    
    return couples;
}

function orderFishesByDistanceFromChosenFish(fishes, first) {
    let ordered = [];
    ordered.push(fishes[0]);
    for(let i=1; i<fishes.length; i++) {
        let j = 0;
        let d1 = getDistance(first.x, first.y, first.z, fishes[i].x, fishes[i].y, fishes[i].z);
        while(j < ordered.length && d1 > getDistance(first.x, first.y, first.z, ordered[j].x, ordered[j].y, ordered[j].z)) {
            j++;
        }
        ordered.splice(j, 0, fishes[i]);
    }
    return ordered;
}

// Only for verification, else useless
function getDistancesAndScores(fishes, first) {
    let distances = [];
    fishes.forEach(fish => {
        let d = getDistance(first.x, first.y, first.z, fish.x, fish.y, fish.z);
        distances.push([fish.id, d, fish.getScoreLife()]);
    });
    return distances;
}

function getIndexOfBestScore(scores) {
    if (scores.length === 0) throw "Le tableau est vide."
    let bestId = 0;
    for (let i = 1; i < scores.length; i++) {
        // Best score is the lowest
        if (scores[i] < scores[bestId]) bestId = i;
    }
    return bestId;
}