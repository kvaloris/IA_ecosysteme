import * as THREE from './../node_modules/three/build/three.module.js';

export function displaySpecies() {
    console.log(FishShoal.getFishesBySpecies());

    const div = document.createElement('div');
    div.id = 'species-display';

    displayFishInSpeciesDisplay(FishShoal.fishesArray[0]);

    function displayFishInSpeciesDisplay(fish) {

        const canvas = document.createElement('canvas');
        canvas.classList.add('fish-display');
        div.appendChild(canvas);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera( 75, 1, 0.1, 100 );

        const renderer = new THREE.WebGLRenderer({ canvas });
        renderer.setSize( 200, 200 );
        document.body.appendChild( renderer.domElement );

        displayFish(fish);

        renderer.render( scene, camera );
    }
}
