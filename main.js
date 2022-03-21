import * as THREE from 'three/build/three.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { FishShoal } from "./js/FishShoal_old.js";
import * as FishShoal from "./js/FishShoal.js";
import { Fisherman } from './js/Fisherman.js';
import { Ground } from './js/Ground.js';
import { displaySpecies, closeSpeciesDisplay } from './js/displaySpecies.js';
import { animateChangeYear, closePopup, showPopup, handleSlidersConsoleDisplay, fillFishingOptions, updateFishingResult, updateFishingErrorMessage } from './js/buttonUIActions.js';

const scene = new THREE.Scene();
 
var camera = new THREE.PerspectiveCamera(55,window.innerWidth/window.innerHeight,45,10000);
camera.position.set(-100,-200,-300);

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

let skyboxGeo = new THREE.BoxGeometry(BOXSIZE, BOXSIZE, BOXSIZE);
let skybox = new THREE.Mesh(skyboxGeo, materialArray);
// skybox.position.x = -60;
skybox.position.y = 0;
skybox.position.z = 0;
scene.add(skybox);

const fishesGroup = new THREE.Group();
let floorElements = new THREE.Group();
export let displayFloorElmt = new THREE.Group();
const fishesObjectGroup = new THREE.Group();
const fishBodyGroup = new THREE.Group();
const bodyFish = new THREE.Group();
const tailFish = new THREE.Group();
const finsFish = new THREE.Group();
const eyesFish = new THREE.Group();
const colorList =["yellow", "blue", "red"];


const manager = new THREE.LoadingManager();
manager.onLoad = function ( ) {

  console.log( 'Loading complete!');
  FishShoal.init(30);
  //console.log(FishShoal.getNbFishToString());
  console.log('moyenne score poisson peche: ' +Fisherman.getMeanScoreFish());
  console.log( 'nb poisson qui vont etre peche: '+ Fisherman.getNbGoodFish());
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
        body.scale.set(5,5,5);
        body.position.set(0,0,0);
        body.name = colorList[i];
        bodyFish.add(body);

    }, undefined, function (error) {
      console.error(error);
    });
    loader.load('./3dobjects/queue_fish_'+ colorList[i]+'.glb', function (gltf)
    {
        let queue = gltf.scene;
        queue.scale.set(5,5,5);
        queue.position.set(0,0,0);
        queue.name =colorList[i];
        tailFish.add(queue);

    }, undefined, function (error) {
      console.error(error);
    });

    loader.load('./3dobjects/fins_fish_'+colorList[i]+'.glb', function (gltf)
    {
        let fin = gltf.scene;
        fin.scale.set(5,5,5);
        fin.position.set(0,0,0);
        fin.name =colorList[i];
        finsFish.add(fin);
        
    }, undefined, function (error) {
      console.error(error);
    });

    loader.load('./3dobjects/eyes_fish_'+colorList[i]+'.glb', function (gltf)
    {
        let eye = gltf.scene;
        eye.scale.set(5,5,5);
        eye.position.set(0,0,0);
        eye.name = colorList[i];
        eyesFish.add(eye);
        
    }, undefined, function (error) {
      console.error(error);
    });

    loader.load('./3dobjects/' + colorList[i] + '_coral.glb', function (gltf) {
      let floorElement = gltf.scene;
      floorElement.scale.set(300, 300, 300);
      floorElement.position.set(0, -240, 0);
      floorElement.name=colorList[i];
  
      floorElements.add(floorElement);
    }, undefined, function (error) {
      console.error(error);
    });
  }

}


  export function createClones(group, fish){
    let newFish = assembleFish(fish.color, fish.appearance);
    newFish.scale.set(fish.size,fish.size,fish.size);
    newFish.position.set(fish.x,fish.y,fish.z);
    fish.id_3dobject = newFish.id;

    group.add(newFish);
  }

  function assembleFish(color, appearance){
    let assembleFish = new THREE.Group();
    let body;
    let fin_object;
    let tail_object;
    let eye_object;
    for(let i=0; i<3; i++){
      // console.log(i);
      // console.log(colorList[i]);
      if(bodyFish.children[i].name == colorList[color]){
        body = bodyFish.children[color].clone();
        // console.log(bodyFish.children[color].name);
      }
      if(finsFish.children[i].name == colorList[color]){
        fin_object = finsFish.children[color];
        // console.log(finsFish.children[color].name);
      }
      if(tailFish.children[i].name == colorList[color]){
        tail_object = tailFish.children[color];
        // console.log(tailFish.children[color].name);      
      }

      if(eyesFish.children[i].name == colorList[color]){
        eye_object = eyesFish.children[color];
        // console.log(eyesFish.children[color].name);       
      }
    }

    //let body = bodyFish.children[color].clone(); //add body
    let fins = new THREE.Group();
    let coupleFins = new THREE.Group();
    let fin = fin_object.clone();
    let fin2 = fin_object.clone();
    //let fin = finsFish.children[color].clone();
    //let fin2 = finsFish.children[color].clone();
    //let fin2 = fin.clone();
    fin2.rotation.set(0,-179,0);
    fin2.position.set(-0.6,0,2.6);
    coupleFins.add(fin);
    coupleFins.add(fin2);
    
    //Add tails
    let tails = new THREE.Group();
    let tail = tail_object.clone();
    //let tail = tailFish.children[color].clone();
    //Add eyes
    let eyes = new THREE.Group();
    let eye = eye_object.clone();
    let eye2 = eye_object.clone();
    let coupleEyes = new THREE.Group();
    eye2.position.set(0,0,-0.7);
    coupleEyes.add(eye);
    coupleEyes.add(eye2);

    //let tail1 = tailFish.children[color].clone();
    //let tail2 = tailFish.children[color].clone();
    let tail1 = tail.clone();
    let tail2 = tail.clone();
    tail1.rotation.set(0,0.5,0);
    tail1.position.set(2, 0, 1);
    tail2.rotation.set(0,-0.5,0);
    tail2.position.set(2, 0, 1.4);
    tail.position.set(2, 0, 1.2);

    switch(appearance[1]){ //add tails
      case 1:
        tails.add(tail);
        // tails.position.set(1.5, -0.3, 1.2);
        tails.position.set(-0.25,-0.16,0.1);
        break;
      case 2:
        tails.add(tail1);
        tails.add(tail2);
        tails.position.set(-0.4,-0.2,0.1);
        break;

      case 3:
        tails.add(tail1);
        tails.add(tail2);
        tails.add(tail);
        tails.position.set(-0.4,-0.2,0.1);
        break;
    }
    switch(appearance[2]){//add fins
      case 1:
        fins.add(fin);
        break;
      case 2:
        fins.add(coupleFins);
        break;

      case 3:
        fin.position.set(0, 0.5, 0);
        fins.add(coupleFins);
        fins.add(fin);
        break;

      case 4:
        let couple2 = coupleFins.clone();
        couple2.position.set(0,0.5,0);
        fins.add(coupleFins);
        fins.add(couple2);
        break;
    }
    switch(appearance[0]){//add eyes
      case 1:
        eyes.add(eye);
        break;
      case 2:
        eyes.add(coupleEyes);
        break;

      case 3:
        eye.position.set(0, 0, 0.2);
        eyes.add(coupleEyes);
        eyes.add(eye);
        break;

      case 4:
        let couple2 = coupleEyes.clone();
        couple2.position.set(0.1,0.1,0);
        eyes.add(coupleEyes);
        eyes.add(couple2);
        break;
    }
    assembleFish.add(body);
    assembleFish.add(tails);
    assembleFish.add(fins);
    assembleFish.add(eyes);
    return assembleFish;
  }

