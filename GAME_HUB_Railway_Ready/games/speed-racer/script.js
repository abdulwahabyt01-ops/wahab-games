const road = document.getElementById("road");
const player = document.getElementById("player");
const startButton = document.getElementById("startButton");
const startScreen = document.getElementById("startScreen");

const scoreDisplay = document.getElementById("score");
const speedDisplay = document.getElementById("speed");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
let playerX = 50;
let score = 0;
let speed = 1;
let gameRunning = false;

let enemies = [];
let gameLoop;
let enemyTimer;

const keys = {
    left: false,
    right: false
};


startButton.addEventListener("click", startGame);


document.addEventListener("keydown", function(event) {

    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        keys.left = true;
    }

    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        keys.right = true;
    }

});


document.addEventListener("keyup", function(event) {

    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        keys.left = false;
    }

    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        keys.right = false;
    }

});
leftButton.addEventListener("touchstart", function(event) {
    event.preventDefault();
    keys.left = true;
});

leftButton.addEventListener("touchend", function(event) {
    event.preventDefault();
    keys.left = false;
});

rightButton.addEventListener("touchstart", function(event) {
    event.preventDefault();
    keys.right = true;
});

rightButton.addEventListener("touchend", function(event) {
    event.preventDefault();
    keys.right = false;
});
leftButton.addEventListener("mousedown", function() {
    keys.left = true;
});

leftButton.addEventListener("mouseup", function() {
    keys.left = false;
});

rightButton.addEventListener("mousedown", function() {
    keys.right = true;
});

rightButton.addEventListener("mouseup", function() {
    keys.right = false;
});


function startGame() {

    score = 0;
    speed = 1;
    playerX = 50;

    scoreDisplay.textContent = score;
    speedDisplay.textContent = speed;

    gameRunning = true;

    startScreen.style.display = "none";

    removeEnemies();

    player.style.left = "calc(50% - 30px)";

    gameLoop = requestAnimationFrame(updateGame);

    enemyTimer = setInterval(createEnemy, 1000);
}


function updateGame() {

    if (!gameRunning) {
        return;
    }


    movePlayer();

    moveEnemies();

    checkCollisions();

    score++;

    scoreDisplay.textContent = score;


    if (score % 500 === 0) {

        speed++;

        speedDisplay.textContent = speed;
    }


    gameLoop = requestAnimationFrame(updateGame);
}


function movePlayer() {

    if (keys.left) {
        playerX -= 0.8;
    }

    if (keys.right) {
        playerX += 0.8;
    }


    if (playerX < 8) {
        playerX = 8;
    }

    if (playerX > 92) {
        playerX = 92;
    }


    player.style.left = `calc(${playerX}% - 30px)`;
}


function createEnemy() {

    if (!gameRunning) {
        return;
    }


    const enemy = document.createElement("div");

    enemy.className = "car enemy";

    enemy.textContent = "🚗";


    const lanes = [20, 50, 80];

    const lane = lanes[Math.floor(Math.random() * lanes.length)];


    enemy.style.left = `calc(${lane}% - 30px)`;

    enemy.dataset.y = "-90";


    road.appendChild(enemy);

    enemies.push(enemy);
}


function moveEnemies() {

    enemies.forEach((enemy, index) => {

        let y = Number(enemy.dataset.y);

        y += 3 + speed * 0.5;

        enemy.dataset.y = y;

        enemy.style.top = `${y}px`;


        if (y > road.clientHeight + 100) {

            enemy.remove();

            enemies.splice(index, 1);
        }

    });
}


function checkCollisions() {

    const playerRect = player.getBoundingClientRect();


    enemies.forEach(enemy => {

        const enemyRect = enemy.getBoundingClientRect();


        if (
            playerRect.left < enemyRect.right &&
            playerRect.right > enemyRect.left &&
            playerRect.top < enemyRect.bottom &&
            playerRect.bottom > enemyRect.top
        ) {

            endGame();
        }

    });
}


function endGame() {

    if (!gameRunning) {
        return;
    }


    gameRunning = false;


    cancelAnimationFrame(gameLoop);

    clearInterval(enemyTimer);


    removeEnemies();


    startScreen.innerHTML = `
        <h2>🏁 Race Over!</h2>

        <p>
            Your score:
            <strong>${score}</strong>
        </p>

        <button id="restartButton">
            RACE AGAIN
        </button>
    `;


    startScreen.style.display = "block";


    document
        .getElementById("restartButton")
        .addEventListener("click", startGame);
}


function removeEnemies() {

    enemies.forEach(enemy => enemy.remove());

    enemies = [];
}