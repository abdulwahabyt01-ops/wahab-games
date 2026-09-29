const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startButton = document.getElementById("startButton");
const startScreen = document.getElementById("startScreen");

const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");

const upButton = document.getElementById("upButton");
const downButton = document.getElementById("downButton");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");


const gridSize = 20;

let snake = [];
let food = {};

let direction = "right";
let nextDirection = "right";

let score = 0;
let highScore = Number(localStorage.getItem("snakeHighScore")) || 0;

let gameRunning = false;
let gameLoop = null;


highScoreDisplay.textContent = highScore;


/* START GAME */

startButton.addEventListener("click", startGame);


function startGame() {

    canvas.width = 600;
    canvas.height = 600;

    score = 0;

    scoreDisplay.textContent = score;

    direction = "right";
    nextDirection = "right";

    snake = [
        { x: 8, y: 10 },
        { x: 7, y: 10 },
        { x: 6, y: 10 }
    ];

    createFood();

    gameRunning = true;

    startScreen.style.display = "none";

    clearInterval(gameLoop);

    gameLoop = setInterval(updateGame, 120);

    drawGame();
}


/* GAME UPDATE */

function updateGame() {

    if (!gameRunning) {
        return;
    }


    direction = nextDirection;


    const head = {
        x: snake[0].x,
        y: snake[0].y
    };


    if (direction === "up") {
        head.y--;
    }

    if (direction === "down") {
        head.y++;
    }

    if (direction === "left") {
        head.x--;
    }

    if (direction === "right") {
        head.x++;
    }


    /* WALL COLLISION */

    if (
        head.x < 0 ||
        head.x >= canvas.width / gridSize ||
        head.y < 0 ||
        head.y >= canvas.height / gridSize
    ) {

        endGame();

        return;
    }


    /* SELF COLLISION */

    for (let part of snake) {

        if (
            head.x === part.x &&
            head.y === part.y
        ) {

            endGame();

            return;
        }
    }


    snake.unshift(head);


    /* FOOD */

    if (
        head.x === food.x &&
        head.y === food.y
    ) {

        score += 10;

        scoreDisplay.textContent = score;

        if (score > highScore) {

            highScore = score;

            highScoreDisplay.textContent = highScore;

            localStorage.setItem(
                "snakeHighScore",
                highScore
            );
        }

        createFood();

    } else {

        snake.pop();
    }


    drawGame();
}


/* DRAW GAME */

function drawGame() {

    ctx.fillStyle = "#101010";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* GRID */

    ctx.strokeStyle = "#191919";

    ctx.lineWidth = 1;


    for (
        let x = 0;
        x <= canvas.width;
        x += gridSize
    ) {

        ctx.beginPath();

        ctx.moveTo(x, 0);

        ctx.lineTo(x, canvas.height);

        ctx.stroke();
    }


    for (
        let y = 0;
        y <= canvas.height;
        y += gridSize
    ) {

        ctx.beginPath();

        ctx.moveTo(0, y);

        ctx.lineTo(canvas.width, y);

        ctx.stroke();
    }


    /* FOOD */

    ctx.fillStyle = "#ff1744";

    ctx.beginPath();

    ctx.arc(
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        7,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* SNAKE */

    snake.forEach((part, index) => {

        ctx.fillStyle =
            index === 0
                ? "#00e5ff"
                : "#00b8d4";


        ctx.fillRect(
            part.x * gridSize + 1,
            part.y * gridSize + 1,
            gridSize - 2,
            gridSize - 2
        );

    });
}


/* CREATE FOOD */

function createFood() {

    let validPosition = false;


    while (!validPosition) {

        food = {

            x: Math.floor(
                Math.random() *
                (canvas.width / gridSize)
            ),

            y: Math.floor(
                Math.random() *
                (canvas.height / gridSize)
            )
        };


        validPosition = true;


        for (let part of snake) {

            if (
                food.x === part.x &&
                food.y === part.y
            ) {

                validPosition = false;

                break;
            }
        }
    }
}


/* END GAME */

function endGame() {

    gameRunning = false;

    clearInterval(gameLoop);


    startScreen.innerHTML = `
        <h2>🐍 Game Over!</h2>

        <p>
            Your Score:
            <strong>${score}</strong>
            <br><br>
            High Score:
            <strong>${highScore}</strong>
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


/* CHANGE DIRECTION */

function changeDirection(newDirection) {

    if (!gameRunning) {
        return;
    }


    if (
        newDirection === "up" &&
        direction !== "down"
    ) {

        nextDirection = "up";
    }


    if (
        newDirection === "down" &&
        direction !== "up"
    ) {

        nextDirection = "down";
    }


    if (
        newDirection === "left" &&
        direction !== "right"
    ) {

        nextDirection = "left";
    }


    if (
        newDirection === "right" &&
        direction !== "left"
    ) {

        nextDirection = "right";
    }
}


/* KEYBOARD */

document.addEventListener("keydown", function(event) {

    const key = event.key.toLowerCase();


    if (
        key === "arrowup" ||
        key === "w"
    ) {

        event.preventDefault();

        changeDirection("up");
    }


    if (
        key === "arrowdown" ||
        key === "s"
    ) {

        event.preventDefault();

        changeDirection("down");
    }


    if (
        key === "arrowleft" ||
        key === "a"
    ) {

        event.preventDefault();

        changeDirection("left");
    }


    if (
        key === "arrowright" ||
        key === "d"
    ) {

        event.preventDefault();

        changeDirection("right");
    }
});


/* TOUCH BUTTONS */

upButton.addEventListener("pointerdown", function() {
    changeDirection("up");
});

downButton.addEventListener("pointerdown", function() {
    changeDirection("down");
});

leftButton.addEventListener("pointerdown", function() {
    changeDirection("left");
});

rightButton.addEventListener("pointerdown", function() {
    changeDirection("right");
});