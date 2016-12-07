(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _utilities = require('./utilities.js');

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

var charGeometry = new THREE.BoxGeometry(.6, .9, 0.2);
var charMaterial = new THREE.MeshPhongMaterial({ color: 0xCCCCCC });
var chara = new THREE.Mesh(charGeometry, charMaterial);
scene.add(chara);

chara.castShadow = true;
// chara.receiveShadow = true;
var startingXPos = -2.5;

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
light.position.set(10, 0, 10);
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

var render = function render() {
  requestAnimationFrame(render);

  // cube.rotation.x += 0.02;
  // cube.rotation.y += 0.0225;
  // cube.rotation.z += 0.0175;

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
      chara.position.x += .1;
      if (chara.position.x >= 4.8) {
        chara.position.x = 4.8;
      }
    }

    if (chara.position.x > charXPosition.nextX) {
      chara.position.x -= .1;
      if (chara.position.x <= -4.8) {
        chara.position.x = -4.8;
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

},{"./utilities.js":2}],2:[function(require,module,exports){
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9hcHAuanMiLCJzcmMvc2NyaXB0cy91dGlsaXRpZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0NBOztBQUVBLElBQUksZUFBZSxPQUFuQixBQUEwQjtBQUMxQixJQUFJLGdCQUFnQixPQUFwQixBQUEyQjs7QUFFM0IsSUFBSSxRQUFRLElBQUksTUFBaEIsQUFBWSxBQUFVOztBQUV0QixJQUFJLFNBQVMsSUFBSSxNQUFKLEFBQVUsa0JBQVYsQUFBNkIsSUFBSSxlQUFqQyxBQUE4QyxlQUE5QyxBQUE2RCxLQUExRSxBQUFhLEFBQWtFOztBQUUvRSxJQUFJLFVBQVUsSUFBSSxNQUFKLEFBQVUsYUFBeEIsQUFBYyxBQUF3QjtBQUN0QyxNQUFBLEFBQU0sSUFBTixBQUFXOztBQUdYLElBQUksV0FBVyxJQUFJLE1BQW5CLEFBQWUsQUFBVTtBQUN6QixTQUFBLEFBQVMsUUFBUyxPQUFsQixBQUF5QixZQUFZLE9BQXJDLEFBQTRDOztBQUU1QyxTQUFBLEFBQVMsVUFBVCxBQUFtQixVQUFuQixBQUE2QjtBQUM3QixTQUFBLEFBQVMsVUFBVCxBQUFtQixPQUFPLE1BQTFCLEFBQWdDOztBQUVoQyxTQUFBLEFBQVMsS0FBVCxBQUFjLFlBQWEsU0FBM0IsQUFBb0M7O0FBRXBDO0FBQ0E7QUFDQTtBQUNBOztBQUVBLElBQUksZUFBZSxJQUFJLE1BQUosQUFBVSxZQUFWLEFBQXNCLElBQXRCLEFBQTBCLElBQTdDLEFBQW1CLEFBQThCO0FBQ2pELElBQUksZUFBZSxJQUFJLE1BQUosQUFBVSxrQkFBa0IsRUFBRSxPQUFqRCxBQUFtQixBQUE0QixBQUFTO0FBQ3hELElBQUksUUFBUSxJQUFJLE1BQUosQUFBVSxLQUFWLEFBQWUsY0FBM0IsQUFBWSxBQUE2QjtBQUN6QyxNQUFBLEFBQU0sSUFBTixBQUFVOztBQUVWLE1BQUEsQUFBTSxhQUFOLEFBQW1CO0FBQ25C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T0FBTSxBQUN6QztZQUFBLEFBQU0sU0FBTixBQUFlLEtBQWYsQUFBb0IsQUFDcEI7VUFBRyxNQUFBLEFBQU0sU0FBTixBQUFlLEtBQUssQ0FBdkIsQUFBd0IsS0FBSSxBQUMxQjtjQUFBLEFBQU0sU0FBTixBQUFlLElBQUksQ0FBbkIsQUFBb0IsQUFDckI7QUFDRjtBQUNGO0FBSUQ7O1dBQUEsQUFBUyxPQUFULEFBQWdCLE9BQWhCLEFBQXVCLEFBQ3hCO0FBckhEOztBQXVIQTtBQUNBLElBQUksV0FBVyxTQUFYLEFBQVcsV0FBVSxBQUN2QjtxQ0FBQSxBQUFtQixRQUFuQixBQUEyQixBQUM1QjtBQUZEOztBQUlBLE9BQUEsQUFBTyxpQkFBUCxBQUF3QixVQUF4QixBQUFrQzs7Ozs7QUNyTmxDOzs7QUFHQSxJQUFJLHFCQUFxQixTQUFyQixBQUFxQixtQkFBQSxBQUFTLEtBQVQsQUFBYyxRQUFPLEFBQzVDO01BQUksVUFBSixBQUFjLEFBQ2Q7TUFBSSxZQUFKLEFBQWdCLEFBRWhCOztNQUFJLFdBQVcsT0FBZixBQUFzQjtNQUNsQixZQUFZLE9BRGhCLEFBQ3VCLEFBRXZCOztVQUFBLEFBQVEsU0FBUyxXQUFqQixBQUE0QixBQUM1QjtVQUFBLEFBQVEsQUFDUjtZQUFBLEFBQVUsUUFBVixBQUFtQixVQUFuQixBQUE2QixBQUc5QjtBQVpEOztBQWVBLE9BQUEsQUFBTztzQkFBUCxBQUFpQjtBQUFBLEFBQ2YiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG5pbXBvcnQge2hhbmRsZVdpbmRvd1Jlc2l6ZX0gZnJvbSAnLi91dGlsaXRpZXMuanMnXG5cbnZhciBTQ1JFRU5fV0lEVEggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbnZhciBTQ1JFRU5fSEVJR0hUID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG52YXIgc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcblxudmFyIGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSggNzUsIFNDUkVFTl9XSURUSC9TQ1JFRU5fSEVJR0hULCAwLjEsIDEwMDAgKTtcblxudmFyIGFtYmllbnQgPSBuZXcgVEhSRUUuQW1iaWVudExpZ2h0KCAweDQ0NDQ0NCApO1xuc2NlbmUuYWRkKCBhbWJpZW50ICk7XG5cblxudmFyIHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoKTtcbnJlbmRlcmVyLnNldFNpemUoIHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQgKTtcblxucmVuZGVyZXIuc2hhZG93TWFwLmVuYWJsZWQgPSB0cnVlO1xucmVuZGVyZXIuc2hhZG93TWFwLnR5cGUgPSBUSFJFRS5QQ0ZTaGFkb3dNYXA7XG5cbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoIHJlbmRlcmVyLmRvbUVsZW1lbnQgKTtcblxuLy8gdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KCAxLCAxLCAyICk7XG4vLyB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoIHsgY29sb3I6IDB4QkZCRkJGIH0gKTtcbi8vIHZhciBjdWJlID0gbmV3IFRIUkVFLk1lc2goIGdlb21ldHJ5LCBtYXRlcmlhbCApO1xuLy8gc2NlbmUuYWRkKCBjdWJlICk7XG5cbnZhciBjaGFyR2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoLjYsIC45LCAwLjIpO1xudmFyIGNoYXJNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7IGNvbG9yOiAweENDQ0NDQyB9KVxudmFyIGNoYXJhID0gbmV3IFRIUkVFLk1lc2goY2hhckdlb21ldHJ5LCBjaGFyTWF0ZXJpYWwpO1xuc2NlbmUuYWRkKGNoYXJhKTtcblxuY2hhcmEuY2FzdFNoYWRvdyA9IHRydWU7XG4vLyBjaGFyYS5yZWNlaXZlU2hhZG93ID0gdHJ1ZTtcbnZhciBzdGFydGluZ1hQb3MgPSAtMi41XG5cbnZhciBjaGFyWFBvc2l0aW9uID0ge1xuICBjdXJyZW50WCA6IHN0YXJ0aW5nWFBvcyxcbiAgbmV4dFg6c3RhcnRpbmdYUG9zXG59XG5jaGFyYS5wb3NpdGlvbi5zZXQoY2hhclhQb3NpdGlvbi5jdXJyZW50WCwgLTIuMywgMC4yKTtcblxudmFyIGp1bXBSYW5nZSA9IHtcbiAgdXBwZXJCb3VuZDogMTAwMCxcbiAgbG93ZXJCb3VuZDogMCxcbiAgY3VycmVudFBvczogMCxcbiAgaXNKdW1waW5nOiBmYWxzZVxufVxudmFyIG1vdmVtZW50ID0ge1xuICB3YWxraW5nOiBmYWxzZSxcbiAga2V5c1VwOiBmYWxzZSxcbiAga2V5c0Rvd246IGZhbHNlLFxuICBrZXlzTGVmdDogZmFsc2UsXG4gIGtleXNSaWdodDogZmFsc2Vcbn1cblxudmFyIGdyb3VuZEdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KDEyLDAuMywxKTtcbnZhciBncm91bmRNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKCB7IGNvbG9yOiAweEZGRkZGRiB9ICk7XG52YXIgZ3JvdW5kID0gbmV3IFRIUkVFLk1lc2goIGdyb3VuZEdlb21ldHJ5LCBncm91bmRNYXRlcmlhbCApO1xuZ3JvdW5kLmNhc3RTaGFkb3cgPSBmYWxzZTtcbmdyb3VuZC5yZWNlaXZlU2hhZG93ID0gdHJ1ZTtcbnNjZW5lLmFkZCggZ3JvdW5kICk7XG5ncm91bmQucG9zaXRpb24uc2V0KDAsIC0yLjksIDApO1xuXG52YXIgU0hBRE9XX01BUF9XSURUSCA9IDIwNDgsIFNIQURPV19NQVBfSEVJR0hUID0gMTAyNDtcbnZhciBsaWdodCA9IG5ldyBUSFJFRS5TcG90TGlnaHQoIDB4RkZGRkZGLCAxLCAwLCBNYXRoLlBJIC8gMiApO1xuLy8gdmFyIGxpZ2h0ID0gbmV3IFRIUkVFLlNwb3RMaWdodCggMHhBQUFBQUEgKTtcbmxpZ2h0LnBvc2l0aW9uLnNldCggMTAsIDAsIDEwICk7XG5saWdodC50YXJnZXQucG9zaXRpb24uc2V0KCBjaGFyYS5wb3NpdGlvbiApO1xuXG5saWdodC5jYXN0U2hhZG93ID0gdHJ1ZTtcblxubGlnaHQuc2hhZG93ID0gbmV3IFRIUkVFLkxpZ2h0U2hhZG93KCBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoIDUwLCAxLCAwLjEsIDEwMDAgKSApO1xubGlnaHQuc2hhZG93LmJpYXMgPSAwLjAwMDE7XG5saWdodC5zaGFkb3cubWFwU2l6ZS53aWR0aCA9IFNIQURPV19NQVBfV0lEVEg7XG5saWdodC5zaGFkb3cubWFwU2l6ZS5oZWlnaHQgPSBTSEFET1dfTUFQX0hFSUdIVDtcblxuc2NlbmUuYWRkKCBsaWdodCApO1xucmVuZGVyZXIuc2V0Q2xlYXJDb2xvciggMHhFRUVFRUUsIDEpO1xuXG5jYW1lcmEucG9zaXRpb24ueiA9IDU7XG5cbmxldCBtaW5ZID0gLTIuMyxcbiAgICBwcmV2WSA9IG1pblksXG4gICAgbWF4Rm91bmQgPSBmYWxzZSxcbiAgICBtaW5Gb3VuZCA9IGZhbHNlLFxuICAgIG1heFlcblxuXG52YXIgcmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIHJlbmRlciApO1xuXG4gIC8vIGN1YmUucm90YXRpb24ueCArPSAwLjAyO1xuXHQvLyBjdWJlLnJvdGF0aW9uLnkgKz0gMC4wMjI1O1xuXHQvLyBjdWJlLnJvdGF0aW9uLnogKz0gMC4wMTc1O1xuXG4gIGxldCB0aGFYID0gY2hhclhQb3NpdGlvbi5uZXh0WFxuXG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzkpe1xuICAgICAgICBjaGFyWFBvc2l0aW9uLm5leHRYICs9IC4xXG4gICAgICAgIG1vdmVtZW50LndhbGtpbmcgPSB0cnVlXG4gICAgICAgIG1vdmVtZW50LmtleXNSaWdodCA9IHRydWVcbiAgICAgIC8vIGNvbnNvbGUubG9nKGNoYXJhLnBvc2l0aW9uLngpXG4gICAgICBpZihjaGFyYS5wb3NpdGlvbi54ID49IDQuOCl7XG4gICAgICAgIGNoYXJYUG9zaXRpb24ubmV4dFggPSA0LjhcbiAgICAgIH1cbiAgICB9ZWxzZSBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzcpe1xuICAgICAgY2hhclhQb3NpdGlvbi5uZXh0WCArPSAtLjFcbiAgICAgIG1vdmVtZW50LndhbGtpbmcgPSB0cnVlXG4gICAgICBtb3ZlbWVudC5rZXlzTGVmdCA9IHRydWVcbiAgICAgIC8vIGNvbnNvbGUubG9nKGNoYXJhLnBvc2l0aW9uLngpXG4gICAgICBpZihjaGFyYS5wb3NpdGlvbi54IDw9IC00Ljc5NTk5OTk5OTk5OTk5Mil7XG4gICAgICAgIGNoYXJYUG9zaXRpb24ubmV4dFg9IC00Ljc5NTk5OTk5OTk5OTk5MjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGV2ZW50LmtleUNvZGUgPT09IDM4KXtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGNoYXJhLnBvc2l0aW9uLnkgKVxuICAgICAgLy8gY2hhcmEucG9zaXRpb24ueSA9IC0wLjQgKyAxKk1hdGguc2luKGR0aW1lLzEwMDApO1xuICAgICAgLy8gY29uc29sZS5sb2coY2hhcmEucG9zaXRpb24ueSlcbiAgICAgIGp1bXBSYW5nZS5pc0p1bXBpbmcgPSB0cnVlXG4gICAgICBtb3ZlbWVudC53YWxraW5nID0gdHJ1ZVxuICAgICAgbW92ZW1lbnQua2V5c1VwID0gdHJ1ZVxuICAgIH1cbn0pXG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGZ1bmN0aW9uKGUpe1xuXG4gIHN3aXRjaCAoZS5rZXlDb2RlKSB7XG4gICAgY2FzZSAzOTpcbiAgICAgIG1vdmVtZW50LmtleXNSaWdodCA9IGZhbHNlXG4gICAgICBicmVhaztcbiAgICBjYXNlIDM3OlxuICAgICAgbW92ZW1lbnQua2V5c0xlZnQgPSBmYWxzZVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAzODpcbiAgICAgIG1vdmVtZW50LmtleXNVcCA9IGZhbHNlXG4gICAgICBicmVhaztcbiAgICBjYXNlIDQwOlxuICAgICAgbW92ZW1lbnQua2V5c0Rvd24gPSBmYWxzZVxuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIC8vbm8tb3BcbiAgICAgIGJyZWFrO1xuICB9XG5cblxuICBpZighbW92ZW1lbnQua2V5c0Rvd24gJiYgIW1vdmVtZW50LmtleXNMZWZ0ICYmXG4gICAgICFtb3ZlbWVudC5rZXlzVXAgJiYgIW1vdmVtZW50LmtleXNSaWdodCl7XG4gICAgbW92ZW1lbnQud2Fsa2luZyA9IGZhbHNlXG4gIH1cblxufSlcblxuXHRpZihqdW1wUmFuZ2UuaXNKdW1waW5nKXtcblxuICAgIGp1bXBSYW5nZS5jdXJyZW50UG9zKytcblxuICAgIGxldCBjaGFyYVBvc2l0aW9uWUNhbGMgPSBtaW5ZICsgMi41Kk1hdGguc2luKGp1bXBSYW5nZS5jdXJyZW50UG9zLzEwKVxuXG5cbiAgICBpZih0eXBlb2YgbWF4WSAhPT0gJ251bWJlcicpIG1heFkgPSBjaGFyYVBvc2l0aW9uWUNhbGNcbiAgICAgIGVsc2UgbWF4WSA9IGNoYXJhLnBvc2l0aW9uLnkgPiBtYXhZID8gY2hhcmFQb3NpdGlvbllDYWxjIDogbWF4WVxuXG4gICAgaWYodHlwZW9mIG1pblkgIT09ICdudW1iZXInKSBtaW5ZID0gY2hhcmFQb3NpdGlvbllDYWxjXG4gICAgICBlbHNlIG1pblkgPSBjaGFyYS5wb3NpdGlvbi55IDwgbWluWSA/ICBjaGFyYVBvc2l0aW9uWUNhbGMgOiBtaW5ZXG5cblxuICAgIGlmKGNoYXJhUG9zaXRpb25ZQ2FsYyA+IG1heFkgJiYgY2hhcmFQb3NpdGlvbllDYWxjID4gcHJldlkgfHwgcHJldlkgPT09IG1heFkgICl7XG4gICAgICBtYXhZID0gTWF0aC5tYXgocHJldlksIGNoYXJhUG9zaXRpb25ZQ2FsYylcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdvaCBteWggZ29kIG1ha2UgaXQgc3RvcCcsIG1heFksIHByZXZZKVxuICAgIH1cblxuICAgIGlmKGNoYXJhUG9zaXRpb25ZQ2FsYyA8PSBtaW5ZICl7XG4gICAgICBjaGFyYS5wb3NpdGlvbi55ID0gbWluWVxuICAgICAganVtcFJhbmdlLmlzSnVtcGluZyA9IGZhbHNlXG4gICAgICBqdW1wUmFuZ2UuY3VycmVudFBvcyA9IDBcbiAgICB9IGVsc2Uge1xuICAgICAgY2hhcmEucG9zaXRpb24ueSA9IGNoYXJhUG9zaXRpb25ZQ2FsY1xuICAgIH1cblxuICAgIHByZXZZID0gY2hhcmEucG9zaXRpb24ueVxuICB9XG5cbiAgaWYoIW1vdmVtZW50LndhbGtpbmcpe1xuICAgIGNoYXJYUG9zaXRpb24ubmV4dFggPSBjaGFyYS5wb3NpdGlvbi54XG5cbiAgfSBlbHNlIHtcbiAgICBpZihjaGFyYS5wb3NpdGlvbi54ICA8IGNoYXJYUG9zaXRpb24ubmV4dFgpe1xuICAgICAgY2hhcmEucG9zaXRpb24ueCArPSAuMVxuICAgICAgaWYoY2hhcmEucG9zaXRpb24ueCA+PSA0Ljgpe1xuICAgICAgICBjaGFyYS5wb3NpdGlvbi54ID0gNC44XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYoY2hhcmEucG9zaXRpb24ueCAgPiBjaGFyWFBvc2l0aW9uLm5leHRYKXtcbiAgICAgIGNoYXJhLnBvc2l0aW9uLnggLT0gLjFcbiAgICAgIGlmKGNoYXJhLnBvc2l0aW9uLnggPD0gLTQuOCl7XG4gICAgICAgIGNoYXJhLnBvc2l0aW9uLnggPSAtNC44XG4gICAgICB9XG4gICAgfVxuICB9XG5cblxuXG4gIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcbn07XG5cbnJlbmRlcigpO1xudmFyIGRhUmVzaXplID0gZnVuY3Rpb24oKXtcbiAgaGFuZGxlV2luZG93UmVzaXplKGNhbWVyYSwgcmVuZGVyZXIpXG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBkYVJlc2l6ZSApXG4iLCIvLyBpbXBvcnQge1NDUkVFTl9XSURUSCxTQ1JFRU5fSEVJR0hULGNhbWVyYSxyZW5kZXJlcn0gZnJvbSAnLi9hcHAuanMnXG5cblxudmFyIGhhbmRsZVdpbmRvd1Jlc2l6ZSA9IGZ1bmN0aW9uKGNhbSwgcmVuZHJyKXtcbiAgbGV0IGNhbWVyYV8gPSBjYW07XG4gIGxldCByZW5kZXJlcl8gPSByZW5kcnJcblxuICBsZXQgbmV3V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCxcbiAgICAgIG5ld0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuICBjYW1lcmFfLmFzcGVjdCA9IG5ld1dpZHRoIC8gbmV3SGVpZ2h0O1xuICBjYW1lcmFfLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcbiAgcmVuZGVyZXJfLnNldFNpemUoIG5ld1dpZHRoLCBuZXdIZWlnaHQgKTtcblxuXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGhhbmRsZVdpbmRvd1Jlc2l6ZVxufVxuIl19
