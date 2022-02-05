import * as THREE from 'three/build/three.module.js';
import { loadObject, animate, resizeRendererToDisplaySize } from './../main.js';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';

let idAnim2;

// Open a display where fishes are grouped by their species

export function displaySpecies(idAnim, renderer) {

    // Pause the animation in the first canvas
    cancelAnimationFrame(idAnim);

    // Make the display visible
    const display = document.querySelector('#display-2');
    display.style.display = "inherit";

    // Create tabs for the different species
    createSpeciesTab(renderer);

    // When the display is opened, fishes of the first specie are displayed
    const firstSpecie = Object.keys(FishShoal.getFishesBySpecies())[0];
    const fishesOfFirstSpecie = FishShoal.getFishesBySpecies()[firstSpecie];
    displayFishesAsItems(fishesOfFirstSpecie, renderer);
}

// Display fishes passed in paramaters as items

function displayFishesAsItems(fishes, renderer) {

    // Empty the grid in case other fishes were displayed previously
    const grid = document.querySelector('.grid-fishes');
    grid.innerHTML = "";

    // For each fish, the render function and element will be added to an array sceneElements
    const sceneElements = [];
    function addScene(elem, fn) {
        sceneElements.push({ elem, fn });
    }

    // For each fish, will be created a scene, camera and controls
    function makeScene(elem) {
        const scene = new THREE.Scene();

        const fov = 45;
        const aspect = 2;  // the canvas default
        const near = 0.1;
        const far = 5;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(0, 1, 2);
        camera.lookAt(0, 0, 0);
        scene.add(camera);

        const controls = new TrackballControls(camera, elem);
        controls.noZoom = true;
        controls.noPan = true;

        {
            const color = 0xFFFFFF;
            const intensity = 1;
            const light = new THREE.DirectionalLight(color, intensity);
            light.position.set(-1, 2, 4);
            camera.add(light);
        }

        return { scene, camera, controls };
    }

    // For each fish
    for (let i = 0; i < fishes.length; i++) {
        let fish = fishes[i];

        // Create an html element
        const elem = document.createElement('span');
        elem.classList.add('diagram');
        elem.id = 'list-fish-' + i;
        grid.appendChild(elem);

        // Create scene, camera and controls
        const { scene, camera, controls } = makeScene(elem);
        // Add the fish to the scene
        // map is a function in "utils.js" that map values from interval1 [A, B] to interval2 [a, b]
        displayFishAt(fish, scene, map(fish.size, [MINSIZE, MAXSIZE], [1, 3]), 0, 0, 0);

        // Add the html element and a render function to array sceneElement
        addScene(elem, (renderer, rect) => {
            camera.aspect = rect.width / rect.height;
            camera.updateProjectionMatrix();
            controls.handleResize();
            controls.update();
            renderer.render(scene, camera);
        });
    }

    const clearColor = new THREE.Color('#000');
    function render(renderer) {

        resizeRendererToDisplaySize(renderer);

        renderer.setScissorTest(false);
        renderer.setClearColor(clearColor, 0);
        renderer.clear(true, true);
        renderer.setScissorTest(true);

        // The canvas's transform is set to move it so the top of the canvas is at the top of whatever part the page is currently scrolled to.
        const transform = `translateY(${window.scrollY}px)`;
        renderer.domElement.style.transform = transform;
        
        // Render only the fishes that are on screen
        for (const { elem, fn } of sceneElements) {

            // Get the viewport relative position of this element
            const rect = elem.getBoundingClientRect();
            const { left, right, top, bottom, width, height } = rect;

            const isOffscreen =
                bottom < 0 ||
                top > renderer.domElement.clientHeight ||
                right < 0 ||
                left > renderer.domElement.clientWidth;

            if (!isOffscreen) {
                const positiveYUpBottom = renderer.domElement.clientHeight - bottom;
                renderer.setScissor(left, positiveYUpBottom, width, height);
                renderer.setViewport(left, positiveYUpBottom, width, height);

                fn(renderer, rect);
            }
        }

        idAnim2 = requestAnimationFrame(() => render(renderer));
    }
    requestAnimationFrame(() => render(renderer));
}

// Display the fish passed in parameter 

function displayFishAt(fish, group, size, x, y, z) {
    var fichierName;

    switch (fish.color) {
        case 0:
            fichierName = "poisson2.glb"; // red
            break;
        case 1:
            fichierName = "poisson.glb"; // blue
            break;
        default:
            fichierName = "poisson3.glb"; // yellow
            break;
    }

    loadObject(size, fichierName, x, y, z, group);
}

function createSpeciesTab(renderer) {
    const div = document.querySelector('.species-tabs');
    div.innerHTML = "";
    const species = Object.keys(FishShoal.getFishesBySpecies());
    species.forEach((specie, i) => {
        let span = document.createElement('span');
        if(i===0) span.classList.add("selected");
        span.innerText = specie;
        div.appendChild(span);
        let fishes = FishShoal.getFishesBySpecies()[specie];
        span.addEventListener('click', () => {
            const tabs = div.childNodes;
            tabs.forEach(tab => tab.classList.remove("selected"));
            span.classList.add("selected");
            displayFishesAsItems(fishes, renderer);
        })
    })
}

// Close the display
export function closeSpeciesDisplay() {
    cancelAnimationFrame(idAnim2);
    const display = document.querySelector('#display-2');
    display.style.display = "none";
    animate();
}
