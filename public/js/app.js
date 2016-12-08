(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = function (THREE) {

  /**
   * @author mrdoob / http://mrdoob.com/
   */
  THREE.OBJLoader = function (manager) {

    this.manager = manager !== undefined ? manager : THREE.DefaultLoadingManager;
  };

  THREE.OBJLoader.prototype = {

    constructor: THREE.OBJLoader,

    load: function load(url, onLoad, onProgress, onError) {

      var scope = this;

      var loader = new THREE.XHRLoader(scope.manager);
      loader.load(url, function (text) {

        onLoad(scope.parse(text));
      }, onProgress, onError);
    },

    parse: function parse(text) {

      console.time('OBJLoader');

      var object,
          objects = [];
      var geometry, material;

      function parseVertexIndex(value) {

        var index = parseInt(value);

        return (index >= 0 ? index - 1 : index + vertices.length / 3) * 3;
      }

      function parseNormalIndex(value) {

        var index = parseInt(value);

        return (index >= 0 ? index - 1 : index + normals.length / 3) * 3;
      }

      function parseUVIndex(value) {

        var index = parseInt(value);

        return (index >= 0 ? index - 1 : index + uvs.length / 2) * 2;
      }

      function addVertex(a, b, c) {

        geometry.vertices.push(vertices[a], vertices[a + 1], vertices[a + 2], vertices[b], vertices[b + 1], vertices[b + 2], vertices[c], vertices[c + 1], vertices[c + 2]);
      }

      function addNormal(a, b, c) {

        geometry.normals.push(normals[a], normals[a + 1], normals[a + 2], normals[b], normals[b + 1], normals[b + 2], normals[c], normals[c + 1], normals[c + 2]);
      }

      function addUV(a, b, c) {

        geometry.uvs.push(uvs[a], uvs[a + 1], uvs[b], uvs[b + 1], uvs[c], uvs[c + 1]);
      }

      function addFace(a, b, c, d, ua, ub, uc, ud, na, nb, nc, nd) {

        var ia = parseVertexIndex(a);
        var ib = parseVertexIndex(b);
        var ic = parseVertexIndex(c);
        var id;

        if (d === undefined) {

          addVertex(ia, ib, ic);
        } else {

          id = parseVertexIndex(d);

          addVertex(ia, ib, id);
          addVertex(ib, ic, id);
        }

        if (ua !== undefined) {

          ia = parseUVIndex(ua);
          ib = parseUVIndex(ub);
          ic = parseUVIndex(uc);

          if (d === undefined) {

            addUV(ia, ib, ic);
          } else {

            id = parseUVIndex(ud);

            addUV(ia, ib, id);
            addUV(ib, ic, id);
          }
        }

        if (na !== undefined) {

          ia = parseNormalIndex(na);
          ib = parseNormalIndex(nb);
          ic = parseNormalIndex(nc);

          if (d === undefined) {

            addNormal(ia, ib, ic);
          } else {

            id = parseNormalIndex(nd);

            addNormal(ia, ib, id);
            addNormal(ib, ic, id);
          }
        }
      }

      // create mesh if no objects in text

      if (/^o /gm.test(text) === false) {

        geometry = {
          vertices: [],
          normals: [],
          uvs: []
        };

        material = {
          name: ''
        };

        object = {
          name: '',
          geometry: geometry,
          material: material
        };

        objects.push(object);
      }

      var vertices = [];
      var normals = [];
      var uvs = [];

      // v float float float

      var vertex_pattern = /v( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;

      // vn float float float

      var normal_pattern = /vn( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;

      // vt float float

      var uv_pattern = /vt( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;

      // f vertex vertex vertex ...

      var face_pattern1 = /f( +-?\d+)( +-?\d+)( +-?\d+)( +-?\d+)?/;

      // f vertex/uv vertex/uv vertex/uv ...

      var face_pattern2 = /f( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))?/;

      // f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...

      var face_pattern3 = /f( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))?/;

      // f vertex//normal vertex//normal vertex//normal ...

      var face_pattern4 = /f( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))?/;

      //

      var lines = text.split('\n');

      for (var i = 0; i < lines.length; i++) {

        var line = lines[i];
        line = line.trim();

        var result;

        if (line.length === 0 || line.charAt(0) === '#') {

          continue;
        } else if ((result = vertex_pattern.exec(line)) !== null) {

          // ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

          vertices.push(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]));
        } else if ((result = normal_pattern.exec(line)) !== null) {

          // ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

          normals.push(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]));
        } else if ((result = uv_pattern.exec(line)) !== null) {

          // ["vt 0.1 0.2", "0.1", "0.2"]

          uvs.push(parseFloat(result[1]), parseFloat(result[2]));
        } else if ((result = face_pattern1.exec(line)) !== null) {

          // ["f 1 2 3", "1", "2", "3", undefined]

          addFace(result[1], result[2], result[3], result[4]);
        } else if ((result = face_pattern2.exec(line)) !== null) {

          // ["f 1/1 2/2 3/3", " 1/1", "1", "1", " 2/2", "2", "2", " 3/3", "3", "3", undefined, undefined, undefined]

          addFace(result[2], result[5], result[8], result[11], result[3], result[6], result[9], result[12]);
        } else if ((result = face_pattern3.exec(line)) !== null) {

          // ["f 1/1/1 2/2/2 3/3/3", " 1/1/1", "1", "1", "1", " 2/2/2", "2", "2", "2", " 3/3/3", "3", "3", "3", undefined, undefined, undefined, undefined]

          addFace(result[2], result[6], result[10], result[14], result[3], result[7], result[11], result[15], result[4], result[8], result[12], result[16]);
        } else if ((result = face_pattern4.exec(line)) !== null) {

          // ["f 1//1 2//2 3//3", " 1//1", "1", "1", " 2//2", "2", "2", " 3//3", "3", "3", undefined, undefined, undefined]

          addFace(result[2], result[5], result[8], result[11], undefined, undefined, undefined, undefined, result[3], result[6], result[9], result[12]);
        } else if (/^o /.test(line)) {

          geometry = {
            vertices: [],
            normals: [],
            uvs: []
          };

          material = {
            name: ''
          };

          object = {
            name: line.substring(2).trim(),
            geometry: geometry,
            material: material
          };

          objects.push(object);
        } else if (/^g /.test(line)) {

          // group

        } else if (/^usemtl /.test(line)) {

            // material

            material.name = line.substring(7).trim();
          } else if (/^mtllib /.test(line)) {

            // mtl file

          } else if (/^s /.test(line)) {

              // smooth shading

            } else {

                // console.log( "THREE.OBJLoader: Unhandled line " + line );

              }
      }

      var container = new THREE.Object3D();
      var l;

      for (i = 0, l = objects.length; i < l; i++) {

        object = objects[i];
        geometry = object.geometry;

        var buffergeometry = new THREE.BufferGeometry();

        buffergeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(geometry.vertices), 3));

        if (geometry.normals.length > 0) {

          buffergeometry.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(geometry.normals), 3));
        }

        if (geometry.uvs.length > 0) {

          buffergeometry.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(geometry.uvs), 2));
        }

        material = new THREE.MeshLambertMaterial({
          color: 0xff0000
        });
        material.name = object.material.name;

        var mesh = new THREE.Mesh(buffergeometry, material);
        mesh.name = object.name;

        container.add(mesh);
      }

      console.timeEnd('OBJLoader');

      return container;
    }

  };
};
},{}],2:[function(require,module,exports){
'use strict';

var _utilities = require('./utilities.js');

var OBJLoader = require('three-obj-loader');

OBJLoader(THREE);

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, SCREEN_WIDTH / SCREEN_HEIGHT, 0.1, 1000);

var ambient = new THREE.AmbientLight(0x444444);
scene.add(ambient);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

document.body.appendChild(renderer.domElement);

// var geometry = new THREE.BoxGeometry( 1, 1, 2 );
// var material = new THREE.MeshBasicMaterial( { color: 0xBFBFBF } );
// var cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

var charGeometry = new THREE.ConeGeometry(.2, .7, 50, 1, false, 10, 2 * 3.14);
var charMaterial = new THREE.MeshLambertMaterial({ color: 0x6a6a6a });
var chara = new THREE.Mesh(charGeometry, charMaterial);
scene.add(chara);

chara.castShadow = true;
// chara.receiveShadow = true;
var startingXPos = -1.2;

var charXPosition = {
  currentX: startingXPos,
  nextX: startingXPos
};
chara.position.set(charXPosition.currentX, -2.3, 0.2);

var jumpRange = {
  upperBound: 1000,
  lowerBound: 0,
  currentPos: 0,
  isJumping: false
};
var movement = {
  walking: false,
  keysUp: false,
  keysDown: false,
  keysLeft: false,
  keysRight: false
};

var groundGeometry = new THREE.BoxGeometry(12, 0.3, 1);
var groundMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
var ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.castShadow = false;
ground.receiveShadow = true;
scene.add(ground);
ground.position.set(0, -2.9, 0);

var SHADOW_MAP_WIDTH = 2048,
    SHADOW_MAP_HEIGHT = 1024;
var light = new THREE.SpotLight(0xFFFFFF, 1, 0, Math.PI / 2);
// var light = new THREE.SpotLight( 0xAAAAAA );
light.position.set(5, 3, 10);
light.target.position.set(chara.position);

light.castShadow = true;

light.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(50, 1, 0.1, 1000));
light.shadow.bias = 0.0001;
light.shadow.mapSize.width = SHADOW_MAP_WIDTH;
light.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

