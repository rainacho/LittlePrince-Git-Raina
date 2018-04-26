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
  gui = new dat.GUI();
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

  gui.add(cameraZPosition.position,'z' , 0, 200);
  gui.add(cameraZPosition.rotation,'y' , -Math.PI, Math.PI);
  gui.add(cameraZPosition.rotation,'x' , -Math.PI, Math.PI);

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
  var geom = new THREE.CubeGeometry(1,1,1);
  var mat = new THREE.MeshPhongMaterial({
    color:Colors.white,
  });

  var nBlocs = Math.floor(Math.random()*1000);
  for (var i=0; i<nBlocs; i++ ){
    var m = new THREE.Mesh(geom.clone(), mat);
    m.position.x = ( Math.random() - .5 ) * 500;
    m.position.y = ( Math.random() - .5 ) * 500;
    m.position.z = ( Math.random() - .5 ) * 500;

    // m.rotation.z = Math.random()*Math.PI*2;
    // m.rotation.y = Math.random()*Math.PI*2;
    m.castShadow = true;
    m.receiveShadow = true;
    this.mesh.add(m);
  }
}

var Prince = function(){
  this.mesh = new THREE.Object3D();
  this.mesh.name = "prince";
  this.angleHairs=0;

  var bodyGeom = new THREE.BoxGeometry(15,15,15);
  var bodyMat = new THREE.MeshPhongMaterial({color:Colors.green, shading:THREE.FlatShading});
  var body = new THREE.Mesh(bodyGeom, bodyMat);
  body.position.set(2,-12,0);
  body.castShadow = true;
  body.receiveShadow = true;

  this.mesh.add(body);

  var beltGeom = new THREE.BoxGeometry(15.2,2,15.2);
  var beltMat = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
  var belt = new THREE.Mesh(beltGeom, beltMat);
  belt.position.set(2,-12,0);

  this.mesh.add(belt);

  var faceGeom = new THREE.BoxGeometry(10,10,10);
  var faceMat = new THREE.MeshLambertMaterial({color:Colors.pink});
  var face = new THREE.Mesh(faceGeom, faceMat);
  face.castShadow = true;
  face.receiveShadow = true;
  this.mesh.add(face);

  var hairGeom = new THREE.BoxGeometry(4,4,4);
  var hairMat = new THREE.MeshLambertMaterial({color:Colors.yellow});
  var hair = new THREE.Mesh(hairGeom, hairMat);
  hair.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,2,0));
  var hairs = new THREE.Object3D();

  this.hairsTop = new THREE.Object3D();

  for (var i=0; i<12; i++){
    var h = hair.clone();
    var col = i%3;
    var row = Math.floor(i/3);
    var startPosZ = -4;
    var startPosX = -4;
    h.position.set(startPosX + row*4, 0, startPosZ + col*4);
    this.hairsTop.add(h);
  }
  hairs.add(this.hairsTop);

  var hairSideGeom = new THREE.BoxGeometry(12,4,2);
  hairSideGeom.applyMatrix(new THREE.Matrix4().makeTranslation(-6,0,0));
  var hairSideR = new THREE.Mesh(hairSideGeom, hairMat);
  var hairSideL = hairSideR.clone();
  hairSideR.position.set(8,-2,6);
  hairSideL.position.set(8,-2,-6);
  hairs.add(hairSideR);
  hairs.add(hairSideL);

  var hairBackGeom = new THREE.BoxGeometry(2,8,10);
  var hairBack = new THREE.Mesh(hairBackGeom, hairMat);
  hairBack.position.set(-1,-4,0)
  hairs.add(hairBack);
  hairs.position.set(-5,5,0);
  hairs.castShadow = true;
  hairs.receiveShadow = true;

  this.mesh.add(hairs);

  var glassGeom = new THREE.BoxGeometry(1,2,2);
  var glassMat = new THREE.MeshLambertMaterial({color:Colors.brown});
  var glassR = new THREE.Mesh(glassGeom,glassMat);
  glassR.position.set(6,0,3);

  var glassL = glassR.clone();
  glassL.position.z = -glassR.position.z
  this.mesh.add(glassR);
  this.mesh.add(glassL);

  var earGeom = new THREE.BoxGeometry(2,3,2);
  var earL = new THREE.Mesh(earGeom,faceMat);
  earL.position.set(0,0,-6);
  earL.castShadow = true;
  earL.receiveShadow = true;
  var earR = earL.clone();
  earR.position.set(0,0,6);
  earR.castShadow = true;
  earR.receiveShadow = true;
  this.mesh.add(earL);
  this.mesh.add(earR);

  var legGeom = new THREE.BoxGeometry(5,20,5);
  var legMat = new THREE.MeshLambertMaterial({color:Colors.green});
  var legR = new THREE.Mesh(legGeom,legMat);
  legR.position.set(6,-20,3);
  legR.castShadow = true;
  legR.receiveShadow = true;

  var legL = legR.clone();
  legL.position.z = -legR.position.z;
  legL.castShadow = true;
  legL.receiveShadow = true;
  this.mesh.add(legR);
  this.mesh.add(legL);

  var armGeom = new THREE.BoxGeometry(3,8,3);
  var armMat = new THREE.MeshLambertMaterial({color:Colors.green});
  var armR = new THREE.Mesh(armGeom,armMat);
  armR.position.set(6,-9,9);
  armR.castShadow = true;
  armR.receiveShadow = true;
  var armL = armR.clone();
  armL.position.z = -armR.position.z;
  armL.castShadow = true;
  armL.receiveShadow = true;
  this.mesh.add(armR);
  this.mesh.add(armL);

  var handGeom = new THREE.BoxGeometry(3.1,3.1,3.1);
  var handMat = new THREE.MeshLambertMaterial({color:Colors.pink});
  var handR = new THREE.Mesh(handGeom,handMat);
  handR.position.set(6,-12,9);
  handR.castShadow = true;
  handR.receiveShadow = true;


  var handL = handR.clone();
  handL.position.z = -handR.position.z;
  handL.castShadow = true;
  handL.receiveShadow = true;
  this.mesh.add(handR);
  this.mesh.add(handL);
}

