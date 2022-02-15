import * as THREE from 'three/build/three.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { displaySpecies, closeSpeciesDisplay } from './js/displaySpecies.js';
import { GUI } from 'dat.gui';

const scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
      /*fov*/ 55,
      /*aspect ratio*/ window.innerWidth / window.innerHeight,
      /*near*/ 45,
      /*far*/ 30000
);
camera.position.x = -100;
camera.position.y = -200;
camera.position.z = -300;

const canvas = document.querySelector('#canvas-1');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector("#display-1").appendChild(renderer.domElement);

let materialArray = [];
    let texture_ft = new THREE.TextureLoader().load( 'images/uw_ft.jpg');
    let texture_bk = new THREE.TextureLoader().load( 'images/uw_bk.jpg');
    let texture_up = new THREE.TextureLoader().load( 'images/uw_up.jpg');
    let texture_dn = new THREE.TextureLoader().load( 'images/uw_dn.jpg');
    let texture_rt = new THREE.TextureLoader().load( 'images/uw_rt.jpg');
    let texture_lf = new THREE.TextureLoader().load( 'images/uw_lf.jpg');
      
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));
   
    for (let i = 0; i < 6; i++)
      materialArray[i].side = THREE.BackSide;
    
    let boxSize = 600;
    let skyboxGeo = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
    let skybox = new THREE.Mesh( skyboxGeo, materialArray );
    skybox.position.x = -60;
    skybox.position.y = 0;
    skybox.position.z = 0;
    scene.add( skybox );

const fishesGroup = new THREE.Group();
let floorElements = new THREE.Group();
let displayFloorElmt = new THREE.Group();


const loader = new THREE.TextureLoader();
scene.background = loader.load('./images/sea.jpg');

const manager = new THREE.LoadingManager();


export function loadRock(x, z) {
  var loader = new GLTFLoader();
  loader.load('./3dobjects/' + 'rock.glb', function (gltf) {
    let floorElement = gltf.scene;
    floorElement.scale.set(0.5, 0.25, 0.5);
    floorElement.position.set(x, -1000, z);

    //floorElements.add(floorElement);
    displayFloorElmt.add(floorElement);
  }, undefined, function (error) {
    console.error(error);
  });
}

export function loadFloor(name, x, z) {
  var loader = new GLTFLoader();
  loader.load('./3dobjects/' + name+'.glb', function (gltf) {
    let floorElement = gltf.scene;
    floorElement.scale.set(300, 300, 300);
    floorElement.position.set(x, -240, z);

    //floorElements.add(floorElement);
    displayFloorElmt.add(floorElement);
  }, undefined, function (error) {
    console.error(error);
  });
}



// Load 3D object fish at the size asked and at the position asked
export function loadObject(size, nomPoisson, x, y, z, group) {
  var loader = new GLTFLoader();
  loader.load('./3dobjects/' + nomPoisson, function (gltf) {
    let poisson = gltf.scene;
    poisson.scale.set(size, size, size);
    poisson.position.set(x, y, z);

    group.add(poisson);
  }, undefined, function (error) {
    console.error(error);
  });
}

// Allow to empty a group of fishes
function deleteGroup() {
  for (var i = fishesGroup.children.length - 1; i >= 0; i--) {
    fishesGroup.remove(fishesGroup.children[i]);
  }
}

// Display the fish passed in parameter 
function displayFish(fish, group) {
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

  loadObject(fish.size, fichierName, fish.x, fish.y, fish.z, group);
}

// Display a certain number of fishes
function displayFishes(group) {
  for (let i = 0; i < FishShoal.fishesArray.length; i++) {
    displayFish(FishShoal.fishesArray[i], group);
  }
}

scene.add(fishesGroup);

// CONTROL

var controls = new OrbitControls(camera, renderer.domElement);

// LIGHT

const pointLight = new THREE.PointLight(0x00ff00, 2, 50);
const directionalLight = new THREE.DirectionalLight(0xffffff);
const ambientLight = new THREE.AmbientLight(0x111111);
scene.add(ambientLight);
scene.add(pointLight);
scene.add(directionalLight);


// SLIDERS

const slider_s = document.querySelector(".slider-separation");
const slider_ag = document.querySelector(".slider-cohesion");
const slider_al = document.querySelector(".slider-alignment");
const slider_mutChance = document.querySelector(".slider-mutChance");

slider_ag.addEventListener('change', () => {
  c_ag = slider_ag.value;
})
slider_s.addEventListener('change', () => {
  c_s = slider_s.value;
})
slider_al.addEventListener('change', () => {
  c_al = slider_al.value;
})

slider_mutChance.addEventListener('change', () => {
  FishShoal.setMutChance(slider_mutChance.value);
  console.log("val slider" + slider_mutChance.value);
})

let c_ag = slider_ag.value; let c_s = slider_s.value; let c_al = slider_al.value;

//BUTTONS
var btnNextYear = document.querySelector(".button-next-year");
if (btnNextYear != null) {
  btnNextYear.addEventListener('click', () => {
    FishShoal.nextYear();
    deleteGroup();
    displayFishes(fishesGroup);
    document.querySelector('.nbPoisson').innerHTML = FishShoal.getNbFishToString();
    Ground.nextYear(); //TODO réafficher
  });
}


// ANIMATION

let idAnim;

export function animate() {

  resizeRendererToDisplaySize(renderer);

  idAnim = requestAnimationFrame(animate);
  FishShoal.updatePosition(c_ag, c_s, c_al, fishesGroup);

  // Here, the code for animation

  renderer.render(scene, camera);
}

FishShoal.init(100);
displayFishes(fishesGroup);

animate();
document.addEventListener('keydown', () => {
  FishShoal.nextYear();
  deleteGroup();
  displayFishes(fishesGroup);
});

FishShoal.setMutChance(slider_mutChance.value);
//TEXT INFORMATION
document.querySelector('.nbPoisson').innerHTML = FishShoal.getNbFishToString();


export function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
      renderer.setSize(width, height, false);
  }
  return needResize;
}

// NeuralNetwork.demo();

createFloor(10);


function createFloor(size){
  Ground.init(size,size,4);
  let array = Ground.getGroundArray();
  console.log(Ground.toString());
  console.log(Ground.getGroundArray());
  let x;
  let z;
  for(let i=0; i<size; i++){
    for (let j=0; j<size; j++){

      x = i *(boxSize/size) -((boxSize)/2)+(boxSize/size)/2;
      z = j* (boxSize/size)-((boxSize)/2)+(boxSize/size)/2;

      if(array[i][j] == 1){
          loadFloor('blue_coral', x, z);
          console.log('blue_coral ',x, ' ', z);
        }
        
      if(array[i][j] == 2){
        loadFloor('yellow_coral', x, z);
        console.log('yellow_coral ',x, ' ', z);
        
      }
      if(array[i][j] == 3){
        loadFloor('red_coral', x, z);
        console.log('red_coral ', x, ' ', z)
        
      }

      if(array[i][j] == 4 ){
        loadRock(x, z); 
        console.log('rock ',x, ' ', z)
      }
    }
    
  }
}


scene.add(displayFloorElmt);

// Create renderer for display of species
const canvas2 = document.querySelector('#canvas-2');
const renderer2 = new THREE.WebGLRenderer({ canvas: canvas2, alpha: true });

const speciesButton = document.getElementById('display-species');
speciesButton.addEventListener('click', () => displaySpecies(idAnim, renderer2));

document.querySelector('#close-display-2').addEventListener('click', closeSpeciesDisplay);
