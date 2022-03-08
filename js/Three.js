
    import * as THREE from '../node_modules/three/build/three.module.js';
    import { OrbitControls } from '../vendor_mods/three/examples/jsm/controls/OrbitControls.js';
    import { GLTFLoader } from '../vendor_mods/three/examples/jsm/loaders/GLTFLoader.js';


    const scene = new THREE.Scene();
    /*var camera = new THREE.PerspectiveCamera(
      /*fov*/ 75,
      /*aspect ratio*/ window.innerWidth / window.innerHeight,
      /*near*/ 0.1,
      /*far*/ 1000
   /* );
    camera.position.z = 150;
    camera.position.x = 100;
    camera.position.y = 100;*/
    var camera = new THREE.PerspectiveCamera(55,window.innerWidth/window.innerHeight,45,30000);
    camera.position.set(-900,-200,-900);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const fishesGroup = new THREE.Group();
    //TEST
    const fishesObjectGroup = new THREE.Group();
    const fishBodyGroup = new THREE.Group();
    //fin test

    /*const loader = new THREE.TextureLoader();
    scene.background = loader.load('./images/sea.jpg');*/

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
      
    let skyboxGeo = new THREE.BoxGeometry( 10000, 10000, 10000);
    let skybox = new THREE.Mesh( skyboxGeo, materialArray );
    scene.add( skybox );


    let poisson; 

    function loadObject(nomPoisson){
      var loader = new GLTFLoader();
          loader.load('./3dobjects/'+ nomPoisson, function (gltf)
      {
          poisson = gltf.scene;
          poisson.position.set(0,0,0);
          fishesObjectGroup.add(poisson);
          console.log("poisson");
          console.log(poisson);
          
          //fishesGroup.add(poisson);
          
      }, undefined, function (error) {
        console.error(error);
      });
    }
  
    function createClones(size, color, x, y ,z){
      console.log(fishesObjectGroup);
      console.log(fishesObjectGroup.children[0]);
      let newFish = fishesObjectGroup.children[0].clone();
      newFish.scale.set(size,size,size);
      newFish.position.set(x,y,z);
        
      fishesGroup.add(newFish);
    }
      

    // Allow to empty a group of fishes
    function deleteGroup(){
      for (var i = fishesGroup.children.length - 1; i >= 0; i--) {
          fishesGroup.remove(fishesGroup.children[i]);
      }
    }

    // Display the fish passed in parameter 
    function displayFish(fish){
      console.log(fish.color);
      
      createClones(fish.size, fish.color, fish.x, fish.y, fish.z);
    }

    let fishesArray = [];

    // Display a certain number of fishes
    function displayFishes(){
        for(let i=0; i< fishesArray.length; i++){
          displayFish(fishesArray[i]);
        }
    }

    function init(number) {
      for(let i=0; i< number; i++){
        fishesArray.push(Fish.fishRandom(i, fishesArray));
      }

      var fichierName = ["poisson2.glb"];
      //for(let i=0; i<3; i++){
        loadObject(fichierName[0]);
      //}

      console.log(fishesObjectGroup);
    }

    function loadObjectSeparate(){
      var loader = new GLTFLoader();
         loader.load('./3dobjects/fish_main_red.glb', function (gltf)
      {
          let body = gltf.scene;
          body.scale.set(20,20,20);
          body.position.set(0,0,0);
          fishBodyGroup.add(body);
          
          //fishesGroup.add(poisson);
          
      }, undefined, function (error) {
        console.error(error);
      });
      loader.load('./3dobjects/queue_fish_blue.glb', function (gltf)
      {
          let queue = gltf.scene;
          queue.scale.set(10,10,10);
          queue.position.set(6,-0.5,2.5);
          fishBodyGroup.add(queue);
          
          //fishesGroup.add(poisson);
          
      }, undefined, function (error) {
        console.error(error);
      });

        
    }

    loadObjectSeparate();

    scene.add(fishBodyGroup);
    //fin du test

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

    // ANIMATION

    function animate() {
      
      requestAnimationFrame(animate);

      // Here, the code for animation
      renderer.render(scene, camera);
    }

    //init(100);
    //displayFishes();

    animate();

    // Generate a new generation of fishes and delete the previous generations
    function generateNewGeneration() {

      const couples = selection(fishesArray); // [  [fish1, fish2], ...]
      fishesArray = [];

      couples.forEach(couple => {
        let child1 = Fish.generateChild(fishesArray.length, couple[0], couple[1], fishesArray);
        fishesArray.push(child1);
      });

      deleteGroup();
    }

    document.addEventListener('keydown', () => {
      generateNewGeneration();
      displayFishes();
    });