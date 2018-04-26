//COLORS
var Colors = {
    red:0xf25346,
    white:0xd8d0d1,
    yellow:0xFFC312,
    pink:0xF5986E,
    darkpink:0xED4C67,
    green:0x0fb9b1,
    brown:0x59332e,
    brownDark:0x23190f,
    blue:0x1e3799,
    orange:0xfc5902
};

// THREEJS RELATED VARIABLES

var scene, gui,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane,
    renderer, controls, container;

//SCREEN VARIABLES

var HEIGHT, WIDTH;

//INIT THREE JS, SCREEN AND MOUSE EVENTS

function createScene() {

  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();
  // gui = new dat.GUI();
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 80;
  nearPlane = 1;
  farPlane = 10000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
    );

  camera.position.x = 0;
  camera.position.z = 300;
  camera.position.y = 100;

  var cameraZPosition = new THREE.Group();
  var cameraYRotation = new THREE.Group();
  var cameraXRotation = new THREE.Group();

  cameraZPosition.name = 'cameraZPosition';
  cameraYRotation.name = 'cameraYRotation';
  cameraXRotation.name = 'cameraXRotation';

  cameraZPosition.add(camera);
  cameraXRotation.add(cameraZPosition);
  cameraYRotation.add(cameraXRotation);
  scene.add(cameraYRotation);

  // gui.add(cameraZPosition.position,'z' , 0, 200);
  // gui.add(cameraZPosition.rotation,'y' , -Math.PI, Math.PI);
  // gui.add(cameraZPosition.rotation,'x' , -Math.PI, Math.PI);

  scene.fog = new THREE.Fog(0xf7d9aa, 100,950);

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;
  container = document.getElementById('world');
  container.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);

  window.addEventListener('resize', handleWindowResize, false);
}

// HANDLE SCREEN EVENTS

function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}


// LIGHTS

var ambientLight, hemisphereLight, shadowLight;

function createLights() {

  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9);

  ambientLight = new THREE.AmbientLight(0xdc8874, .5);

  shadowLight = new THREE.DirectionalLight(0xffffff, .9);
  shadowLight.position.set(150, 350, 350);
  shadowLight.castShadow = true;
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;

  scene.add(hemisphereLight);
  scene.add(shadowLight);
  scene.add(ambientLight);
}

var Star = function(){
  this.mesh = new THREE.Object3D();
  this.mesh.name = "cloud";
  var geom = new THREE.CubeGeometry(0.1,1000,0.1);
  var mat = new THREE.MeshPhongMaterial({
    color:Colors.orange,
  });

  var nBlocs = 50;
  for (var i=0; i<nBlocs; i++ ){
    var m = new THREE.Mesh(geom.clone(), mat);
    m.position.x = ( Math.random() - .5 ) * 500;
    // m.position.y = ( Math.random() - .5 ) * 500;
    m.position.z = ( Math.random() - .5 ) * 500;

    // m.rotation.z = Math.random()*Math.PI*2;
    m.rotation.z = 45;
    m.castShadow = true;
    m.receiveShadow = true;
    this.mesh.add(m);
  }
}
// 3D Models
var sea;
var planet;
var star;

function createPlanet(){
  planet = new Planet();
  planet.mesh.scale.set(1,1,1);
  scene.add(planet.mesh);
}

function createStar(){
  star = new Star();
  star.mesh.position.y = 90;
  star.mesh.scale.set(1,1,1);
  scene.add(star.mesh);
}

function loop(){
  var cameraYRotation = scene.getObjectByName('cameraYRotation');
  cameraYRotation.rotation.y += 0.001;

  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}


function normalize(v,vmin,vmax,tmin, tmax){
  var nv = Math.max(Math.min(v,vmax), vmin);
  var dv = vmax-vmin;
  var pc = (nv-vmin)/dv;
  var dt = tmax-tmin;
  var tv = tmin + (pc*dt);
  return tv;
}

function init(event){
  document.addEventListener('mousemove', handleMouseMove, false);
  createScene();
  createLights();
  createStar();
  // createPlanet();
  loop();
}

// HANDLE MOUSE EVENTS

var mousePos = { x: 0, y: 0 };

function handleMouseMove(event) {
  var tx = -1 + (event.clientX / WIDTH)*2;
  var ty = 1 - (event.clientY / HEIGHT)*2;
  mousePos = {x:tx, y:ty};
}

window.addEventListener('load', init, false);
