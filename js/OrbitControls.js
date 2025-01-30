// 2) OrbitControls with Limits
const controls = new THREE.OrbitControls(camera, renderer.domElement);
// Limit zoom/pan to about ±20% from initial camera distance
controls.minDistance = 160;  // ~20% closer than default 200
controls.maxDistance = 240;  // ~20% farther
controls.enablePan = false;  // disable panning