Prince.prototype.updateHairs = function(){
  var hairs = this.hairsTop.children;

  var l = hairs.length;
  for (var i=0; i<l; i++){
    var h = hairs[i];
    h.scale.y = .75 + Math.cos(this.angleHairs+i/3)*.25;
  }
  this.angleHairs += 0.16;
}


var Planet = function(){
  this.mesh = new THREE.Object3D();
  this.mesh.name = "planet";

  var geomPlanet = new THREE.SphereGeometry( 50, 10, 10 );
  var matPlanet = new THREE.MeshPhongMaterial({color:Colors.darkpink, shading:THREE.FlatShading});
  var planet = new THREE.Mesh(geomPlanet, matPlanet);
  planet.castShadow = true;
  planet.receiveShadow = true;
  this.mesh.add(planet);

  this.prince = new Prince();
  this.prince.mesh.scale.set(.5,.5,.5);
  this.prince.mesh.position.y = 64;
  this.prince.mesh.rotation.y = -Math.PI/2;
  this.mesh.add(this.prince.mesh);

  this.mesh.castShadow = true;
  this.mesh.receiveShadow = true;

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
  updatePlanet();
  planet.prince.updateHairs();

  // var cameraZPosition = scene.getObjectByName('cameraZPosition');
  // cameraZPosition.position.z -= 0.25;

  var cameraYRotation = scene.getObjectByName('cameraYRotation');
  cameraYRotation.rotation.y += 0.001;

  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

function updatePlanet(){
  var targetY = normalize(mousePos.y,-.75,.75,100, 125);
  var targetX = normalize(mousePos.x,-.75,.75,-100, 100);
  planet.mesh.rotation.y = (targetX-planet.mesh.position.x)*0.0108;
  planet.mesh.scale.x = (targetY-planet.mesh.position.x)*0.0108;
  planet.mesh.scale.y = (targetY-planet.mesh.position.x)*0.0108;
  planet.mesh.scale.z = (targetY-planet.mesh.position.x)*0.0108;
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
  createPlanet();
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


// CHANGE Colors

document.getElementById("myBtn1").addEventListener("click", function(){
    document.getElementById("gameHolder").style.background = "linear-gradient(to bottom right,#0e172f, #060a14)";
});

document.getElementById("myBtn2").addEventListener("click", function(){
    document.getElementById("gameHolder").style.background = "linear-gradient(to bottom right, #ed4e14, #FFC312)";
});

/*Loading Screen*/
function screenLoadd(){
  $(function(){
     $('.preloader').addClass('complete');
     $('.loader').fadeOut('fast');
  });
}
setTimeout(screenLoadd, 4000);
