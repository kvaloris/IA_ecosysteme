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