(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry(1, 1, 2);
var material = new THREE.MeshBasicMaterial({ color: 0xBFBFBF });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

var groundGeometry = new THREE.BoxGeometry(12, 0.3, 1);
var groundMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
var ground = new THREE.Mesh(groundGeometry, groundMaterial);
scene.add(ground);
ground.position.set(0, -1, 0);
var light = new THREE.PointLight(0xFFFF00);
light.position.set(10, 0, 10);
scene.add(light);
renderer.setClearColor(0xdddddd, 1);

camera.position.z = 5;

var render = function render() {
		requestAnimationFrame(render);

		// cube.rotation.x += 0.02;
		// cube.rotation.y += 0.0225;
		// cube.rotation.z += 0.0175;


		var dtime = Date.now();
		// cube.scale.x	= 1.0 + 0.3*Math.sin(dtime/300);
		// cube.scale.y	= 1.0 + 0.3*Math.sin(dtime/300);
		// cube.scale.z	= 1.0 + 0.3*Math.sin(dtime/300);
		cube.position.y = 0.8 + 1 * Math.sin(dtime / 300);
		renderer.render(scene, camera);
};

render();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQUksUUFBUSxJQUFJLE1BQWhCLEFBQVksQUFBVTtBQUN0QixJQUFJLFNBQVMsSUFBSSxNQUFKLEFBQVUsa0JBQVYsQUFBNkIsSUFBSSxPQUFBLEFBQU8sYUFBVyxPQUFuRCxBQUEwRCxhQUExRCxBQUF1RSxLQUFwRixBQUFhLEFBQTRFOztBQUV6RixJQUFJLFdBQVcsSUFBSSxNQUFuQixBQUFlLEFBQVU7QUFDekIsU0FBQSxBQUFTLFFBQVMsT0FBbEIsQUFBeUIsWUFBWSxPQUFyQyxBQUE0QztBQUM1QyxTQUFBLEFBQVMsS0FBVCxBQUFjLFlBQWEsU0FBM0IsQUFBb0M7O0FBRXBDLElBQUksV0FBVyxJQUFJLE1BQUosQUFBVSxZQUFWLEFBQXVCLEdBQXZCLEFBQTBCLEdBQXpDLEFBQWUsQUFBNkI7QUFDNUMsSUFBSSxXQUFXLElBQUksTUFBSixBQUFVLGtCQUFtQixFQUFFLE9BQTlDLEFBQWUsQUFBNkIsQUFBUztBQUNyRCxJQUFJLE9BQU8sSUFBSSxNQUFKLEFBQVUsS0FBVixBQUFnQixVQUEzQixBQUFXLEFBQTBCO0FBQ3JDLE1BQUEsQUFBTSxJQUFOLEFBQVc7O0FBRVgsSUFBSSxpQkFBaUIsSUFBSSxNQUFKLEFBQVUsWUFBVixBQUFzQixJQUF0QixBQUF5QixLQUE5QyxBQUFxQixBQUE2QjtBQUNsRCxJQUFJLGlCQUFpQixJQUFJLE1BQUosQUFBVSxrQkFBbUIsRUFBRSxPQUFwRCxBQUFxQixBQUE2QixBQUFTO0FBQzNELElBQUksU0FBUyxJQUFJLE1BQUosQUFBVSxLQUFWLEFBQWdCLGdCQUE3QixBQUFhLEFBQWdDO0FBQzdDLE1BQUEsQUFBTSxJQUFOLEFBQVc7QUFDWCxPQUFBLEFBQU8sU0FBUCxBQUFnQixJQUFoQixBQUFvQixHQUFHLENBQXZCLEFBQXdCLEdBQXhCLEFBQTJCO0FBQzNCLElBQUksUUFBUSxJQUFJLE1BQUosQUFBVSxXQUF0QixBQUFZLEFBQXNCO0FBQ2xDLE1BQUEsQUFBTSxTQUFOLEFBQWUsSUFBZixBQUFvQixJQUFwQixBQUF3QixHQUF4QixBQUEyQjtBQUMzQixNQUFBLEFBQU0sSUFBTixBQUFXO0FBQ1gsU0FBQSxBQUFTLGNBQVQsQUFBd0IsVUFBeEIsQUFBa0M7O0FBRWxDLE9BQUEsQUFBTyxTQUFQLEFBQWdCLElBQWhCLEFBQW9COztBQUVwQixJQUFJLFNBQVMsU0FBVCxBQUFTLFNBQVksQUFDdkI7d0JBQUEsQUFBdUIsQUFFdkI7O0FBQ0Q7QUFDQTtBQUtBOzs7TUFBSSxRQUFRLEtBQVosQUFBWSxBQUFLLEFBQ2pCO0FBQ0E7QUFDQTtBQUNDO09BQUEsQUFBSyxTQUFMLEFBQWMsSUFBSSxNQUFNLElBQUUsS0FBQSxBQUFLLElBQUksUUFBbkMsQUFBMEIsQUFBZSxBQUN6QztXQUFBLEFBQVMsT0FBVCxBQUFnQixPQUFoQixBQUF1QixBQUN4QjtBQWhCRDs7QUFrQkEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG52YXIgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKCA3NSwgd2luZG93LmlubmVyV2lkdGgvd2luZG93LmlubmVySGVpZ2h0LCAwLjEsIDEwMDAgKTtcblxudmFyIHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoKTtcbnJlbmRlcmVyLnNldFNpemUoIHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQgKTtcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoIHJlbmRlcmVyLmRvbUVsZW1lbnQgKTtcblxudmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KCAxLCAxLCAyICk7XG52YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoIHsgY29sb3I6IDB4QkZCRkJGIH0gKTtcbnZhciBjdWJlID0gbmV3IFRIUkVFLk1lc2goIGdlb21ldHJ5LCBtYXRlcmlhbCApO1xuc2NlbmUuYWRkKCBjdWJlICk7XG5cbnZhciBncm91bmRHZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSgxMiwwLjMsMSk7XG52YXIgZ3JvdW5kTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoIHsgY29sb3I6IDB4RkZGRkZGIH0gKTtcbnZhciBncm91bmQgPSBuZXcgVEhSRUUuTWVzaCggZ3JvdW5kR2VvbWV0cnksIGdyb3VuZE1hdGVyaWFsICk7XG5zY2VuZS5hZGQoIGdyb3VuZCApO1xuZ3JvdW5kLnBvc2l0aW9uLnNldCgwLCAtMSwgMCk7XG52YXIgbGlnaHQgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCggMHhGRkZGMDAgKTtcbmxpZ2h0LnBvc2l0aW9uLnNldCggMTAsIDAsIDEwICk7XG5zY2VuZS5hZGQoIGxpZ2h0ICk7XG5yZW5kZXJlci5zZXRDbGVhckNvbG9yKCAweGRkZGRkZCwgMSk7XG5cbmNhbWVyYS5wb3NpdGlvbi56ID0gNTtcblxudmFyIHJlbmRlciA9IGZ1bmN0aW9uICgpIHtcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCByZW5kZXIgKTtcblxuICAvLyBjdWJlLnJvdGF0aW9uLnggKz0gMC4wMjtcblx0Ly8gY3ViZS5yb3RhdGlvbi55ICs9IDAuMDIyNTtcblx0Ly8gY3ViZS5yb3RhdGlvbi56ICs9IDAuMDE3NTtcblxuXG5cblxuXHR2YXIgZHRpbWVcdD0gRGF0ZS5ub3coKVxuXHQvLyBjdWJlLnNjYWxlLnhcdD0gMS4wICsgMC4zKk1hdGguc2luKGR0aW1lLzMwMCk7XG5cdC8vIGN1YmUuc2NhbGUueVx0PSAxLjAgKyAwLjMqTWF0aC5zaW4oZHRpbWUvMzAwKTtcblx0Ly8gY3ViZS5zY2FsZS56XHQ9IDEuMCArIDAuMypNYXRoLnNpbihkdGltZS8zMDApO1xuICBjdWJlLnBvc2l0aW9uLnkgPSAwLjggKyAxKk1hdGguc2luKGR0aW1lLzMwMCk7XG4gIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcbn07XG5cbnJlbmRlcigpO1xuIl19
