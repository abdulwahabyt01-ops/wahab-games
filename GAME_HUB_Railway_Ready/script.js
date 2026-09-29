function scrollToGames() {
    document.getElementById("games")?.scrollIntoView({ behavior: "smooth" });
}

const games = {
    "Target Strike": "/games/target-strike/",
    "Speed Racer": "/games/speed-racer/",
    "Brain Puzzle": "/games/brain-puzzle/",
    "Battle Arena": "/games/battle-arena/",
    "Snake": "/games/snake/",
    "Brick Breaker": "/games/brick-breaker/",
    "Ping Pong": "/games/ping-pong/",
    "Memory Match": "/games/memory-match/",
    "Flappy Jump": "/games/flappy-jump/",
    "Tic Tac Toe": "/games/tic-tac-toe/"
};

function startGame(gameName) {
    const path = games[gameName];
    if (path) {
        window.location.assign(path);
        return;
    }
    alert(`🎮 ${gameName} will be added soon!`);
}

// Installable PWA support.
let deferredInstallPrompt = null;
const installButton = document.getElementById("installApp");

window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    if (installButton) installButton.hidden = false;
});

installButton?.addEventListener("click", async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    installButton.hidden = true;
});

window.addEventListener("appinstalled", () => {
    if (installButton) installButton.hidden = true;
    deferredInstallPrompt = null;
});

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch((error) => {
            console.warn("Service worker registration failed:", error);
        });
    });
}
