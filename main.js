import * as THREE from 'three/build/three.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { displaySpecies, closeSpeciesDisplay } from './js/displaySpecies.js';
import { animateChangeYear, closePresentation, showPresentation, handleSlidersConsoleDisplay } from './js/buttonActions.js';

const scene = new THREE.Scene();
// var camera = new THREE.PerspectiveCamera(
//       /*fov*/ 55,
//       /*aspect ratio*/ window.innerWidth / window.innerHeight,
//       /*near*/ 45,
//       /*far*/ 30000
// );
// camera.position.x = -100;
// camera.position.y = -200;
// camera.position.z = -300;

var camera = new THREE.PerspectiveCamera(55,window.innerWidth/window.innerHeight,45,10000);
camera.position.set(-900,-200,-900);

const canvas = document.querySelector('#canvas-1');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector("#display-1").appendChild(renderer.domElement);

let materialArray = [];
let texture_ft = new THREE.TextureLoader().load( 'images/aqua9_ft.jpg');
let texture_bk = new THREE.TextureLoader().load( 'images/aqua9_bk.jpg');
let texture_up = new THREE.TextureLoader().load( 'images/aqua9_up.jpg');
let texture_dn = new THREE.TextureLoader().load( 'images/aqua9_dn.jpg');
let texture_rt = new THREE.TextureLoader().load( 'images/aqua9_rt.jpg');
let texture_lf = new THREE.TextureLoader().load( 'images/aqua9_lf.jpg');
  
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
let skybox = new THREE.Mesh(skyboxGeo, materialArray);
skybox.position.x = -60;
skybox.position.y = 0;
skybox.position.z = 0;
scene.add(skybox);

const fishesGroup = new THREE.Group();
let floorElements = new THREE.Group();
let displayFloorElmt = new THREE.Group();
//TEST
const fishesObjectGroup = new THREE.Group();
const fishBodyGroup = new THREE.Group();
const bodyFish = new THREE.Group();
const tailFish = new THREE.Group();
const finsFish = new THREE.Group();
const colorList =["yellow", "blue", "red"];
//fin test


const manager = new THREE.LoadingManager();
manager.onLoad = function ( ) {

  console.log( 'Loading complete!');
  //createClones(20, 0, 5, 5 ,5, [2,2,1]);
  //init(100);
  //displayFishes();
  FishShoal.init(100);
  displayFishes(fishesGroup);
  
  FishShoal.setMutChance(slider_mutChance.value);
  createFloor(10);

};

manager.onError = function ( url ) {

  console.log( 'There was an error loading ' + url );

};

