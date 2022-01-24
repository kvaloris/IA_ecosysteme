import * as THREE from 'three/build/three.module.js';
import { loadObject, animate, resizeRendererToDisplaySize } from './../main.js';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';

let idAnim2;


export function displaySpecies(idAnim) {
    cancelAnimationFrame(idAnim);

    const display = document.querySelector('#display-2');
    display.style.display = "inherit";

    createSpeciesTab();

    const firstSpecie = Object.keys(FishShoal.getFishesBySpecies())[0];
    const fishesOfFirstSpecie = FishShoal.getFishesBySpecies()[firstSpecie];

    displayFishesAsItems(fishesOfFirstSpecie);
}

function displayFishesAsItems(fishes) {

    let prevGridFish = document.querySelector('.grid-fishes');
    if (prevGridFish) prevGridFish.remove();

    const container = document.querySelector('#container-2');

    const grid = document.createElement('div');
    grid.classList.add('grid-fishes');
    container.appendChild(grid);

    const canvas = document.createElement('canvas');
    canvas.id = 'canvas-2';
    grid.appendChild(canvas);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });

    const sceneElements = [];
    function addScene(elem, fn) {
        sceneElements.push({ elem, fn });
    }

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

        const controlsFish = new TrackballControls(camera, elem);
        controlsFish.noZoom = true;
        controlsFish.noPan = true;

        {
            const color = 0xFFFFFF;
            const intensity = 1;
            const light = new THREE.DirectionalLight(color, intensity);
            light.position.set(-1, 2, 4);
            camera.add(light);
        }

        return { scene, camera, controlsFish };
    }

    for (let i = 0; i < fishes.length; i++) {
        let fish = fishes[i];

        const elem = document.createElement('span');
        elem.classList.add('diagram');
        elem.id = 'list-fish-' + i;
        grid.appendChild(elem);

        const { scene, camera, controlsFish } = makeScene(elem);
        displayFishAt(fish, scene, (fish.size - MINSIZE) / (MAXSIZE - MINSIZE) * (3 - 1) + 1, 0, 0, 0);

        addScene(elem, (time, rect) => {
            camera.aspect = rect.width / rect.height;
            camera.updateProjectionMatrix();
            controlsFish.handleResize();
            controlsFish.update();
            // mesh.rotation.y = time * .1;
            renderer.render(scene, camera);
        });
    }

    const clearColor = new THREE.Color('#000');
    function render(time) {
        time *= 0.001;

        resizeRendererToDisplaySize(renderer);

        renderer.setScissorTest(false);
        renderer.setClearColor(clearColor, 0);
        renderer.clear(true, true);
        renderer.setScissorTest(true);

        const transform = `translateY(${window.scrollY}px)`;
        renderer.domElement.style.transform = transform;

        for (const { elem, fn } of sceneElements) {
            // get the viewport relative position of this element
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

                fn(time, rect);
            }
        }

        idAnim2 = requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
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

function createSpeciesTab() {
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
            displayFishesAsItems(fishes);
        })
    })
}

export function closeSpeciesDisplay() {
    cancelAnimationFrame(idAnim2);
    const display = document.querySelector('#display-2');
    display.style.display = "none";
    animate();
}
