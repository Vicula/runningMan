var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 1, 2 );
var material = new THREE.MeshBasicMaterial( { color: 0xBFBFBF } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

var charGeometry = new THREE.BoxGeometry(1, 1.2, 0.5);
var charMaterial = new THREE.MeshBasicMaterial({ color: 0xA0A0A0 })
var chara = new THREE.Mesh(charGeometry, charMaterial);
scene.add(chara);
chara.position.set(-4.7, -1.2, 0);


var groundGeometry = new THREE.BoxGeometry(12,0.3,1);
var groundMaterial = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );
var ground = new THREE.Mesh( groundGeometry, groundMaterial );
scene.add( ground );
ground.position.set(0, -2, 0);
var light = new THREE.PointLight( 0x000000 );
light.position.set( 10, 0, 10 );
scene.add( light );
renderer.setClearColor( 0xEEEEEE, 1);

camera.position.z = 5;

var render = function () {
  requestAnimationFrame( render );

  // cube.rotation.x += 0.02;
	// cube.rotation.y += 0.0225;
	// cube.rotation.z += 0.0175;


  window.addEventListener("keydown", function(event){
    if (event.keyCode === 39){
      chara.position.x += 0.0019
      console.log(chara.position.x)
      if(chara.position.x >= 5.272000000000166){
        chara.position.x = 5.272000000000166;
      }
    }else if (event.keyCode === 37){
      chara.position.x += -0.0019
      console.log(chara.position.x)
      if(chara.position.x <= -4.795999999999992){
        chara.position.x = -4.795999999999992;
      }
    }
})

	var dtime	= Date.now()
	// cube.scale.x	= 1.0 + 0.3*Math.sin(dtime/300);
	// cube.scale.y	= 1.0 + 0.3*Math.sin(dtime/300);
	// cube.scale.z	= 1.0 + 0.3*Math.sin(dtime/300);
  cube.position.y = -0.4 + 1*Math.sin(dtime/300);
  renderer.render(scene, camera);
};

render();
