// import {SCREEN_WIDTH,SCREEN_HEIGHT,camera,renderer} from './app.js'


var handleWindowResize = function(cam, rendrr){
  let camera_ = cam;
  let renderer_ = rendrr

  let newWidth = window.innerWidth,
      newHeight = window.innerHeight;

  camera_.aspect = newWidth / newHeight;
  camera_.updateProjectionMatrix();
  renderer_.setSize( newWidth, newHeight );


}


module.exports = {
  handleWindowResize
}