// Allow to empty a group of fishes
export function deleteGroup(group) {
  for (var i = group.children.length - 1; i >= 0; i--) {
    group.remove(group.children[i]);
  }
}

// Display the fish passed in parameter 
function displayFish(fish,group) {
  createClones(group, fish);
  }

// Display a certain number of fishes
export function displayFishes(group) {
  for (let i = 0; i < fishesArray.length; i++) {
    displayFish(fishesArray[i], group);
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
let year = 1;
btnNextYear.addEventListener('click', () => {

  if(eatingPeriod === "no") {
    btnNextYear.classList.add('btn-disabled');
    const fishingConsoleBtn = document.querySelector('#fishing-console-btn');
    fishingConsoleBtn.classList.add('btn-disabled');
    console.log("EATING PERIOD BEGINS");

    // console.log(fishesArray);
    // console.log(fishesGroup.children.map(fish => fish.id));

    eatingPeriod = "ongoing";
    // FishShoal.nextYear();
    // deleteGroup(fishesGroup);
    // displayFishes(fishesGroup);
    // document.querySelector('.nbPoisson').innerHTML = FishShoal.getNbFishToString();
    //Ground.nextYear(); //TODO réafficher
    year = animateChangeYear(year);

  }
});

const presentation = document.querySelector('#presentation-wp');

const closePresentationBtn = document.querySelector('#close-presentation');
closePresentationBtn.addEventListener('click', () => closePopup(presentation));

const infoBtn = document.querySelector('#info-btn');
infoBtn.addEventListener('click', () => showPopup(presentation));

const slidersBtn = document.querySelector('#sliders-btn');
slidersBtn.addEventListener('click', handleSlidersConsoleDisplay);

const fishingConsole = document.querySelector('#fishing-console-wp');

const closeFishingConsoleBtn = document.querySelector('#close-fishing-console');
closeFishingConsoleBtn.addEventListener('click', () => closePopup(fishingConsole));

const fishingConsoleBtn = document.querySelector('#fishing-console-btn');
fishingConsoleBtn.addEventListener('click', () => {
  if(eatingPeriod === "no") showPopup(fishingConsole);
});

const fishingResult = document.querySelector('#fishing-result-wp');

function updateFishermanTarget() {
  const colorInput = document.querySelector('[name=fishing-opt-color]');
  const sizeInput = document.querySelector('[name=fishing-opt-size]');
  const eyesInput = document.querySelector('[name=fishing-opt-eyes]');
  const finsInput= document.querySelector('[name=fishing-opt-fins]');
  const tailsInput = document.querySelector('[name=fishing-opt-tails]');

  let color = 0;
  switch (colorInput.value) {
    case colorList[0]:
      color = 0
      break;
    case colorList[1]:
      color = 1
      break;
    case colorList[2]:
      color = 2
      break;
    default:
      color = -1
      console.log("undefined color");
      break;
  }
  Fisherman.colorTarget = color;
  Fisherman.sizeTarget = sizeInput.value;
  Fisherman.nbEyeTarget = eyesInput.value;
  Fisherman.nbFinTarget = finsInput.value;
  Fisherman.nbTailTarget = tailsInput.value;

  // console.log("Fisherman target");
  // console.log("color : ", Fisherman.colorTarget);
  // console.log("size : ", Fisherman.sizeTarget);
  // console.log("eye : ", Fisherman.nbEyeTarget);
  // console.log("fin : ", Fisherman.nbFinTarget);
  // console.log("tail : ", Fisherman.nbTailTarget);
}

const fishingBtn = document.querySelector('#fishing-btn');
fishingBtn.addEventListener('click', () => {
    updateFishermanTarget();
    const fishesValid = Fisherman.getNbGoodFish();
    Fisherman.goFishing(fishesGroup);
    const fishesCaugth = fishesValid;
    // deleteGroup(fishesGroup);
    // displayFishes(fishesGroup);

    closePopup(fishingConsole);
    updateFishingResult(fishesCaugth);
    showPopup(fishingResult);
  
})

const closeFishingResultBtn = document.querySelector('#close-fishing-result');
closeFishingResultBtn.addEventListener('click', () => closePopup(fishingResult));

fillFishingOptions();

loadObjectSeparate();


// ANIMATION

let idAnim;

export function animate() {

  resizeRendererToDisplaySize(renderer);

  idAnim = requestAnimationFrame(animate);
  FishShoal.update(c_ag, c_s, c_al, fishesGroup);

  // Here, the code for animation

  renderer.render(scene, camera);
}



animate();
document.addEventListener('keydown', () => {

  //FishShoal.nextYear();
});

//TEXT INFORMATION
// document.querySelector('.nbPoisson').innerHTML = FishShoal.getNbFishToString();


export function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    console.log("resize");
    renderer.setSize(width, height, false);
  }
  return needResize;
}

