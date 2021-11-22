/**
 * EXPLANATION
 * All individuals will reproduce except one if uneven population
 * Each randomly chosen indivual will form a couple with the nearest fish with best fitness in a radius of r
 * 
 * RETURN
 * Function will return an array with the couples which are arrays of 2 Fish
 * 
 * PARAMETERS
 * fishes : array of Fish
 *
 * FISH STRUCTURE
 * Fish is a class with following attributes : id, x, y, z, fitness
 */

function selection(fishes) {

    const singles = fishes.slice(0);
    const couples = [];

    // As long as there is more than 1 fish, form couples
    while (singles.length > 1) {

        // Choose the parameters
        let r = 5; // initial radius of search for potential partner
        const ri = 2; // increase of search radius if no fish is found within radius

        // Chose a random individual among those singles 
        const firstIndex = getRandomInt(singles.length);
        const first = singles[firstIndex];
        // Remove him from the singles
        singles.splice(firstIndex, 1);

        // Identidy all fishes within a radius of r of that individual
        // If none, increase r by 2 until fishes are found or no longer anyone single

        let suitors;

        do {
            suitors = singles.filter(fish => getDistance(first.x, first.y, first.z, fish.x, fish.y, fish.z) <= r);
            r += ri; 
        }
        while (suitors.length === 0)

        // Order by distance
        suitors = orderByDistance(suitors, first);
        console.log(suitors);
        
        // Identidy the suitor with best fitness
        const fitnesses = suitors.map(suitor => suitor.fitness);
        const partnerIndex = getIndexOfBest(fitnesses);
        const partner = suitors[partnerIndex];
        // Remove him from the singles
        for (let i = 0; i < singles.length; i++) {
            if (singles[i].id === partner.id) {
                singles.splice(i, 1);
                break;
            }
        }

        // Add the newly formed couple to the list of happy couples
        couples.push([first, partner]);

    }

    return couples;
}

function orderByDistance(fishes, first) {
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
function getDistances(fishes, first) {
    let distances = [];
    fishes.forEach(fish => {
        let d = getDistance(first.x, first.y, first.z, fish.x, fish.y, fish.z);
        distances.push(d);
    });
    return distances;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function containsObject(obj, list) {
    list.some(elt => elt === obj);
}

function getDistance(x1, y1, z1, x2, y2, z2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
}

function getIndexOfBest(array) {
    if (array.length === 0) throw "Le tableau est vide."
    let bestId = 0;
    for (let i = 1; i < array.length; i++) {
        if (array[i] > array[bestId]) bestId = i;
    }
    return bestId;
}