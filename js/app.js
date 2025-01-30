import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// SETUP SCENE AND CAMERA

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Function to create and add multiple spheres
function addSpheres(count) {
    const spheres = [];
    const maxSpheres = Math.min(count, 1); // Limit to 3 spheres
    for (let i = 0; i < maxSpheres; i++) {
        const size = Math.random() * 0.5 + 0.5; // Random size between 0.5 and 1
        const co2geometry = new THREE.SphereGeometry(size, 32, 32);
        const co2material = new THREE.MeshPhongMaterial({
            color: 0x00ffff,
            opacity: 0.5,
            transparent: true
        });
        const co2mesh = new THREE.Mesh(co2geometry, co2material);
        co2mesh.position.set(0, 0, 0);
        co2mesh.userData = { 
            speed: Math.random() * 0.01 + 0.005, // Slower speed: random value between 0.005 and 0.015
            stopY: Math.random() * 2 + 3 // Random stop position between 3 and 5
        };
        scene.add(co2mesh);
        spheres.push(co2mesh);
    }
    return spheres;
}

const spheres = addSpheres(10); // Add up to 3 spheres

// ADDING MODEL

const loader = new GLTFLoader();
loader.load('assets/city_on_the_beach.glb', function (gltf) {
    gltf.scene.scale.set(0.05, 0.05, 0.05);
    scene.add(gltf.scene);
});

// ADDING LIGHT
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5).normalize();
scene.add(light);

camera.position.z = 5;

const controls = new OrbitControls( camera, renderer.domElement );

camera.position.set( 0, 5, 5 );
controls.update();

// ANIMATION LOOP

function animate() {
    requestAnimationFrame(animate);

    // Animate spheres
    spheres.forEach(sphere => {
        if (sphere.position.y < sphere.userData.stopY) {
            sphere.position.y += sphere.userData.speed;
            sphere.scale.x += 0.01; // Scale up
            sphere.scale.y += 0.01; // Scale up
            sphere.scale.z += 0.01; // Scale up
        }
    });

    renderer.render(scene, camera);
}

animate();