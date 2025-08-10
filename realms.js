import * as THREE from 'three';

const realmModal = document.getElementById('realm-modal');
const modalBody = document.getElementById('modal-body');
const closeButton = document.querySelector('.close-button');

const realmData = {
    scp: {
        name: "Forsaken Cathedral",
        icon: 'scp-icon.png',
        position: [-15, 4, 0],
        description: "Containment breach in progress. SCP-■■■■ has been sighted. Proceed with extreme caution.",
        color: 0xff0000
    },
    minecraft: {
        name: "Deltarune Dark World",
        icon: 'minecraft-icon.png',
        position: [15, 4, 0],
        description: "A world of blocks and darkness. The fountains must be sealed.",
        color: 0x00ff00
    },
    squid: {
        name: "Sprunki's Game",
        icon: 'squid-game-icon.png',
        position: [0, 4, -15],
        description: "A deadly game of sound and silence. Make a noise to survive, but don't get caught.",
        color: 0xff00ff
    },
    fnf: {
        name: "Animatronic Showdown",
        icon: 'fnf-icon.png',
        position: [0, 4, 15],
        description: "A rhythm battle against malfunctioning mascots. Don't miss a beat.",
        color: 0xffff00
    }
};

let audioContext;
let portalAudio;

function createPortal(data) {
    const textureLoader = new THREE.TextureLoader();
    const portalTexture = textureLoader.load('portal-texture.png');

    const geometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
    const material = new THREE.MeshBasicMaterial({ map: portalTexture });
    const portal = new THREE.Mesh(geometry, material);
    portal.position.set(data.position[0], data.position[1], data.position[2]);
    portal.userData = { id: data.id, ...data };

    const pointLight = new THREE.PointLight(data.color, 2, 20);
    pointLight.position.set(data.position[0], data.position[1], data.position[2]);

    const iconTexture = textureLoader.load(data.icon);
    const iconMaterial = new THREE.SpriteMaterial({ map: iconTexture });
    const iconSprite = new THREE.Sprite(iconMaterial);
    iconSprite.position.set(data.position[0], data.position[1] + 3.5, data.position[2]);
    iconSprite.scale.set(1.5, 1.5, 1);
    
    return { portal, light: pointLight, icon: iconSprite };
}


export function initRealms(scene) {
    const interactiveObjects = [];
    Object.keys(realmData).forEach(key => {
        const data = { id: key, ...realmData[key] };
        const { portal, light, icon } = createPortal(data);
        scene.add(portal);
        scene.add(light);
        scene.add(icon);
        interactiveObjects.push(portal);
    });

    closeButton.addEventListener('click', () => {
        realmModal.classList.add('hidden');
        if(portalAudio && audioContext.state === 'running') {
            portalAudio.stop();
        }
    });

    return interactiveObjects;
}

async function playSound(url) {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);
    return source;
}

function renderFNFRealm() {
    return `
        <div class="fnf-stage">
            <h1>Animatronic Showdown</h1>
            <div id="fnaf-opponent" style="background-image: url('fnaf-glitch.png');"></div>
            <div class="arrow-track">
                <span class="arrow">⬅️</span>
                <span class="arrow">⬇️</span>
                <span class="arrow">⬆️</span>
                <span class="arrow">➡️</span>
            </div>
            <p>Their moves are glitching... Match the pattern!</p>
        </div>
    `;
}

function renderGenericRealm(id) {
    const data = realmData[id];
    return `
        <h1>${data.name}</h1>
        <p>${data.description}</p>
        <p style="text-align:center; margin-top: 50px; font-family: 'VT323', monospace; font-size: 24px;">[ SIMULATION NOT FOUND ]<br/>[ DEEPER EXPLORATION REQUIRED ]</p>
    `;
}

export async function onPortalClick(id) {
    console.log(`Clicked on portal: ${id}`);
    portalAudio = await playSound('portal-enter.mp3').catch(console.error);
    
    if (id === 'fnf') {
        modalBody.innerHTML = renderFNFRealm();
    } else {
        modalBody.innerHTML = renderGenericRealm(id);
        if(id === 'scp') {
            playSound('scp-alert.mp3').catch(console.error);
        }
    }
    
    realmModal.classList.remove('hidden');
}