// NeuralNetwork.demo();




function createFloor(nbCoralsPerLine) {
  Ground.init(BOXSIZE, nbCoralsPerLine, 4);
  console.log(Ground.toString2());

  for (let i = 0; i < nbCoralsPerLine; i++) {
    for (let j = 0; j < nbCoralsPerLine; j++) {

        displayFloor(i,j);
    }

  }
}

export function displayFloor(i, j) {

  let x;
  let z;
  let typeElement;
  x = Ground.getCoralX(i,j);
  z = Ground.getCoralY(i,j);
  typeElement = Ground.getTypeElement(i, j);

  let element;
  
  // Blue coral
  if (typeElement == 1) {
    element = floorElements.children[1].clone();
    element.position.set(x, -BOXSIZE/2, z);
    displayFloorElmt.add(element);
    // Ground.getGroundArray(i, j, blue_coral.id);
    //console.log('blue_coral ', x, ' ', z);
  }

  // Yellow coral
  if (typeElement == 2) {
    element = floorElements.children[0].clone();
    element.position.set(x, -BOXSIZE/2, z);
    displayFloorElmt.add(element);
    // Ground.getGroundArray(i, j, yellow_coral.id);
    //console.log('yellow_coral ', x, ' ', z);

  }

  // Red coral
  if (typeElement == 3) {
    element = floorElements.children[2].clone();
    element.position.set(x, -BOXSIZE/2, z);
    displayFloorElmt.add(element);
    // Ground.getGroundArray(i, j, red_coral.id);
    //console.log('red_coral ', x, ' ', z);

  }

  if(element) Ground.groundArray[i][j].e_id_3d_object = element.id;
}


scene.add(displayFloorElmt);

console.log(scene.getObjectByName("fish9"));

// SPECIES DISPLAY

// Create renderer for display of species
const canvas2 = document.querySelector('#canvas-2');
const renderer2 = new THREE.WebGLRenderer({ canvas: canvas2, alpha: true });


document.getElementById('species-display-btn').addEventListener('click', () => displaySpecies(idAnim, renderer2));

document.querySelector('#species-close-btn').addEventListener('click', closeSpeciesDisplay);
