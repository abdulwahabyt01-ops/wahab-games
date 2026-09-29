const arena = document.getElementById("arena");
const player = document.getElementById("player");

const startButton = document.getElementById("startButton");
const startScreen = document.getElementById("startScreen");

const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");

const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const upButton = document.getElementById("upButton");
const downButton = document.getElementById("downButton");


let score = 0;
let time = 30;

let gameRunning = false;

let playerX = 0;
let playerY = 0;

let collectible = null;

let timer = null;
let gameLoop = null;


const keys = {
    left: false,
    right: false,
    up: false,
    down: false
};


/* START GAME */

startButton.addEventListener("click", startGame);


function startGame() {

    score = 0;
    time = 30;

    scoreDisplay.textContent = score;
    timeDisplay.textContent = time;

    gameRunning = true;

    startScreen.style.display = "none";

    playerX = arena.clientWidth / 2 - 27;
    playerY = arena.clientHeight / 2 - 27;

    updatePlayer();

    createCollectible();

    clearInterval(timer);
    clearInterval(gameLoop);

    timer = setInterval(updateTimer, 1000);

    gameLoop = setInterval(updateGame, 20);
}


/* PLAYER MOVEMENT */

function updateGame() {

    if (!gameRunning) {
        return;
    }

    const speed = 5;

    if (keys.left) {
        playerX -= speed;
    }

    if (keys.right) {
        playerX += speed;
    }

    if (keys.up) {
        playerY -= speed;
    }

    if (keys.down) {
        playerY += speed;
    }


    const maxX = arena.clientWidth - player.offsetWidth;
    const maxY = arena.clientHeight - player.offsetHeight;


    if (playerX < 0) {
        playerX = 0;
    }

    if (playerX > maxX) {
        playerX = maxX;
    }

    if (playerY < 0) {
        playerY = 0;
    }

    if (playerY > maxY) {
        playerY = maxY;
    }


    updatePlayer();

    checkCollision();
}


function updatePlayer() {

    player.style.left = playerX + "px";
    player.style.top = playerY + "px";

    player.style.transform = "none";
}


/* CREATE COLLECTIBLE */

function createCollectible() {

    if (collectible) {
        collectible.remove();
    }


    collectible = document.createElement("div");

    collectible.className = "collectible";


    const maxX = arena.clientWidth - 45;
    const maxY = arena.clientHeight - 45;


    const randomX =
        Math.floor(Math.random() * maxX) + 5;

    const randomY =
        Math.floor(Math.random() * maxY) + 5;


    collectible.style.left = randomX + "px";
    collectible.style.top = randomY + "px";


    arena.appendChild(collectible);
}


/* COLLISION */

function checkCollision() {

    if (!collectible) {
        return;
    }


    const playerRect = player.getBoundingClientRect();
    const collectibleRect = collectible.getBoundingClientRect();


    const touching =
        playerRect.left < collectibleRect.right &&
        playerRect.right > collectibleRect.left &&
        playerRect.top < collectibleRect.bottom &&
        playerRect.bottom > collectibleRect.top;


    if (touching) {

        score += 10;

        scoreDisplay.textContent = score;

        createCollectible();
    }
}


/* TIMER */

function updateTimer() {

    if (!gameRunning) {
        return;
    }


    time--;

    timeDisplay.textContent = time;


    if (time <= 0) {

        endGame();
    }
}


/* END GAME */

function endGame() {

    gameRunning = false;

    clearInterval(timer);
    clearInterval(gameLoop);


    if (collectible) {
        collectible.remove();
        collectible = null;
    }


    startScreen.innerHTML = `
        <h2>🏆 Arena Complete!</h2>

        <p>
            Your final score:
            <strong>${score}</strong>
        </p>

        <button id="restartButton">
            PLAY AGAIN
        </button>
    `;


    startScreen.style.display = "flex";


    document
        .getElementById("restartButton")
        .addEventListener("click", startGame);
}


/* KEYBOARD CONTROLS */

document.addEventListener("keydown", function(event) {

    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        keys.left = true;
    }

    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        keys.right = true;
    }

    if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") {
        keys.up = true;
    }

    if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") {
        keys.down = true;
    }
});


document.addEventListener("keyup", function(event) {

    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        keys.left = false;
    }

    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        keys.right = false;
    }

    if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") {
        keys.up = false;
    }

    if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") {
        keys.down = false;
    }
});


/* TOUCH / MOUSE CONTROLS */

function holdButton(button, direction) {

    button.addEventListener("pointerdown", function(event) {

        event.preventDefault();

        keys[direction] = true;
    });


    button.addEventListener("pointerup", function(event) {

        event.preventDefault();

        keys[direction] = false;
    });


    button.addEventListener("pointerleave", function() {

        keys[direction] = false;
    });
}


holdButton(leftButton, "left");
holdButton(rightButton, "right");
holdButton(upButton, "up");
holdButton(downButton, "down");