"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var THREE = require("three");
var OrbitControls_1 = require("three/examples/jsm/controls/OrbitControls");
var scene;
var camera;
var renderer;
var orbs = [];
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
function init() {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    // Lighting
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    var pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    // Create orbs
    for (var i = 0; i < 10; i++) {
        var geometry = new THREE.SphereGeometry(0.3, 32, 32);
        var material = new THREE.MeshStandardMaterial({
            color: new THREE.Color("hsl(".concat(Math.random() * 360, ", 100%, 50%)")),
            emissive: new THREE.Color(0x222222),
            emissiveIntensity: 0.5,
        });
        var orb = new THREE.Mesh(geometry, material);
        orb.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5);
        orbs.push(orb);
        scene.add(orb);
    }
    // Controls
    var controls = new OrbitControls_1.OrbitControls(camera, renderer.domElement);
    // Event listeners
    window.addEventListener('mousemove', onMouseMove);
    // Animation
    animate();
}
function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(orbs);
    // Reset all orbs
    orbs.forEach(function (orb) {
        var material = orb.material;
        material.emissiveIntensity = 0.5;
        orb.scale.set(1, 1, 1);
    });
    // Highlight hovered orb
    for (var _i = 0, intersects_1 = intersects; _i < intersects_1.length; _i++) {
        var intersect = intersects_1[_i];
        var orb = intersect.object;
        var material = orb.material;
        material.emissiveIntensity = 1;
        orb.scale.set(1.2, 1.2, 1.2);
    }
}
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
// Resize handling
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
init();
