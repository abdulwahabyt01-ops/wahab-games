const gameArea = document.getElementById("gameArea");
const startButton = document.getElementById("startButton");
const message = document.getElementById("message");

const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");

let score = 0;
let timeLeft = 30;
let gameRunning = false;
let timer;


startButton.addEventListener("click", startGame);


function startGame() {

    score = 0;
    timeLeft = 30;
    gameRunning = true;

    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;

    message.style.display = "none";

    createTarget();

    timer = setInterval(() => {

        timeLeft--;

        timeDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame();
        }

    }, 1000);
}


function createTarget() {

    if (!gameRunning) {
        return;
    }

    const oldTarget = document.querySelector(".target");

    if (oldTarget) {
        oldTarget.remove();
    }


    const target = document.createElement("div");

    target.className = "target";


    const maxX = gameArea.clientWidth - 65;
    const maxY = gameArea.clientHeight - 65;


    const x = Math.random() * maxX;
    const y = Math.random() * maxY;


    target.style.left = `${x}px`;
    target.style.top = `${y}px`;


    target.addEventListener("click", hitTarget);


    gameArea.appendChild(target);
}


function hitTarget(event) {

    event.stopPropagation();

    if (!gameRunning) {
        return;
    }

    score++;

    scoreDisplay.textContent = score;

    createTarget();
}


function endGame() {

    gameRunning = false;

    clearInterval(timer);


    const target = document.querySelector(".target");

    if (target) {
        target.remove();
    }


    message.innerHTML = `
        <h2>🎯 Game Over!</h2>

        <p>
            Your final score is
            <strong>${score}</strong>
        </p>

        <button id="restartButton">
            PLAY AGAIN
        </button>
    `;


    message.style.display = "block";


    document
        .getElementById("restartButton")
        .addEventListener("click", startGame);
}