function loadObjectSeparate(){
  var loader = new GLTFLoader(manager);
  for(let i=0; i<colorList.length; i++){
    loader.load('./3dobjects/fish_main_'+ colorList[i]+'.glb', function (gltf)
    {
        let body = gltf.scene;
        body.scale.set(20,20,20);
        body.position.set(0,0,0);
        bodyFish.add(body);
        
    }, undefined, function (error) {
      console.error(error);
    });
    loader.load('./3dobjects/queue_fish_'+colorList[i]+'.glb', function (gltf)
    {
        let queue = gltf.scene;
        queue.scale.set(10,10,10);
        queue.position.set(6,-1.8,2.9);
        tailFish.add(queue);
        
    }, undefined, function (error) {
      console.error(error);
    });
  }
}

 function loadRock(x, z) {
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

 function loadFloor(name, x, z) {
  var loader = new GLTFLoader();
  loader.load('./3dobjects/' + name + '.glb', function (gltf) {
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
// export function loadObject(size, nomPoisson, x, y, z, group) {
//   var loader = new GLTFLoader();
//   loader.load('./3dobjects/' + nomPoisson, function (gltf) {
//     let poisson = gltf.scene;
//     poisson.scale.set(size, size, size);
//     poisson.position.set(x, y, z);

//     group.add(poisson);
//   }, undefined, function (error) {
//     console.error(error);
//   });
// }

  function createClones(size, color, x, y ,z, appearance){
    let newFish = assembleFish(color, appearance);
    newFish.scale.set(size,size,size);
    newFish.position.set(x,y,z);
      
    fishesGroup.add(newFish);
  }

  function assembleFish(color, appearance){
    const assembleFish = new THREE.Group();
    let body = bodyFish.children[color].clone(); //add body
    //Add tails
    let tail = tailFish.children[color].clone();
    let tail1 = tailFish.children[0].clone();
    let tail2 = tailFish.children[0].clone();
    tail1.rotation.set(0,0.5,0);
    tail1.position.set(6,-1.8,2)
    tail2.rotation.set(0,-0.5,0);
    tail2.position.set(8,-1.8,4.5);
    switch(appearance[1]){
      case 1:
        assembleFish.add(tail);
        break;
      case 2:
        assembleFish.add(tail1);
        assembleFish.add(tail2);
        break;

      case 3:
        assembleFish.add(tail1);
        assembleFish.add(tail2);
        assembleFish.add(tail);
        break;
    }
    assembleFish.add(body);
    return assembleFish;
  }

// Allow to empty a group of fishes
function deleteGroup() {
  for (var i = fishesGroup.children.length - 1; i >= 0; i--) {
    fishesGroup.remove(fishesGroup.children[i]);
  }
}

// Display the fish passed in parameter 
function displayFish(fish,group) {
  createClones(fish.size, fish.color, fish.x, fish.y, fish.z, fish.appearance);
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
})

let c_ag = slider_ag.value; let c_s = slider_s.value; let c_al = slider_al.value;


// BUTTONS

const btnNextYear = document.querySelector("#next-year-btn");
btnNextYear.addEventListener('click', () => {

  FishShoal.nextYear();
  deleteGroup();
  displayFishes(fishesGroup);
  // document.querySelector('.nbPoisson').innerHTML = FishShoal.getNbFishToString();
  // Ground.nextYear(); //TODO réafficher

  animateChangeYear();
});

const closePresentationBtn = document.querySelector('#close-presentation');
closePresentationBtn.addEventListener('click', closePresentation);

const infoBtn = document.querySelector('#info-btn');
infoBtn.addEventListener('click', showPresentation);

const slidersBtn = document.querySelector('#sliders-btn');
slidersBtn.addEventListener('click', handleSlidersConsoleDisplay);

loadObjectSeparate();


// ANIMATION

let idAnim;

export function animate() {

  resizeRendererToDisplaySize(renderer);

  idAnim = requestAnimationFrame(animate);
  FishShoal.updatePosition(c_ag, c_s, c_al, fishesGroup);

  // Here, the code for animation

  renderer.render(scene, camera);
}



animate();
document.addEventListener('keydown', () => {
  FishShoal.nextYear();
  deleteGroup();
  displayFishes(fishesGroup);
});

//TEXT INFORMATION
// document.querySelector('.nbPoisson').innerHTML = FishShoal.getNbFishToString();


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




function createFloor(nbCoralsPerLine) {
  Ground.init(boxSize, nbCoralsPerLine, 4);
  console.log(Ground.toString());
  console.log(Ground.getGroundArray());
  let x;
  let z;
  let typeElement;
  for (let i = 0; i < nbCoralsPerLine; i++) {
    for (let j = 0; j < nbCoralsPerLine; j++) {

      x = Ground.getCoralX(i);
      z = Ground.getCoralY(j);
      typeElement = Ground.getTypeElement(i, j)
      if (typeElement == 1) {
        loadFloor('blue_coral', x, z);
        console.log('blue_coral ', x, ' ', z);
      }

      if (typeElement == 2) {
        loadFloor('yellow_coral', x, z);
        console.log('yellow_coral ', x, ' ', z);

      }
      if (typeElement == 3) {
        loadFloor('red_coral', x, z);
        console.log('red_coral ', x, ' ', z)

      }

      if (typeElement == 4) {
        loadRock(x, z);
        console.log('rock ', x, ' ', z)
      }
    }

  }
}


scene.add(displayFloorElmt);

// SPECIES DISPLAY

// Create renderer for display of species
const canvas2 = document.querySelector('#canvas-2');
const renderer2 = new THREE.WebGLRenderer({ canvas: canvas2, alpha: true });


//document.getElementById('species-display-btn').addEventListener('click', () => displaySpecies(idAnim, renderer2));

//document.querySelector('#species-close-btn').addEventListener('click', closeSpeciesDisplay);
