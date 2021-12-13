function generateCorrectPosition(z, fishes) {

    // Generate random coordinates
    let x = getRandomFloat(XMIN, XMAX);
    let y = getRandomFloat(YMIN, YMAX);

    fishes.forEach(fish => {
        while(getDistance(x, y, z, fish.x, fish.y, fish.z) <= 2*Fish.MAXSIZE) {
            x = getRandomFloat(XMIN, XMAX);
            y = getRandomFloat(YMIN, YMAX);
        }
    });

    return [x, y, z];
}

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function getDistance(x1, y1, z1, x2, y2, z2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
}