scene.add(light);
renderer.setClearColor(0xEEEEEE, 1);

camera.position.z = 5;

var minY = -2.3,
    prevY = minY,
    maxFound = false,
    minFound = false,
    maxY = void 0;

//
// var geometry = new THREE.ConeGeometry( .2, .7, 50, 1,false,10,2*3.14 );
// var material = new THREE.MeshLambertMaterial( { color: 0x6a6a6a } );
// var cone = new THREE.Mesh( geometry, material );
// scene.add( cone );
// cone.position.set(-1.2, -2.3, 0.2);
// cone.castShadow = true;


var headGeometry = new THREE.ConeGeometry(.15, .5, 3, 1, false, 10, 2 * 3.14);
var headMaterial = new THREE.MeshLambertMaterial({ color: 0x6a6a6a });
var head = new THREE.Mesh(headGeometry, headMaterial);
scene.add(head);
head.position.set(-1.01, -2.15, 0.22);
head.rotation.x = 1.9;
head.rotation.y = 2.8;
head.rotation.z = 1.3;

var daTexture2 = new THREE.MeshPhongMaterial({ specular: 0x6a6a6a, shading: THREE.FlatShading, vertexColors: THREE.VertexColors });
var daTexture = new THREE.Texture();

var manager = new THREE.LoadingManager();
manager.onProgress = function (item, loaded, total) {
  console.log(item, loaded, total);
};

var deer;
//
// var loader = new THREE.JSONLoader(manager);
// loader.load('../images/deer.json', function(obj, mat){
//
//   var objMats = new THREE.MultiMaterial( mat );
//   var object = new THREE.Mesh( obj, objMats );
//
//
//
//   console.log(object)
//   // object.material.visible = true;
// 	scene.add( object );
//
// })

var loader = new THREE.OBJLoader(manager);
loader.load('../images/Deer.obj', function (object) {
  object.traverse(function (child) {

    if (child instanceof THREE.Mesh) {
      child.material.map = daTexture;
      // child.material.map = daTexture2
      child.material.color.r = 60;
      child.material.color.g = 60;
      child.material.color.b = 60;

      // console.log(child.material)
      // console.log(chara)
    }
  });
  console.log(object);
  object.scale.x = .003;
  object.scale.y = .003;
  object.scale.z = .003;
  object.castShadow = true;
  object.position.set(-4, -2.75, 0.2);
  object.rotation.y = 1.6;
  deer = object;
  scene.add(object);
});

var render = function render() {
  requestAnimationFrame(render);

  // head.rotation.x += 0.02;
  // head.rotation.y += 0.0225;
  // head.rotation.z += 0.0175;
  // deer.rotation.y += 0.02

  var thaX = charXPosition.nextX;

  window.addEventListener("keydown", function (event) {
    if (event.keyCode === 39) {
      charXPosition.nextX += .1;
      movement.walking = true;
      movement.keysRight = true;
      // console.log(chara.position.x)
      if (chara.position.x >= 4.8) {
        charXPosition.nextX = 4.8;
      }
    } else if (event.keyCode === 37) {
      charXPosition.nextX += -.1;
      movement.walking = true;
      movement.keysLeft = true;
      // console.log(chara.position.x)
      if (chara.position.x <= -4.795999999999992) {
        charXPosition.nextX = -4.795999999999992;
      }
    } else if (event.keyCode === 38) {
      // console.log(chara.position.y )
      // chara.position.y = -0.4 + 1*Math.sin(dtime/1000);
      // console.log(chara.position.y)
      jumpRange.isJumping = true;
      movement.walking = true;
      movement.keysUp = true;
    }
  });

  window.addEventListener('keyup', function (e) {

    switch (e.keyCode) {
      case 39:
        movement.keysRight = false;
        break;
      case 37:
        movement.keysLeft = false;
        break;
      case 38:
        movement.keysUp = false;
        break;
      case 40:
        movement.keysDown = false;
        break;
      default:
        //no-op
        break;
    }

    if (!movement.keysDown && !movement.keysLeft && !movement.keysUp && !movement.keysRight) {
      movement.walking = false;
    }
  });

  if (jumpRange.isJumping) {

    jumpRange.currentPos++;

    var charaPositionYCalc = minY + 2.5 * Math.sin(jumpRange.currentPos / 10);

    if (typeof maxY !== 'number') maxY = charaPositionYCalc;else maxY = chara.position.y > maxY ? charaPositionYCalc : maxY;

    if (typeof minY !== 'number') minY = charaPositionYCalc;else minY = chara.position.y < minY ? charaPositionYCalc : minY;

    if (charaPositionYCalc > maxY && charaPositionYCalc > prevY || prevY === maxY) {
      maxY = Math.max(prevY, charaPositionYCalc);
      // console.log('oh myh god make it stop', maxY, prevY)
    }

    if (charaPositionYCalc <= minY) {
      chara.position.y = minY;
      jumpRange.isJumping = false;
      jumpRange.currentPos = 0;
    } else {
      chara.position.y = charaPositionYCalc;
    }

    prevY = chara.position.y;
  }

  if (!movement.walking) {
    charXPosition.nextX = chara.position.x;
  } else {
    if (chara.position.x < charXPosition.nextX) {
      // chara.position.x += .1
      // head.position.x +=.1
      // if(chara.position.x >= 4.8){
      //   chara.position.x = 4.8
      // }
      if (chara.position.x >= 4.8) {} else {
        chara.position.x += .1;
        head.position.x += .1;
      }
    }

    if (chara.position.x > charXPosition.nextX) {
      // chara.position.x -= .1
      //   head.position.x -=.1
      // if(chara.position.x <= -4.8){
      //   chara.position.x = -4.8
      // }
      if (chara.position.x <= -4.8) {} else {
        chara.position.x -= .1;
        head.position.x -= .1;
      }
    }
  }

  renderer.render(scene, camera);
};

render();
var daResize = function daResize() {
  (0, _utilities.handleWindowResize)(camera, renderer);
};

