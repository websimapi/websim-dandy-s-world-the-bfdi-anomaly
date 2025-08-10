import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { updateEpisode, addChatMessage } from './components.js';
import { initRealms, onPortalClick } from './realms.js';

let scene, camera, renderer, controls;
let raycaster, mouse;
let interactiveObjects = [];

function init() {
    // Scene Setup
    scene = new THREE.Scene();
    const textureLoader = new THREE.TextureLoader();
    const bgTexture = textureLoader.load('hub-bg.png');
    scene.background = bgTexture;
    scene.fog = new THREE.Fog(0x1d0d21, 10, 100);

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 20);

    // Renderer
    const canvas = document.getElementById('bg');
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 5;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI / 2 - 0.1;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffeebb, 1);
    directionalLight.position.set(-1, 2, 4);
    scene.add(directionalLight);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x442255, side: THREE.DoubleSide });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // Characters
    const dandyTexture = textureLoader.load('dandy-character.png');
    const dandyMaterial = new THREE.SpriteMaterial({ map: dandyTexture });
    const dandySprite = new THREE.Sprite(dandyMaterial);
    dandySprite.position.set(-8, 2, -5);
    dandySprite.scale.set(4, 4, 1);
    scene.add(dandySprite);

    const bfdiTexture = textureLoader.load('bfdi-character.png');
    const bfdiMaterial = new THREE.SpriteMaterial({ map: bfdiTexture });
    const bfdiSprite = new THREE.Sprite(bfdiMaterial);
    bfdiSprite.position.set(8, 1.5, -3);
    bfdiSprite.scale.set(3, 3, 1);
    scene.add(bfdiSprite);

    // Raycasting for interaction
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    window.addEventListener('click', onClick, false);

    // Create Realm Portals
    interactiveObjects = initRealms(scene);

    // Hide loading screen
    document.getElementById('loading-screen').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
    }, 1000);

    // Start UI updates
    updateEpisode();
    setInterval(addChatMessage, 5000);
    addChatMessage('system'); // Initial system message

    // Start Animation Loop
    animate();
}

function onClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(interactiveObjects);

    if (intersects.length > 0) {
        onPortalClick(intersects[0].object.userData.id);
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize, false);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    
    // Animate portals
    interactiveObjects.forEach(portal => {
        portal.rotation.y += 0.01;
    });

    renderer.render(scene, camera);
}

init();

