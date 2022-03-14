import * as THREE from 'three/build/three.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { displaySpecies, closeSpeciesDisplay } from './js/displaySpecies.js';
import { animateChangeYear, closePresentation, showPresentation, handleSlidersConsoleDisplay } from './js/buttonActions.js';

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
const eyesFish = new THREE.Group();
const colorList =["yellow", "blue", "red"];
//fin test


const manager = new THREE.LoadingManager();
manager.onLoad = function ( ) {

  console.log( 'Loading complete!');
  FishShoal.init(100);
  //FishShoal.init(2);
  displayFishes(fishesGroup);
  let body = bodyFish.children[2].clone();
  let tails = new THREE.Group();
  let fins = new THREE.Group();
  let eyes = new THREE.Group();
  let coupleFins = new THREE.Group();
  let tail= tailFish.children[2].clone();
  let fin = finsFish.children[2].clone();
  let fin2 = finsFish.children[2].clone();
  let eye = eyesFish.children[2].clone();
  let eye2 = eyesFish.children[2].clone();
  tail.position.set(2, 0, 1.2);
  fin.position.set(0,0,0);
  fin2.position.set(-0.6,0,2.6);
  fin2.rotation.set(0,-179,0);
  coupleFins.add(fin);
  coupleFins.add(fin2);
  let couples = coupleFins.clone();
  couples.position.set(0,0.3,0);
  let coupleEyes = new THREE.Group();
  

  eye2.position.set(0,0,-0.7);
  coupleEyes.add(eye);
  coupleEyes.add(eye2);
  let couple2 = coupleEyes.clone();
  couple2.position.set(0.1,0.1,0);
  
  fins.add(coupleFins);
  fins.add(couples);
  tails.add(tail);
  eyes.add(coupleEyes);
  eyes.add(couple2);
  tails.position.set(-0.4,-0.2,0.1);
  let newFish = new THREE.Group();
  newFish.add(body);
  newFish.add(tails);
  newFish.add(fins);
  newFish.add(eyes);
  newFish.position.set(10, 5, 20);
  newFish.scale.set(10, 10, 10);
  scene.add(newFish);
  
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
      console.log(gltf.scene);
        let body = gltf.scene;
        body.scale.set(5,5,5);
        body.position.set(0,0,0);
        body.name = colorList[i];
        bodyFish.add(body);
        
    }, undefined, function (error) {
      console.error(error);
    });
    loader.load('./3dobjects/queue_fish_'+colorList[i]+'.glb', function (gltf)
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
        eye.name =colorList[i];
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


  function createClones(size, color, x, y ,z, appearance){
    let newFish = assembleFish(color, appearance);
    newFish.scale.set(size,size,size);
    newFish.position.set(x,y,z);
    console.log("newFish");
    console.log(newFish);
      
    fishesGroup.add(newFish);
  }

  function assembleFish(color, appearance){
    let assembleFish = new THREE.Group();
    let body = bodyFish.children[color].clone(); //add body
    let fins = new THREE.Group();
    let coupleFins = new THREE.Group();
    let fin = finsFish.children[color].clone();
    let fin2 = finsFish.children[color].clone();
    fin2.rotation.set(0,-179,0);
    fin2.position.set(-0.6,0,2.6);
    coupleFins.add(fin);
    coupleFins.add(fin2);
    //Add tails
    let tails = new THREE.Group();
    let tail = tailFish.children[color].clone();
    console.log(tail);
    //Add eyes
    let eyes = new THREE.Group();
    let eye = eyesFish.children[color].clone();
    let eye2 = eyesFish.children[color].clone();
    let coupleEyes = new THREE.Group();
    eye2.position.set(0,0,-0.7);
    coupleEyes.add(eye);
    coupleEyes.add(eye2);

    let tail1 = tailFish.children[color].clone();
    let tail2 = tailFish.children[color].clone();
    tail1.rotation.set(0,0.5,0);
    tail1.position.set(2, 0, 1);
    tail2.rotation.set(0,-0.5,0);
    tail2.position.set(2, 0, 1.4);
    switch(appearance[1]){ //add tails
      case 1:
        tails.add(tail);
        tails.position.set(1.5, -0.3, 1.2);
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
function deleteGroup() {
  for (var i = fishesGroup.children.length - 1; i >= 0; i--) {
    fishesGroup.remove(fishesGroup.children[i]);
  }
}

function removeGround(){
  for (var i = displayFloorElmt.children.length - 1; i >= 0; i--) {
    displayFloorElmt.remove(displayFloorElmt.children[i]);
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
        let blue_coral = floorElements.children[1].clone();
        blue_coral.position.set(x, -240, z);
        displayFloorElmt.add(blue_coral);
        console.log('blue_coral ', x, ' ', z);
      }

      if (typeElement == 2) {
        let yellow_coral = floorElements.children[0].clone();
        yellow_coral.position.set(x, -240, z);
        displayFloorElmt.add(yellow_coral);
        console.log('yellow_coral ', x, ' ', z);

      }
      if (typeElement == 3) {
        let red_coral = floorElements.children[2].clone();
        red_coral.position.set(x, -240, z);
        displayFloorElmt.add(red_coral);
        console.log('red_coral ', x, ' ', z);

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