window.addEventListener('resize', daResize);

},{"./utilities.js":3,"three-obj-loader":1}],3:[function(require,module,exports){
"use strict";

// import {SCREEN_WIDTH,SCREEN_HEIGHT,camera,renderer} from './app.js'


var handleWindowResize = function handleWindowResize(cam, rendrr) {
  var camera_ = cam;
  var renderer_ = rendrr;

  var newWidth = window.innerWidth,
      newHeight = window.innerHeight;

  camera_.aspect = newWidth / newHeight;
  camera_.updateProjectionMatrix();
  renderer_.setSize(newWidth, newHeight);
};

module.exports = {
  handleWindowResize: handleWindowResize
};

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvdGhyZWUtb2JqLWxvYWRlci9kaXN0L2luZGV4LmpzIiwic3JjL3NjcmlwdHMvYXBwLmpzIiwic3JjL3NjcmlwdHMvdXRpbGl0aWVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN2VEE7O0FBQ0EsSUFBTSxZQUFZLFFBQWxCLEFBQWtCLEFBQVE7O0FBRTFC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SUE7QUFDQSxJQUFJLFdBQVcsU0FBWCxBQUFXLFdBQVUsQUFDdkI7cUNBQUEsQUFBbUIsUUFBbkIsQUFBMkIsQUFDNUI7QUFGRDs7QUFJQSxPQUFBLEFBQU8saUJBQVAsQUFBd0IsVUFBeEIsQUFBa0M7Ozs7O0FDdFRsQzs7O0FBR0EsSUFBSSxxQkFBcUIsU0FBckIsQUFBcUIsbUJBQUEsQUFBUyxLQUFULEFBQWMsUUFBTyxBQUM1QztNQUFJLFVBQUosQUFBYyxBQUNkO01BQUksWUFBSixBQUFnQixBQUVoQjs7TUFBSSxXQUFXLE9BQWYsQUFBc0I7TUFDbEIsWUFBWSxPQURoQixBQUN1QixBQUV2Qjs7VUFBQSxBQUFRLFNBQVMsV0FBakIsQUFBNEIsQUFDNUI7VUFBQSxBQUFRLEFBQ1I7WUFBQSxBQUFVLFFBQVYsQUFBbUIsVUFBbkIsQUFBNkIsQUFHOUI7QUFaRDs7QUFlQSxPQUFBLEFBQU87c0JBQVAsQUFBaUI7QUFBQSxBQUNmIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoVEhSRUUpIHtcblxuICAvKipcbiAgICogQGF1dGhvciBtcmRvb2IgLyBodHRwOi8vbXJkb29iLmNvbS9cbiAgICovXG4gIFRIUkVFLk9CSkxvYWRlciA9IGZ1bmN0aW9uIChtYW5hZ2VyKSB7XG5cbiAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyICE9PSB1bmRlZmluZWQgPyBtYW5hZ2VyIDogVEhSRUUuRGVmYXVsdExvYWRpbmdNYW5hZ2VyO1xuICB9O1xuXG4gIFRIUkVFLk9CSkxvYWRlci5wcm90b3R5cGUgPSB7XG5cbiAgICBjb25zdHJ1Y3RvcjogVEhSRUUuT0JKTG9hZGVyLFxuXG4gICAgbG9hZDogZnVuY3Rpb24gbG9hZCh1cmwsIG9uTG9hZCwgb25Qcm9ncmVzcywgb25FcnJvcikge1xuXG4gICAgICB2YXIgc2NvcGUgPSB0aGlzO1xuXG4gICAgICB2YXIgbG9hZGVyID0gbmV3IFRIUkVFLlhIUkxvYWRlcihzY29wZS5tYW5hZ2VyKTtcbiAgICAgIGxvYWRlci5sb2FkKHVybCwgZnVuY3Rpb24gKHRleHQpIHtcblxuICAgICAgICBvbkxvYWQoc2NvcGUucGFyc2UodGV4dCkpO1xuICAgICAgfSwgb25Qcm9ncmVzcywgb25FcnJvcik7XG4gICAgfSxcblxuICAgIHBhcnNlOiBmdW5jdGlvbiBwYXJzZSh0ZXh0KSB7XG5cbiAgICAgIGNvbnNvbGUudGltZSgnT0JKTG9hZGVyJyk7XG5cbiAgICAgIHZhciBvYmplY3QsXG4gICAgICAgICAgb2JqZWN0cyA9IFtdO1xuICAgICAgdmFyIGdlb21ldHJ5LCBtYXRlcmlhbDtcblxuICAgICAgZnVuY3Rpb24gcGFyc2VWZXJ0ZXhJbmRleCh2YWx1ZSkge1xuXG4gICAgICAgIHZhciBpbmRleCA9IHBhcnNlSW50KHZhbHVlKTtcblxuICAgICAgICByZXR1cm4gKGluZGV4ID49IDAgPyBpbmRleCAtIDEgOiBpbmRleCArIHZlcnRpY2VzLmxlbmd0aCAvIDMpICogMztcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gcGFyc2VOb3JtYWxJbmRleCh2YWx1ZSkge1xuXG4gICAgICAgIHZhciBpbmRleCA9IHBhcnNlSW50KHZhbHVlKTtcblxuICAgICAgICByZXR1cm4gKGluZGV4ID49IDAgPyBpbmRleCAtIDEgOiBpbmRleCArIG5vcm1hbHMubGVuZ3RoIC8gMykgKiAzO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBwYXJzZVVWSW5kZXgodmFsdWUpIHtcblxuICAgICAgICB2YXIgaW5kZXggPSBwYXJzZUludCh2YWx1ZSk7XG5cbiAgICAgICAgcmV0dXJuIChpbmRleCA+PSAwID8gaW5kZXggLSAxIDogaW5kZXggKyB1dnMubGVuZ3RoIC8gMikgKiAyO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBhZGRWZXJ0ZXgoYSwgYiwgYykge1xuXG4gICAgICAgIGdlb21ldHJ5LnZlcnRpY2VzLnB1c2godmVydGljZXNbYV0sIHZlcnRpY2VzW2EgKyAxXSwgdmVydGljZXNbYSArIDJdLCB2ZXJ0aWNlc1tiXSwgdmVydGljZXNbYiArIDFdLCB2ZXJ0aWNlc1tiICsgMl0sIHZlcnRpY2VzW2NdLCB2ZXJ0aWNlc1tjICsgMV0sIHZlcnRpY2VzW2MgKyAyXSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGFkZE5vcm1hbChhLCBiLCBjKSB7XG5cbiAgICAgICAgZ2VvbWV0cnkubm9ybWFscy5wdXNoKG5vcm1hbHNbYV0sIG5vcm1hbHNbYSArIDFdLCBub3JtYWxzW2EgKyAyXSwgbm9ybWFsc1tiXSwgbm9ybWFsc1tiICsgMV0sIG5vcm1hbHNbYiArIDJdLCBub3JtYWxzW2NdLCBub3JtYWxzW2MgKyAxXSwgbm9ybWFsc1tjICsgMl0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBhZGRVVihhLCBiLCBjKSB7XG5cbiAgICAgICAgZ2VvbWV0cnkudXZzLnB1c2godXZzW2FdLCB1dnNbYSArIDFdLCB1dnNbYl0sIHV2c1tiICsgMV0sIHV2c1tjXSwgdXZzW2MgKyAxXSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGFkZEZhY2UoYSwgYiwgYywgZCwgdWEsIHViLCB1YywgdWQsIG5hLCBuYiwgbmMsIG5kKSB7XG5cbiAgICAgICAgdmFyIGlhID0gcGFyc2VWZXJ0ZXhJbmRleChhKTtcbiAgICAgICAgdmFyIGliID0gcGFyc2VWZXJ0ZXhJbmRleChiKTtcbiAgICAgICAgdmFyIGljID0gcGFyc2VWZXJ0ZXhJbmRleChjKTtcbiAgICAgICAgdmFyIGlkO1xuXG4gICAgICAgIGlmIChkID09PSB1bmRlZmluZWQpIHtcblxuICAgICAgICAgIGFkZFZlcnRleChpYSwgaWIsIGljKTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgIGlkID0gcGFyc2VWZXJ0ZXhJbmRleChkKTtcblxuICAgICAgICAgIGFkZFZlcnRleChpYSwgaWIsIGlkKTtcbiAgICAgICAgICBhZGRWZXJ0ZXgoaWIsIGljLCBpZCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodWEgIT09IHVuZGVmaW5lZCkge1xuXG4gICAgICAgICAgaWEgPSBwYXJzZVVWSW5kZXgodWEpO1xuICAgICAgICAgIGliID0gcGFyc2VVVkluZGV4KHViKTtcbiAgICAgICAgICBpYyA9IHBhcnNlVVZJbmRleCh1Yyk7XG5cbiAgICAgICAgICBpZiAoZCA9PT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgICAgICAgIGFkZFVWKGlhLCBpYiwgaWMpO1xuICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIGlkID0gcGFyc2VVVkluZGV4KHVkKTtcblxuICAgICAgICAgICAgYWRkVVYoaWEsIGliLCBpZCk7XG4gICAgICAgICAgICBhZGRVVihpYiwgaWMsIGlkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmEgIT09IHVuZGVmaW5lZCkge1xuXG4gICAgICAgICAgaWEgPSBwYXJzZU5vcm1hbEluZGV4KG5hKTtcbiAgICAgICAgICBpYiA9IHBhcnNlTm9ybWFsSW5kZXgobmIpO1xuICAgICAgICAgIGljID0gcGFyc2VOb3JtYWxJbmRleChuYyk7XG5cbiAgICAgICAgICBpZiAoZCA9PT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgICAgICAgIGFkZE5vcm1hbChpYSwgaWIsIGljKTtcbiAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICBpZCA9IHBhcnNlTm9ybWFsSW5kZXgobmQpO1xuXG4gICAgICAgICAgICBhZGROb3JtYWwoaWEsIGliLCBpZCk7XG4gICAgICAgICAgICBhZGROb3JtYWwoaWIsIGljLCBpZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGNyZWF0ZSBtZXNoIGlmIG5vIG9iamVjdHMgaW4gdGV4dFxuXG4gICAgICBpZiAoL15vIC9nbS50ZXN0KHRleHQpID09PSBmYWxzZSkge1xuXG4gICAgICAgIGdlb21ldHJ5ID0ge1xuICAgICAgICAgIHZlcnRpY2VzOiBbXSxcbiAgICAgICAgICBub3JtYWxzOiBbXSxcbiAgICAgICAgICB1dnM6IFtdXG4gICAgICAgIH07XG5cbiAgICAgICAgbWF0ZXJpYWwgPSB7XG4gICAgICAgICAgbmFtZTogJydcbiAgICAgICAgfTtcblxuICAgICAgICBvYmplY3QgPSB7XG4gICAgICAgICAgbmFtZTogJycsXG4gICAgICAgICAgZ2VvbWV0cnk6IGdlb21ldHJ5LFxuICAgICAgICAgIG1hdGVyaWFsOiBtYXRlcmlhbFxuICAgICAgICB9O1xuXG4gICAgICAgIG9iamVjdHMucHVzaChvYmplY3QpO1xuICAgICAgfVxuXG4gICAgICB2YXIgdmVydGljZXMgPSBbXTtcbiAgICAgIHZhciBub3JtYWxzID0gW107XG4gICAgICB2YXIgdXZzID0gW107XG5cbiAgICAgIC8vIHYgZmxvYXQgZmxvYXQgZmxvYXRcblxuICAgICAgdmFyIHZlcnRleF9wYXR0ZXJuID0gL3YoICtbXFxkfFxcLnxcXCt8XFwtfGV8RV0rKSggK1tcXGR8XFwufFxcK3xcXC18ZXxFXSspKCArW1xcZHxcXC58XFwrfFxcLXxlfEVdKykvO1xuXG4gICAgICAvLyB2biBmbG9hdCBmbG9hdCBmbG9hdFxuXG4gICAgICB2YXIgbm9ybWFsX3BhdHRlcm4gPSAvdm4oICtbXFxkfFxcLnxcXCt8XFwtfGV8RV0rKSggK1tcXGR8XFwufFxcK3xcXC18ZXxFXSspKCArW1xcZHxcXC58XFwrfFxcLXxlfEVdKykvO1xuXG4gICAgICAvLyB2dCBmbG9hdCBmbG9hdFxuXG4gICAgICB2YXIgdXZfcGF0dGVybiA9IC92dCggK1tcXGR8XFwufFxcK3xcXC18ZXxFXSspKCArW1xcZHxcXC58XFwrfFxcLXxlfEVdKykvO1xuXG4gICAgICAvLyBmIHZlcnRleCB2ZXJ0ZXggdmVydGV4IC4uLlxuXG4gICAgICB2YXIgZmFjZV9wYXR0ZXJuMSA9IC9mKCArLT9cXGQrKSggKy0/XFxkKykoICstP1xcZCspKCArLT9cXGQrKT8vO1xuXG4gICAgICAvLyBmIHZlcnRleC91diB2ZXJ0ZXgvdXYgdmVydGV4L3V2IC4uLlxuXG4gICAgICB2YXIgZmFjZV9wYXR0ZXJuMiA9IC9mKCArKC0/XFxkKylcXC8oLT9cXGQrKSkoICsoLT9cXGQrKVxcLygtP1xcZCspKSggKygtP1xcZCspXFwvKC0/XFxkKykpKCArKC0/XFxkKylcXC8oLT9cXGQrKSk/LztcblxuICAgICAgLy8gZiB2ZXJ0ZXgvdXYvbm9ybWFsIHZlcnRleC91di9ub3JtYWwgdmVydGV4L3V2L25vcm1hbCAuLi5cblxuICAgICAgdmFyIGZhY2VfcGF0dGVybjMgPSAvZiggKygtP1xcZCspXFwvKC0/XFxkKylcXC8oLT9cXGQrKSkoICsoLT9cXGQrKVxcLygtP1xcZCspXFwvKC0/XFxkKykpKCArKC0/XFxkKylcXC8oLT9cXGQrKVxcLygtP1xcZCspKSggKygtP1xcZCspXFwvKC0/XFxkKylcXC8oLT9cXGQrKSk/LztcblxuICAgICAgLy8gZiB2ZXJ0ZXgvL25vcm1hbCB2ZXJ0ZXgvL25vcm1hbCB2ZXJ0ZXgvL25vcm1hbCAuLi5cblxuICAgICAgdmFyIGZhY2VfcGF0dGVybjQgPSAvZiggKygtP1xcZCspXFwvXFwvKC0/XFxkKykpKCArKC0/XFxkKylcXC9cXC8oLT9cXGQrKSkoICsoLT9cXGQrKVxcL1xcLygtP1xcZCspKSggKygtP1xcZCspXFwvXFwvKC0/XFxkKykpPy87XG5cbiAgICAgIC8vXG5cbiAgICAgIHZhciBsaW5lcyA9IHRleHQuc3BsaXQoJ1xcbicpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgdmFyIGxpbmUgPSBsaW5lc1tpXTtcbiAgICAgICAgbGluZSA9IGxpbmUudHJpbSgpO1xuXG4gICAgICAgIHZhciByZXN1bHQ7XG5cbiAgICAgICAgaWYgKGxpbmUubGVuZ3RoID09PSAwIHx8IGxpbmUuY2hhckF0KDApID09PSAnIycpIHtcblxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IGVsc2UgaWYgKChyZXN1bHQgPSB2ZXJ0ZXhfcGF0dGVybi5leGVjKGxpbmUpKSAhPT0gbnVsbCkge1xuXG4gICAgICAgICAgLy8gW1widiAxLjAgMi4wIDMuMFwiLCBcIjEuMFwiLCBcIjIuMFwiLCBcIjMuMFwiXVxuXG4gICAgICAgICAgdmVydGljZXMucHVzaChwYXJzZUZsb2F0KHJlc3VsdFsxXSksIHBhcnNlRmxvYXQocmVzdWx0WzJdKSwgcGFyc2VGbG9hdChyZXN1bHRbM10pKTtcbiAgICAgICAgfSBlbHNlIGlmICgocmVzdWx0ID0gbm9ybWFsX3BhdHRlcm4uZXhlYyhsaW5lKSkgIT09IG51bGwpIHtcblxuICAgICAgICAgIC8vIFtcInZuIDEuMCAyLjAgMy4wXCIsIFwiMS4wXCIsIFwiMi4wXCIsIFwiMy4wXCJdXG5cbiAgICAgICAgICBub3JtYWxzLnB1c2gocGFyc2VGbG9hdChyZXN1bHRbMV0pLCBwYXJzZUZsb2F0KHJlc3VsdFsyXSksIHBhcnNlRmxvYXQocmVzdWx0WzNdKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoKHJlc3VsdCA9IHV2X3BhdHRlcm4uZXhlYyhsaW5lKSkgIT09IG51bGwpIHtcblxuICAgICAgICAgIC8vIFtcInZ0IDAuMSAwLjJcIiwgXCIwLjFcIiwgXCIwLjJcIl1cblxuICAgICAgICAgIHV2cy5wdXNoKHBhcnNlRmxvYXQocmVzdWx0WzFdKSwgcGFyc2VGbG9hdChyZXN1bHRbMl0pKTtcbiAgICAgICAgfSBlbHNlIGlmICgocmVzdWx0ID0gZmFjZV9wYXR0ZXJuMS5leGVjKGxpbmUpKSAhPT0gbnVsbCkge1xuXG4gICAgICAgICAgLy8gW1wiZiAxIDIgM1wiLCBcIjFcIiwgXCIyXCIsIFwiM1wiLCB1bmRlZmluZWRdXG5cbiAgICAgICAgICBhZGRGYWNlKHJlc3VsdFsxXSwgcmVzdWx0WzJdLCByZXN1bHRbM10sIHJlc3VsdFs0XSk7XG4gICAgICAgIH0gZWxzZSBpZiAoKHJlc3VsdCA9IGZhY2VfcGF0dGVybjIuZXhlYyhsaW5lKSkgIT09IG51bGwpIHtcblxuICAgICAgICAgIC8vIFtcImYgMS8xIDIvMiAzLzNcIiwgXCIgMS8xXCIsIFwiMVwiLCBcIjFcIiwgXCIgMi8yXCIsIFwiMlwiLCBcIjJcIiwgXCIgMy8zXCIsIFwiM1wiLCBcIjNcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZF1cblxuICAgICAgICAgIGFkZEZhY2UocmVzdWx0WzJdLCByZXN1bHRbNV0sIHJlc3VsdFs4XSwgcmVzdWx0WzExXSwgcmVzdWx0WzNdLCByZXN1bHRbNl0sIHJlc3VsdFs5XSwgcmVzdWx0WzEyXSk7XG4gICAgICAgIH0gZWxzZSBpZiAoKHJlc3VsdCA9IGZhY2VfcGF0dGVybjMuZXhlYyhsaW5lKSkgIT09IG51bGwpIHtcblxuICAgICAgICAgIC8vIFtcImYgMS8xLzEgMi8yLzIgMy8zLzNcIiwgXCIgMS8xLzFcIiwgXCIxXCIsIFwiMVwiLCBcIjFcIiwgXCIgMi8yLzJcIiwgXCIyXCIsIFwiMlwiLCBcIjJcIiwgXCIgMy8zLzNcIiwgXCIzXCIsIFwiM1wiLCBcIjNcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkXVxuXG4gICAgICAgICAgYWRkRmFjZShyZXN1bHRbMl0sIHJlc3VsdFs2XSwgcmVzdWx0WzEwXSwgcmVzdWx0WzE0XSwgcmVzdWx0WzNdLCByZXN1bHRbN10sIHJlc3VsdFsxMV0sIHJlc3VsdFsxNV0sIHJlc3VsdFs0XSwgcmVzdWx0WzhdLCByZXN1bHRbMTJdLCByZXN1bHRbMTZdKTtcbiAgICAgICAgfSBlbHNlIGlmICgocmVzdWx0ID0gZmFjZV9wYXR0ZXJuNC5leGVjKGxpbmUpKSAhPT0gbnVsbCkge1xuXG4gICAgICAgICAgLy8gW1wiZiAxLy8xIDIvLzIgMy8vM1wiLCBcIiAxLy8xXCIsIFwiMVwiLCBcIjFcIiwgXCIgMi8vMlwiLCBcIjJcIiwgXCIyXCIsIFwiIDMvLzNcIiwgXCIzXCIsIFwiM1wiLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkXVxuXG4gICAgICAgICAgYWRkRmFjZShyZXN1bHRbMl0sIHJlc3VsdFs1XSwgcmVzdWx0WzhdLCByZXN1bHRbMTFdLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHJlc3VsdFszXSwgcmVzdWx0WzZdLCByZXN1bHRbOV0sIHJlc3VsdFsxMl0pO1xuICAgICAgICB9IGVsc2UgaWYgKC9ebyAvLnRlc3QobGluZSkpIHtcblxuICAgICAgICAgIGdlb21ldHJ5ID0ge1xuICAgICAgICAgICAgdmVydGljZXM6IFtdLFxuICAgICAgICAgICAgbm9ybWFsczogW10sXG4gICAgICAgICAgICB1dnM6IFtdXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIG1hdGVyaWFsID0ge1xuICAgICAgICAgICAgbmFtZTogJydcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgb2JqZWN0ID0ge1xuICAgICAgICAgICAgbmFtZTogbGluZS5zdWJzdHJpbmcoMikudHJpbSgpLFxuICAgICAgICAgICAgZ2VvbWV0cnk6IGdlb21ldHJ5LFxuICAgICAgICAgICAgbWF0ZXJpYWw6IG1hdGVyaWFsXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIG9iamVjdHMucHVzaChvYmplY3QpO1xuICAgICAgICB9IGVsc2UgaWYgKC9eZyAvLnRlc3QobGluZSkpIHtcblxuICAgICAgICAgIC8vIGdyb3VwXG5cbiAgICAgICAgfSBlbHNlIGlmICgvXnVzZW10bCAvLnRlc3QobGluZSkpIHtcblxuICAgICAgICAgICAgLy8gbWF0ZXJpYWxcblxuICAgICAgICAgICAgbWF0ZXJpYWwubmFtZSA9IGxpbmUuc3Vic3RyaW5nKDcpLnRyaW0oKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKC9ebXRsbGliIC8udGVzdChsaW5lKSkge1xuXG4gICAgICAgICAgICAvLyBtdGwgZmlsZVxuXG4gICAgICAgICAgfSBlbHNlIGlmICgvXnMgLy50ZXN0KGxpbmUpKSB7XG5cbiAgICAgICAgICAgICAgLy8gc21vb3RoIHNoYWRpbmdcblxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCBcIlRIUkVFLk9CSkxvYWRlcjogVW5oYW5kbGVkIGxpbmUgXCIgKyBsaW5lICk7XG5cbiAgICAgICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgY29udGFpbmVyID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XG4gICAgICB2YXIgbDtcblxuICAgICAgZm9yIChpID0gMCwgbCA9IG9iamVjdHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cbiAgICAgICAgb2JqZWN0ID0gb2JqZWN0c1tpXTtcbiAgICAgICAgZ2VvbWV0cnkgPSBvYmplY3QuZ2VvbWV0cnk7XG5cbiAgICAgICAgdmFyIGJ1ZmZlcmdlb21ldHJ5ID0gbmV3IFRIUkVFLkJ1ZmZlckdlb21ldHJ5KCk7XG5cbiAgICAgICAgYnVmZmVyZ2VvbWV0cnkuYWRkQXR0cmlidXRlKCdwb3NpdGlvbicsIG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUobmV3IEZsb2F0MzJBcnJheShnZW9tZXRyeS52ZXJ0aWNlcyksIDMpKTtcblxuICAgICAgICBpZiAoZ2VvbWV0cnkubm9ybWFscy5sZW5ndGggPiAwKSB7XG5cbiAgICAgICAgICBidWZmZXJnZW9tZXRyeS5hZGRBdHRyaWJ1dGUoJ25vcm1hbCcsIG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUobmV3IEZsb2F0MzJBcnJheShnZW9tZXRyeS5ub3JtYWxzKSwgMykpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGdlb21ldHJ5LnV2cy5sZW5ndGggPiAwKSB7XG5cbiAgICAgICAgICBidWZmZXJnZW9tZXRyeS5hZGRBdHRyaWJ1dGUoJ3V2JywgbmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZShuZXcgRmxvYXQzMkFycmF5KGdlb21ldHJ5LnV2cyksIDIpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoe1xuICAgICAgICAgIGNvbG9yOiAweGZmMDAwMFxuICAgICAgICB9KTtcbiAgICAgICAgbWF0ZXJpYWwubmFtZSA9IG9iamVjdC5tYXRlcmlhbC5uYW1lO1xuXG4gICAgICAgIHZhciBtZXNoID0gbmV3IFRIUkVFLk1lc2goYnVmZmVyZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgICAgbWVzaC5uYW1lID0gb2JqZWN0Lm5hbWU7XG5cbiAgICAgICAgY29udGFpbmVyLmFkZChtZXNoKTtcbiAgICAgIH1cblxuICAgICAgY29uc29sZS50aW1lRW5kKCdPQkpMb2FkZXInKTtcblxuICAgICAgcmV0dXJuIGNvbnRhaW5lcjtcbiAgICB9XG5cbiAgfTtcbn07IiwiXG5pbXBvcnQge2hhbmRsZVdpbmRvd1Jlc2l6ZX0gZnJvbSAnLi91dGlsaXRpZXMuanMnXG5jb25zdCBPQkpMb2FkZXIgPSByZXF1aXJlKCd0aHJlZS1vYmotbG9hZGVyJylcblxuT0JKTG9hZGVyKFRIUkVFKVxuXG52YXIgU0NSRUVOX1dJRFRIID0gd2luZG93LmlubmVyV2lkdGg7XG52YXIgU0NSRUVOX0hFSUdIVCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxudmFyIHNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG5cbnZhciBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoIDc1LCBTQ1JFRU5fV0lEVEgvU0NSRUVOX0hFSUdIVCwgMC4xLCAxMDAwICk7XG5cbnZhciBhbWJpZW50ID0gbmV3IFRIUkVFLkFtYmllbnRMaWdodCggMHg0NDQ0NDQgKTtcbnNjZW5lLmFkZCggYW1iaWVudCApO1xuXG5cbnZhciByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKCk7XG5yZW5kZXJlci5zZXRTaXplKCB3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0ICk7XG5cbnJlbmRlcmVyLnNoYWRvd01hcC5lbmFibGVkID0gdHJ1ZTtcbnJlbmRlcmVyLnNoYWRvd01hcC50eXBlID0gVEhSRUUuUENGU2hhZG93TWFwO1xuXG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCByZW5kZXJlci5kb21FbGVtZW50ICk7XG5cblxuXG4vLyB2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoIDEsIDEsIDIgKTtcbi8vIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCggeyBjb2xvcjogMHhCRkJGQkYgfSApO1xuLy8gdmFyIGN1YmUgPSBuZXcgVEhSRUUuTWVzaCggZ2VvbWV0cnksIG1hdGVyaWFsICk7XG4vLyBzY2VuZS5hZGQoIGN1YmUgKTtcblxudmFyIGNoYXJHZW9tZXRyeSA9IG5ldyBUSFJFRS5Db25lR2VvbWV0cnkoIC4yLCAuNywgNTAsIDEsZmFsc2UsMTAsMiozLjE0ICk7XG52YXIgY2hhck1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoeyBjb2xvcjogMHg2YTZhNmEgfSlcbnZhciBjaGFyYSA9IG5ldyBUSFJFRS5NZXNoKGNoYXJHZW9tZXRyeSwgY2hhck1hdGVyaWFsKTtcbnNjZW5lLmFkZChjaGFyYSk7XG5cbmNoYXJhLmNhc3RTaGFkb3cgPSB0cnVlO1xuLy8gY2hhcmEucmVjZWl2ZVNoYWRvdyA9IHRydWU7XG52YXIgc3RhcnRpbmdYUG9zID0gLTEuMlxuXG52YXIgY2hhclhQb3NpdGlvbiA9IHtcbiAgY3VycmVudFggOiBzdGFydGluZ1hQb3MsXG4gIG5leHRYOnN0YXJ0aW5nWFBvc1xufVxuY2hhcmEucG9zaXRpb24uc2V0KGNoYXJYUG9zaXRpb24uY3VycmVudFgsIC0yLjMsIDAuMik7XG5cbnZhciBqdW1wUmFuZ2UgPSB7XG4gIHVwcGVyQm91bmQ6IDEwMDAsXG4gIGxvd2VyQm91bmQ6IDAsXG4gIGN1cnJlbnRQb3M6IDAsXG4gIGlzSnVtcGluZzogZmFsc2Vcbn1cbnZhciBtb3ZlbWVudCA9IHtcbiAgd2Fsa2luZzogZmFsc2UsXG4gIGtleXNVcDogZmFsc2UsXG4gIGtleXNEb3duOiBmYWxzZSxcbiAga2V5c0xlZnQ6IGZhbHNlLFxuICBrZXlzUmlnaHQ6IGZhbHNlXG59XG5cbnZhciBncm91bmRHZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSgxMiwwLjMsMSk7XG52YXIgZ3JvdW5kTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCggeyBjb2xvcjogMHhGRkZGRkYgfSApO1xudmFyIGdyb3VuZCA9IG5ldyBUSFJFRS5NZXNoKCBncm91bmRHZW9tZXRyeSwgZ3JvdW5kTWF0ZXJpYWwgKTtcbmdyb3VuZC5jYXN0U2hhZG93ID0gZmFsc2U7XG5ncm91bmQucmVjZWl2ZVNoYWRvdyA9IHRydWU7XG5zY2VuZS5hZGQoIGdyb3VuZCApO1xuZ3JvdW5kLnBvc2l0aW9uLnNldCgwLCAtMi45LCAwKTtcblxudmFyIFNIQURPV19NQVBfV0lEVEggPSAyMDQ4LCBTSEFET1dfTUFQX0hFSUdIVCA9IDEwMjQ7XG52YXIgbGlnaHQgPSBuZXcgVEhSRUUuU3BvdExpZ2h0KCAweEZGRkZGRiwgMSwgMCwgTWF0aC5QSSAvIDIgKTtcbi8vIHZhciBsaWdodCA9IG5ldyBUSFJFRS5TcG90TGlnaHQoIDB4QUFBQUFBICk7XG5saWdodC5wb3NpdGlvbi5zZXQoIDUsIDMsIDEwICk7XG5saWdodC50YXJnZXQucG9zaXRpb24uc2V0KCBjaGFyYS5wb3NpdGlvbiApO1xuXG5saWdodC5jYXN0U2hhZG93ID0gdHJ1ZTtcblxubGlnaHQuc2hhZG93ID0gbmV3IFRIUkVFLkxpZ2h0U2hhZG93KCBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoIDUwLCAxLCAwLjEsIDEwMDAgKSApO1xubGlnaHQuc2hhZG93LmJpYXMgPSAwLjAwMDE7XG5saWdodC5zaGFkb3cubWFwU2l6ZS53aWR0aCA9IFNIQURPV19NQVBfV0lEVEg7XG5saWdodC5zaGFkb3cubWFwU2l6ZS5oZWlnaHQgPSBTSEFET1dfTUFQX0hFSUdIVDtcblxuc2NlbmUuYWRkKCBsaWdodCApO1xucmVuZGVyZXIuc2V0Q2xlYXJDb2xvciggMHhFRUVFRUUsIDEpO1xuXG5jYW1lcmEucG9zaXRpb24ueiA9IDU7XG5cbmxldCBtaW5ZID0gLTIuMyxcbiAgICBwcmV2WSA9IG1pblksXG4gICAgbWF4Rm91bmQgPSBmYWxzZSxcbiAgICBtaW5Gb3VuZCA9IGZhbHNlLFxuICAgIG1heFlcblxuXG5cbi8vXG4vLyB2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQ29uZUdlb21ldHJ5KCAuMiwgLjcsIDUwLCAxLGZhbHNlLDEwLDIqMy4xNCApO1xuLy8gdmFyIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoIHsgY29sb3I6IDB4NmE2YTZhIH0gKTtcbi8vIHZhciBjb25lID0gbmV3IFRIUkVFLk1lc2goIGdlb21ldHJ5LCBtYXRlcmlhbCApO1xuLy8gc2NlbmUuYWRkKCBjb25lICk7XG4vLyBjb25lLnBvc2l0aW9uLnNldCgtMS4yLCAtMi4zLCAwLjIpO1xuLy8gY29uZS5jYXN0U2hhZG93ID0gdHJ1ZTtcblxuXG5cbnZhciBoZWFkR2VvbWV0cnkgPSBuZXcgVEhSRUUuQ29uZUdlb21ldHJ5KCAuMTUsIC41LCAzLCAxLGZhbHNlLDEwLDIqMy4xNCApO1xudmFyIGhlYWRNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKCB7IGNvbG9yOiAweDZhNmE2YSB9ICk7XG52YXIgaGVhZCA9IG5ldyBUSFJFRS5NZXNoKGhlYWRHZW9tZXRyeSwgaGVhZE1hdGVyaWFsKTtcbnNjZW5lLmFkZChoZWFkKVxuaGVhZC5wb3NpdGlvbi5zZXQoLTEuMDEsIC0yLjE1LCAwLjIyKTtcbmhlYWQucm90YXRpb24ueCA9IDEuOTtcbmhlYWQucm90YXRpb24ueSA9IDIuODtcbmhlYWQucm90YXRpb24ueiA9IDEuM1xuXG52YXIgZGFUZXh0dXJlMiA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCggeyBzcGVjdWxhcjogMHg2YTZhNmEsIHNoYWRpbmc6IFRIUkVFLkZsYXRTaGFkaW5nLCB2ZXJ0ZXhDb2xvcnM6IFRIUkVFLlZlcnRleENvbG9ycyB9ICk7XG52YXIgZGFUZXh0dXJlID0gbmV3IFRIUkVFLlRleHR1cmUoKVxuXG52YXIgbWFuYWdlciA9IG5ldyBUSFJFRS5Mb2FkaW5nTWFuYWdlcigpO1xubWFuYWdlci5vblByb2dyZXNzID0gZnVuY3Rpb24gKCBpdGVtLCBsb2FkZWQsIHRvdGFsICkge1xuICBjb25zb2xlLmxvZyggaXRlbSwgbG9hZGVkLCB0b3RhbCApO1xufTtcblxudmFyIGRlZXJcbi8vXG4vLyB2YXIgbG9hZGVyID0gbmV3IFRIUkVFLkpTT05Mb2FkZXIobWFuYWdlcik7XG4vLyBsb2FkZXIubG9hZCgnLi4vaW1hZ2VzL2RlZXIuanNvbicsIGZ1bmN0aW9uKG9iaiwgbWF0KXtcbi8vXG4vLyAgIHZhciBvYmpNYXRzID0gbmV3IFRIUkVFLk11bHRpTWF0ZXJpYWwoIG1hdCApO1xuLy8gICB2YXIgb2JqZWN0ID0gbmV3IFRIUkVFLk1lc2goIG9iaiwgb2JqTWF0cyApO1xuLy9cbi8vXG4vL1xuLy8gICBjb25zb2xlLmxvZyhvYmplY3QpXG4vLyAgIC8vIG9iamVjdC5tYXRlcmlhbC52aXNpYmxlID0gdHJ1ZTtcbi8vIFx0c2NlbmUuYWRkKCBvYmplY3QgKTtcbi8vXG4vLyB9KVxuXG52YXIgbG9hZGVyID0gbmV3IFRIUkVFLk9CSkxvYWRlcihtYW5hZ2VyKTtcbmxvYWRlci5sb2FkKCAnLi4vaW1hZ2VzL0RlZXIub2JqJywgZnVuY3Rpb24gKCBvYmplY3QgKSB7XG5vYmplY3QudHJhdmVyc2UoIGZ1bmN0aW9uICggY2hpbGQgKSB7XG5cbiAgaWYgKCBjaGlsZCBpbnN0YW5jZW9mIFRIUkVFLk1lc2ggKSB7XG4gICAgY2hpbGQubWF0ZXJpYWwubWFwID0gZGFUZXh0dXJlO1xuICAgIC8vIGNoaWxkLm1hdGVyaWFsLm1hcCA9IGRhVGV4dHVyZTJcbiAgICBjaGlsZC5tYXRlcmlhbC5jb2xvci5yID0gNjBcbiAgICBjaGlsZC5tYXRlcmlhbC5jb2xvci5nID0gNjBcbiAgICBjaGlsZC5tYXRlcmlhbC5jb2xvci5iID0gNjBcblxuICAgIC8vIGNvbnNvbGUubG9nKGNoaWxkLm1hdGVyaWFsKVxuICAgIC8vIGNvbnNvbGUubG9nKGNoYXJhKVxuXHR9XG59ICk7XG4gIGNvbnNvbGUubG9nKG9iamVjdClcbiAgb2JqZWN0LnNjYWxlLnggPSAuMDAzXG4gIG9iamVjdC5zY2FsZS55ID0gLjAwM1xuICBvYmplY3Quc2NhbGUueiA9LjAwM1xuICBvYmplY3QuY2FzdFNoYWRvdyA9IHRydWVcblx0b2JqZWN0LnBvc2l0aW9uLnNldCgtNCwgLTIuNzUsIDAuMik7XG4gIG9iamVjdC5yb3RhdGlvbi55ID0gMS42XG4gIGRlZXIgPSBvYmplY3Rcblx0c2NlbmUuYWRkKCBvYmplY3QgKTtcbn0pO1xuXG5cblxuXG5cblxuXG52YXIgcmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIHJlbmRlciApO1xuXG4gIC8vIGhlYWQucm90YXRpb24ueCArPSAwLjAyO1xuXHQvLyBoZWFkLnJvdGF0aW9uLnkgKz0gMC4wMjI1O1xuXHQvLyBoZWFkLnJvdGF0aW9uLnogKz0gMC4wMTc1O1xuICAvLyBkZWVyLnJvdGF0aW9uLnkgKz0gMC4wMlxuXG4gIGxldCB0aGFYID0gY2hhclhQb3NpdGlvbi5uZXh0WFxuXG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzkpe1xuICAgICAgICBjaGFyWFBvc2l0aW9uLm5leHRYICs9IC4xXG4gICAgICAgIG1vdmVtZW50LndhbGtpbmcgPSB0cnVlXG4gICAgICAgIG1vdmVtZW50LmtleXNSaWdodCA9IHRydWVcbiAgICAgIC8vIGNvbnNvbGUubG9nKGNoYXJhLnBvc2l0aW9uLngpXG4gICAgICBpZihjaGFyYS5wb3NpdGlvbi54ID49IDQuOCl7XG4gICAgICAgIGNoYXJYUG9zaXRpb24ubmV4dFggPSA0LjhcbiAgICAgIH1cbiAgICB9ZWxzZSBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzcpe1xuICAgICAgY2hhclhQb3NpdGlvbi5uZXh0WCArPSAtLjFcbiAgICAgIG1vdmVtZW50LndhbGtpbmcgPSB0cnVlXG4gICAgICBtb3ZlbWVudC5rZXlzTGVmdCA9IHRydWVcbiAgICAgIC8vIGNvbnNvbGUubG9nKGNoYXJhLnBvc2l0aW9uLngpXG4gICAgICBpZihjaGFyYS5wb3NpdGlvbi54IDw9IC00Ljc5NTk5OTk5OTk5OTk5Mil7XG4gICAgICAgIGNoYXJYUG9zaXRpb24ubmV4dFg9IC00Ljc5NTk5OTk5OTk5OTk5MjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGV2ZW50LmtleUNvZGUgPT09IDM4KXtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGNoYXJhLnBvc2l0aW9uLnkgKVxuICAgICAgLy8gY2hhcmEucG9zaXRpb24ueSA9IC0wLjQgKyAxKk1hdGguc2luKGR0aW1lLzEwMDApO1xuICAgICAgLy8gY29uc29sZS5sb2coY2hhcmEucG9zaXRpb24ueSlcbiAgICAgIGp1bXBSYW5nZS5pc0p1bXBpbmcgPSB0cnVlXG4gICAgICBtb3ZlbWVudC53YWxraW5nID0gdHJ1ZVxuICAgICAgbW92ZW1lbnQua2V5c1VwID0gdHJ1ZVxuICAgIH1cbn0pXG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGZ1bmN0aW9uKGUpe1xuXG4gIHN3aXRjaCAoZS5rZXlDb2RlKSB7XG4gICAgY2FzZSAzOTpcbiAgICAgIG1vdmVtZW50LmtleXNSaWdodCA9IGZhbHNlXG4gICAgICBicmVhaztcbiAgICBjYXNlIDM3OlxuICAgICAgbW92ZW1lbnQua2V5c0xlZnQgPSBmYWxzZVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAzODpcbiAgICAgIG1vdmVtZW50LmtleXNVcCA9IGZhbHNlXG4gICAgICBicmVhaztcbiAgICBjYXNlIDQwOlxuICAgICAgbW92ZW1lbnQua2V5c0Rvd24gPSBmYWxzZVxuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIC8vbm8tb3BcbiAgICAgIGJyZWFrO1xuICB9XG5cblxuICBpZighbW92ZW1lbnQua2V5c0Rvd24gJiYgIW1vdmVtZW50LmtleXNMZWZ0ICYmXG4gICAgICFtb3ZlbWVudC5rZXlzVXAgJiYgIW1vdmVtZW50LmtleXNSaWdodCl7XG4gICAgbW92ZW1lbnQud2Fsa2luZyA9IGZhbHNlXG4gIH1cblxufSlcblxuXHRpZihqdW1wUmFuZ2UuaXNKdW1waW5nKXtcblxuICAgIGp1bXBSYW5nZS5jdXJyZW50UG9zKytcblxuICAgIGxldCBjaGFyYVBvc2l0aW9uWUNhbGMgPSBtaW5ZICsgMi41Kk1hdGguc2luKGp1bXBSYW5nZS5jdXJyZW50UG9zLzEwKVxuXG5cbiAgICBpZih0eXBlb2YgbWF4WSAhPT0gJ251bWJlcicpIG1heFkgPSBjaGFyYVBvc2l0aW9uWUNhbGNcbiAgICAgIGVsc2UgbWF4WSA9IGNoYXJhLnBvc2l0aW9uLnkgPiBtYXhZID8gY2hhcmFQb3NpdGlvbllDYWxjIDogbWF4WVxuXG4gICAgaWYodHlwZW9mIG1pblkgIT09ICdudW1iZXInKSBtaW5ZID0gY2hhcmFQb3NpdGlvbllDYWxjXG4gICAgICBlbHNlIG1pblkgPSBjaGFyYS5wb3NpdGlvbi55IDwgbWluWSA/ICBjaGFyYVBvc2l0aW9uWUNhbGMgOiBtaW5ZXG5cblxuICAgIGlmKGNoYXJhUG9zaXRpb25ZQ2FsYyA+IG1heFkgJiYgY2hhcmFQb3NpdGlvbllDYWxjID4gcHJldlkgfHwgcHJldlkgPT09IG1heFkgICl7XG4gICAgICBtYXhZID0gTWF0aC5tYXgocHJldlksIGNoYXJhUG9zaXRpb25ZQ2FsYylcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdvaCBteWggZ29kIG1ha2UgaXQgc3RvcCcsIG1heFksIHByZXZZKVxuICAgIH1cblxuICAgIGlmKGNoYXJhUG9zaXRpb25ZQ2FsYyA8PSBtaW5ZICl7XG4gICAgICBjaGFyYS5wb3NpdGlvbi55ID0gbWluWVxuICAgICAganVtcFJhbmdlLmlzSnVtcGluZyA9IGZhbHNlXG4gICAgICBqdW1wUmFuZ2UuY3VycmVudFBvcyA9IDBcbiAgICB9IGVsc2Uge1xuICAgICAgY2hhcmEucG9zaXRpb24ueSA9IGNoYXJhUG9zaXRpb25ZQ2FsY1xuICAgIH1cblxuICAgIHByZXZZID0gY2hhcmEucG9zaXRpb24ueVxuICB9XG5cbiAgaWYoIW1vdmVtZW50LndhbGtpbmcpe1xuICAgIGNoYXJYUG9zaXRpb24ubmV4dFggPSBjaGFyYS5wb3NpdGlvbi54XG5cbiAgfSBlbHNlIHtcbiAgICBpZihjaGFyYS5wb3NpdGlvbi54ICA8IGNoYXJYUG9zaXRpb24ubmV4dFgpe1xuICAgICAgLy8gY2hhcmEucG9zaXRpb24ueCArPSAuMVxuICAgICAgLy8gaGVhZC5wb3NpdGlvbi54ICs9LjFcbiAgICAgIC8vIGlmKGNoYXJhLnBvc2l0aW9uLnggPj0gNC44KXtcbiAgICAgIC8vICAgY2hhcmEucG9zaXRpb24ueCA9IDQuOFxuICAgICAgLy8gfVxuICAgICAgaWYoY2hhcmEucG9zaXRpb24ueCA+PSA0Ljgpe1xuXG4gICAgICB9ZWxzZSB7XG4gICAgICAgIGNoYXJhLnBvc2l0aW9uLnggKz0gLjFcbiAgICAgICAgaGVhZC5wb3NpdGlvbi54ICs9LjFcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZihjaGFyYS5wb3NpdGlvbi54ICA+IGNoYXJYUG9zaXRpb24ubmV4dFgpe1xuICAgICAgLy8gY2hhcmEucG9zaXRpb24ueCAtPSAuMVxuICAgICAgLy8gICBoZWFkLnBvc2l0aW9uLnggLT0uMVxuICAgICAgLy8gaWYoY2hhcmEucG9zaXRpb24ueCA8PSAtNC44KXtcbiAgICAgIC8vICAgY2hhcmEucG9zaXRpb24ueCA9IC00LjhcbiAgICAgIC8vIH1cbiAgICAgIGlmKGNoYXJhLnBvc2l0aW9uLnggPD0gLTQuOCl7XG5cbiAgICAgIH1lbHNlIHtcbiAgICAgICAgY2hhcmEucG9zaXRpb24ueCAtPSAuMVxuICAgICAgICBoZWFkLnBvc2l0aW9uLnggLT0uMVxuICAgICAgfVxuXG4gICAgfVxuICB9XG5cblxuXG4gIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcbn07XG5cbnJlbmRlcigpO1xudmFyIGRhUmVzaXplID0gZnVuY3Rpb24oKXtcbiAgaGFuZGxlV2luZG93UmVzaXplKGNhbWVyYSwgcmVuZGVyZXIpXG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBkYVJlc2l6ZSApXG4iLCIvLyBpbXBvcnQge1NDUkVFTl9XSURUSCxTQ1JFRU5fSEVJR0hULGNhbWVyYSxyZW5kZXJlcn0gZnJvbSAnLi9hcHAuanMnXG5cblxudmFyIGhhbmRsZVdpbmRvd1Jlc2l6ZSA9IGZ1bmN0aW9uKGNhbSwgcmVuZHJyKXtcbiAgbGV0IGNhbWVyYV8gPSBjYW07XG4gIGxldCByZW5kZXJlcl8gPSByZW5kcnJcblxuICBsZXQgbmV3V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCxcbiAgICAgIG5ld0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuICBjYW1lcmFfLmFzcGVjdCA9IG5ld1dpZHRoIC8gbmV3SGVpZ2h0O1xuICBjYW1lcmFfLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcbiAgcmVuZGVyZXJfLnNldFNpemUoIG5ld1dpZHRoLCBuZXdIZWlnaHQgKTtcblxuXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGhhbmRsZVdpbmRvd1Jlc2l6ZVxufVxuIl19
