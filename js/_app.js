// 1) Basic Scene Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333); // Dark background

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
camera.position.set(0, 50, 200);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio); // Crisp rendering on HDPI
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);



// 3) Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(100, 200, 100);
scene.add(dirLight);

// 4) Ground Plane (Abstract Industrial Look)
// (Optional: load texture for a more realistic industrial floor)
// const textureLoader = new THREE.TextureLoader();
// const groundTexture = textureLoader.load('assets/industrial-texture.jpg');
// groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
// groundTexture.repeat.set(10, 10);

const groundGeo = new THREE.PlaneGeometry(1000, 1000);
const groundMat = new THREE.MeshPhongMaterial({
  color: 0x444444,
  // map: groundTexture // if you have a texture
});
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotateX(-Math.PI / 2); // Make plane horizontal
scene.add(ground);

// 5) Create the 100-ton CO2 Sphere
//    1 ton CO2 ~556 m³  => 100 tons => 55,600 m³
//    Sphere volume V = (4/3) * π * r^3 => r = cbrt(3V/(4π))
const volume_100_tons = 55600;  // m^3
const radius_100_tons = Math.cbrt((3 * volume_100_tons) / (4 * Math.PI));
// ~ 23.7 meters

const sphereGeo = new THREE.SphereGeometry(radius_100_tons, 32, 32);
const sphereMat = new THREE.MeshPhongMaterial({
  color: 0x00ffff,
  opacity: 0.5,
  transparent: true
});
const co2Sphere = new THREE.Mesh(sphereGeo, sphereMat);
// Place the sphere so it sits on the ground
co2Sphere.position.set(0, radius_100_tons, 0);
scene.add(co2Sphere);

// 6) Raycasting for Tooltip
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const tooltip = document.getElementById('tooltip');

function onMouseMove(event) {
  // Convert mouse to normalized device coordinates (-1 to +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects([co2Sphere], true);
  if (intersects.length > 0) {
    // If sphere is hovered
    tooltip.style.opacity = 1; // Show tooltip
    // Position near cursor
    tooltip.style.left = (event.clientX + 10) + 'px';
    tooltip.style.top = (event.clientY + 10) + 'px';
    tooltip.innerHTML = 'This sphere represents 100 tons of CO₂';
  } else {
    tooltip.style.opacity = 0; // Hide tooltip
  }
}
window.addEventListener('mousemove', onMouseMove, false);

// 7) Render Loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// 8) Handle Resize
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
