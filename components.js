const episodes = [
    { 
        title: "Episode 1: The Glitching Garden",
        description: "Dandy's prize-winning sunflowers are pixelating into 8-bit sprites. The source seems to be coming from a blocky, digital dimension.",
        objective: "Objective: Enter the Minecraft/Deltarune portal and find the source of the corruption."
    },
    { 
        title: "Episode 2: The Silent Scream",
        description: "A faint, repeating anomaly has been detected. It's classified as SCP-■■■■, and its signal is strongest near the old cathedral.",
        objective: "Objective: Investigate the Forsaken/SCP portal, but don't get seen. They don't like visitors."
    },
    { 
        title: "Episode 3: Rhythmic Dread",
        description: "The animatronics from that abandoned pizzeria are... performing? Their movements are synced to a terrifying beat. Maybe you can out-perform them.",
        objective: "Objective: Challenge the FNaF animatronics in an FNF battle."
    },
    { 
        title: "Episode 4: The Sound of Survival",
        description: "A high-stakes game is being broadcast from a hidden realm. The platforms only appear if you make a sound. Sprunki might be useful here.",
        objective: "Objective: Survive the Squid Game/Sprunki arena."
    }
];

const chatUsers = ["RobloxFan2012", "DandyDevotee", "BFDI_enjoyer", "SCP-Watcher", "GlitchHunter", "xX_GamerPro_Xx"];
const chatMessagesPool = [
    "Whoa, did you guys see that portal flicker?",
    "I think I saw Four near the central plaza.",
    "Anyone have extra resources? The economy is tanking today.",
    "Just got back from the cathedral... never again.",
    "lol someone ragequit the FNF stage",
    "The episode generator gave me a weird one about finding a lost Wubbox.",
    "Be careful, borders shifted. My garden is now in enemy territory.",
    "I found a weird floppy disk item, says it needs a 'Win95' emulator?",
    "This world is so weird and I love it."
];

let currentEpisodeIndex = 0;

export function updateEpisode() {
    const container = document.getElementById('episode-container');
    const episode = episodes[currentEpisodeIndex];
    container.innerHTML = `
        <div class="episode-card">
            <h2>${episode.title}</h2>
            <p>${episode.description}</p>
            <p class="objective">${episode.objective}</p>
        </div>
    `;
    currentEpisodeIndex = (currentEpisodeIndex + 1) % episodes.length;
}

export function addChatMessage(type = 'user') {
    const container = document.querySelector('.chat-messages');
    let author, message;

    if (type === 'system') {
        author = "SYSTEM";
        message = "World state synchronizing... Welcome to the anomaly.";
    } else {
        author = chatUsers[Math.floor(Math.random() * chatUsers.length)];
        message = chatMessagesPool[Math.floor(Math.random() * chatMessagesPool.length)];
    }

    const messageEl = document.createElement('div');
    messageEl.classList.add('chat-message');
    if (type === 'system') {
        messageEl.classList.add('system');
    }
    messageEl.innerHTML = `<strong>${author}:</strong> ${message}`;
    
    container.appendChild(messageEl);
    container.scrollTop = container.scrollHeight;
}

