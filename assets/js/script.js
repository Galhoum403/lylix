import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

/* --- Modal Logic (Linked to Window for HTML access) --- */
window.openModal = function(type) {
    document.getElementById(type + '-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

window.closeModal = function(type) {
    document.getElementById(type + '-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") { 
        window.closeModal('terms'); 
        window.closeModal('privacy'); 
    }
});

/* --- Three.js Animation Logic --- */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
const container = document.getElementById('canvas-container');
if(container) {
    container.appendChild(renderer.domElement);
}

// 1. The Main Sphere
const geometry = new THREE.IcosahedronGeometry(10, 2);
const material = new THREE.MeshBasicMaterial({ 
    color: 0x00f3ff, wireframe: true, transparent: true, opacity: 0.3
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// 2. The Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 800;
const posArray = new Float32Array(particlesCount * 3);
for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 60;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.06, color: 0xbc13fe, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending
});
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

camera.position.z = 16;
let mouseX = 0; let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX / window.innerWidth - 0.5;
    mouseY = event.clientY / window.innerHeight - 0.5;
});

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Sphere subtle rotation
    sphere.rotation.y += 0.002;
    sphere.rotation.x += 0.001;

    // Pulse effect
    const scale = 1 + Math.sin(elapsedTime * 1.5) * 0.05;
    sphere.scale.set(scale, scale, scale);

    // Particles movement
    particlesMesh.rotation.y = -elapsedTime * 0.03;
    particlesMesh.rotation.x = mouseY * 0.3;
    
    // Interactive mouse movement
    sphere.rotation.y += 0.03 * (mouseX - sphere.rotation.y);
    sphere.rotation.x += 0.03 * (mouseY - sphere.rotation.x);

    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});