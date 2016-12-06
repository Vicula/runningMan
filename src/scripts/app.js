var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 1, 2 );
var material = new THREE.MeshBasicMaterial( { color: 0xBFBFBF } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

var charGeometry = new THREE.BoxGeometry(.6, .9, 0.2);
var charMaterial = new THREE.MeshBasicMaterial({ color: 0xA0A0A0 })
var chara = new THREE.Mesh(charGeometry, charMaterial);
scene.add(chara);
var startingXPos = -2.5

var charXPosition = {
  currentX : startingXPos,
  nextX:startingXPos
}
chara.position.set(charXPosition.currentX, -1.2, 0.7);

var jumpRange = {
  upperBound: 1000,
  lowerBound: 0,
  currentPos: 0,
  isJumping: false
}


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

let minY = -1.2,
    prevY = minY,
    maxFound = false,
    minFound = false,
    maxY


var render = function () {
  requestAnimationFrame( render );

  // cube.rotation.x += 0.02;
	// cube.rotation.y += 0.0225;
	// cube.rotation.z += 0.0175;


  window.addEventListener("keydown", function(event){
    if (event.keyCode === 39){
        charXPosition.nextX += .0013
      // console.log(chara.position.x)
      if(chara.position.x >= 4.9){
        charXPosition.nextX = 4.9
      }
    }else if (event.keyCode === 37){
      charXPosition.nextX += -0.0013
      // console.log(chara.position.x)
      if(chara.position.x <= -4.795999999999992){
        charXPosition.nextX= -4.795999999999992;
      }
    } else if (event.keyCode === 38){
      // console.log(chara.position.y )
      // chara.position.y = -0.4 + 1*Math.sin(dtime/1000);
      // console.log(chara.position.y)
      jumpRange.isJumping = true
    }
})

	if(jumpRange.isJumping){

    jumpRange.currentPos++

    let charaPositionYCalc = minY + 1*Math.sin(jumpRange.currentPos/10)


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


  if(chara.position.x  < charXPosition.nextX){
    chara.position.x += .01
  }

  if(chara.position.x  > charXPosition.nextX){
    chara.position.x -= .01
  }



  renderer.render(scene, camera);
};

render();
