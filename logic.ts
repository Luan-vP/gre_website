import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let orbs: THREE.Mesh[] = [];
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

function init() {
  // Scene setup
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  // Create orbs
  for (let i = 0; i < 10; i++) {
    const geometry = new THREE.SphereGeometry(0.3, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(`hsl(${Math.random() * 360}, 100%, 50%)`),
      emissive: new THREE.Color(0x222222),
      emissiveIntensity: 0.5,
    });

    const orb = new THREE.Mesh(geometry, material);
    orb.position.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 5
    );
    orbs.push(orb);
    scene.add(orb);
  }

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);

  // Event listeners
  window.addEventListener('mousemove', onMouseMove);

  // Animation
  animate();
}

function onMouseMove(event: MouseEvent) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(orbs);

  // Reset all orbs
  orbs.forEach((orb) => {
    const material = orb.material as THREE.MeshStandardMaterial;
    material.emissiveIntensity = 0.5;
    orb.scale.set(1, 1, 1);
  });

  // Highlight hovered orb
  for (const intersect of intersects) {
    const orb = intersect.object as THREE.Mesh;
    const material = orb.material as THREE.MeshStandardMaterial;
    material.emissiveIntensity = 1;
    orb.scale.set(1.2, 1.2, 1.2);
  }
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// Resize handling
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

init();