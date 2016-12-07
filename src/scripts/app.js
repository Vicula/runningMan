
import {handleWindowResize} from './utilities.js'

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 75, SCREEN_WIDTH/SCREEN_HEIGHT, 0.1, 1000 );

var ambient = new THREE.AmbientLight( 0x444444 );
scene.add( ambient );


var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

document.body.appendChild( renderer.domElement );



// var geometry = new THREE.BoxGeometry( 1, 1, 2 );
// var material = new THREE.MeshBasicMaterial( { color: 0xBFBFBF } );
// var cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

var charGeometry = new THREE.BoxGeometry(.6, .9, 0.2);
var charMaterial = new THREE.MeshPhongMaterial({ color: 0xC0C0C0 })
var chara = new THREE.Mesh(charGeometry, charMaterial);
scene.add(chara);

chara.castShadow = true;
// chara.receiveShadow = true;
var startingXPos = -2.5

var charXPosition = {
  currentX : startingXPos,
  nextX:startingXPos
}
chara.position.set(charXPosition.currentX, -2.3, 0.2);

var jumpRange = {
  upperBound: 1000,
  lowerBound: 0,
  currentPos: 0,
  isJumping: false
}
var movement = {
  walking: false,
  keysUp: false,
  keysDown: false,
  keysLeft: false,
  keysRight: false
}

var groundGeometry = new THREE.BoxGeometry(12,0.3,1);
var groundMaterial = new THREE.MeshLambertMaterial( { color: 0xFFFFFF } );
var ground = new THREE.Mesh( groundGeometry, groundMaterial );
ground.castShadow = false;
ground.receiveShadow = true;
scene.add( ground );
ground.position.set(0, -2.9, 0);

var SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 1024;
var light = new THREE.SpotLight( 0xFFFFFF, 1, 0, Math.PI / 2 );
// var light = new THREE.SpotLight( 0xAAAAAA );
light.position.set( 4, 2, 10 );
light.target.position.set( chara.position );

light.castShadow = true;

light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 0.1, 1000 ) );
light.shadow.bias = 0.0001;
light.shadow.mapSize.width = SHADOW_MAP_WIDTH;
light.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

scene.add( light );
renderer.setClearColor( 0xEEEEEE, 1);

camera.position.z = 5;

let minY = -2.3,
    prevY = minY,
    maxFound = false,
    minFound = false,
    maxY

















var render = function () {
  requestAnimationFrame( render );

  // cube.rotation.x += 0.02;
	// cube.rotation.y += 0.0225;
	// cube.rotation.z += 0.0175;

  let thaX = charXPosition.nextX


  window.addEventListener("keydown", function(event){
    if (event.keyCode === 39){
        charXPosition.nextX += .1
        movement.walking = true
        movement.keysRight = true
      // console.log(chara.position.x)
      if(chara.position.x >= 4.8){
        charXPosition.nextX = 4.8
      }
    }else if (event.keyCode === 37){
      charXPosition.nextX += -.1
      movement.walking = true
      movement.keysLeft = true
      // console.log(chara.position.x)
      if(chara.position.x <= -4.795999999999992){
        charXPosition.nextX= -4.795999999999992;
      }
    } else if (event.keyCode === 38){
      // console.log(chara.position.y )
      // chara.position.y = -0.4 + 1*Math.sin(dtime/1000);
      // console.log(chara.position.y)
      jumpRange.isJumping = true
      movement.walking = true
      movement.keysUp = true
    }
})

window.addEventListener('keyup', function(e){

  switch (e.keyCode) {
    case 39:
      movement.keysRight = false
      break;
    case 37:
      movement.keysLeft = false
      break;
    case 38:
      movement.keysUp = false
      break;
    case 40:
      movement.keysDown = false
      break;
    default:
      //no-op
      break;
  }


  if(!movement.keysDown && !movement.keysLeft &&
     !movement.keysUp && !movement.keysRight){
    movement.walking = false
  }

})

	if(jumpRange.isJumping){

    jumpRange.currentPos++

    let charaPositionYCalc = minY + 2.5*Math.sin(jumpRange.currentPos/10)


    if(typeof maxY !== 'number') maxY = charaPositionYCalc
      else maxY = chara.position.y > maxY ? charaPositionYCalc : maxY

    if(typeof minY !== 'number') minY = charaPositionYCalc
      else minY = chara.position.y < minY ?  charaPositionYCalc : minY


    if(charaPositionYCalc > maxY && charaPositionYCalc > prevY || prevY === maxY  ){
      maxY = Math.max(prevY, charaPositionYCalc)
      // console.log('oh myh god make it stop', maxY, prevY)
    }

    if(charaPositionYCalc <= minY ){
      chara.position.y = minY
      jumpRange.isJumping = false
      jumpRange.currentPos = 0
    } else {
      chara.position.y = charaPositionYCalc
    }

    prevY = chara.position.y
  }

  if(!movement.walking){
    charXPosition.nextX = chara.position.x

  } else {
    if(chara.position.x  < charXPosition.nextX){
      chara.position.x += .1
      if(chara.position.x >= 4.8){
        chara.position.x = 4.8
      }
    }

    if(chara.position.x  > charXPosition.nextX){
      chara.position.x -= .1
      if(chara.position.x <= -4.8){
        chara.position.x = -4.8
      }
    }
  }



  renderer.render(scene, camera);
};

render();
var daResize = function(){
  handleWindowResize(camera, renderer)
}

window.addEventListener('resize', daResize )
