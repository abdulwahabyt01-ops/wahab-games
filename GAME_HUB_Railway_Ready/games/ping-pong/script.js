
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");

const playerScoreElement = document.getElementById("playerScore");
const computerScoreElement = document.getElementById("computerScore");

const upButton = document.getElementById("upButton");
const downButton = document.getElementById("downButton");

canvas.width = 800;
canvas.height = 500;

let gameRunning = false;
let animationId;

let playerScore = 0;
let computerScore = 0;

let moveUp = false;
let moveDown = false;

const player = {
    x: 25,
    y: canvas.height / 2 - 55,
    width: 14,
    height: 110,
    speed: 7
};

const computer = {
    x: canvas.width - 39,
    y: canvas.height / 2 - 55,
    width: 14,
    height: 110,
    speed: 4.5
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 9,
    speed: 6,
    dx: 6,
    dy: 3
};


function resetBall(direction) {

    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;

    ball.dx = direction * ball.speed;

    ball.dy =
        (Math.random() * 5) - 2.5;
}


function resetGame() {

    playerScore = 0;
    computerScore = 0;

    playerScoreElement.textContent = playerScore;
    computerScoreElement.textContent = computerScore;

    player.y = canvas.height / 2 - player.height / 2;
    computer.y = canvas.height / 2 - computer.height / 2;

    resetBall(
        Math.random() > 0.5 ? 1 : -1
    );
}


function drawBackground() {

    ctx.fillStyle = "#080812";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Center line

    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 12]);

    ctx.beginPath();

    ctx.moveTo(
        canvas.width / 2,
        0
    );

    ctx.lineTo(
        canvas.width / 2,
        canvas.height
    );

    ctx.stroke();

    ctx.setLineDash([]);

    // Center circle

    ctx.beginPath();

    ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        70,
        0,
        Math.PI * 2
    );

    ctx.strokeStyle =
        "rgba(255,255,255,0.12)";

    ctx.stroke();

}


function drawPaddle(paddle, isPlayer) {

    ctx.beginPath();

    ctx.roundRect(
        paddle.x,
        paddle.y,
        paddle.width,
        paddle.height,
        7
    );

    ctx.fillStyle =
        isPlayer ? "#ff3d81" : "#4cc9f0";

    ctx.fill();

    ctx.closePath();

}


function drawBall() {

    ctx.beginPath();

    ctx.arc(
        ball.x,
        ball.y,
        ball.radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#ffffff";

    ctx.shadowBlur = 18;
    ctx.shadowColor = "#ffffff";

    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.closePath();

}


function draw() {

    drawBackground();

    drawPaddle(player, true);
    drawPaddle(computer, false);

    drawBall();

}


function movePlayer() {

    if (moveUp) {

        player.y -= player.speed;

    }

    if (moveDown) {

        player.y += player.speed;

    }

    if (player.y < 0) {

        player.y = 0;

    }

    if (
        player.y + player.height >
        canvas.height
    ) {

        player.y =
            canvas.height - player.height;

    }

}


function moveComputer() {

    const target =
        ball.y - computer.height / 2;

    if (computer.y < target) {

        computer.y += computer.speed;

    }

    if (computer.y > target) {

        computer.y -= computer.speed;

    }

    if (computer.y < 0) {

        computer.y = 0;

    }

    if (
        computer.y + computer.height >
        canvas.height
    ) {

        computer.y =
            canvas.height - computer.height;

    }

}


function checkPaddleCollision(paddle, isPlayer) {

    if (
        ball.x - ball.radius <
            paddle.x + paddle.width &&
        ball.x + ball.radius >
            paddle.x &&
        ball.y + ball.radius >
            paddle.y &&
        ball.y - ball.radius <
            paddle.y + paddle.height
    ) {

        if (isPlayer && ball.dx < 0) {

            ball.x =
                paddle.x + paddle.width +
                ball.radius;

            ball.dx = Math.abs(ball.dx);

        }

        if (!isPlayer && ball.dx > 0) {

            ball.x =
                paddle.x -
                ball.radius;

            ball.dx = -Math.abs(ball.dx);

        }

        const relativePosition =
            (ball.y -
                (paddle.y + paddle.height / 2)) /
            (paddle.height / 2);

        ball.dy =
            relativePosition * 5;

        // Slightly increase speed

        const currentSpeed =
            Math.sqrt(
                ball.dx * ball.dx +
                ball.dy * ball.dy
            );

        const newSpeed =
            Math.min(currentSpeed + 0.15, 11);

        const direction =
            ball.dx > 0 ? 1 : -1;

        ball.dx =
            direction *
            Math.sqrt(
                newSpeed * newSpeed -
                ball.dy * ball.dy
            );

    }

}


function scorePoint(playerWon) {

    if (playerWon) {

        playerScore++;

        playerScoreElement.textContent =
            playerScore;

    } else {

        computerScore++;

        computerScoreElement.textContent =
            computerScore;

    }


    if (playerScore >= 5) {

        endGame(
            "🏆 YOU WIN!",
            "You defeated the computer!"
        );

        return;

    }


    if (computerScore >= 5) {

        endGame(
            "🤖 COMPUTER WINS!",
            "Try again and beat the computer!"
        );

        return;

    }


    resetBall(
        playerWon ? 1 : -1
    );

}


function updateBall() {

    ball.x += ball.dx;
    ball.y += ball.dy;


    // Top wall

    if (
        ball.y - ball.radius <= 0
    ) {

        ball.y = ball.radius;
        ball.dy *= -1;

    }


    // Bottom wall

    if (
        ball.y + ball.radius >= canvas.height
    ) {

        ball.y =
            canvas.height - ball.radius;

        ball.dy *= -1;

    }


    checkPaddleCollision(player, true);
    checkPaddleCollision(computer, false);


    // Left side

    if (
        ball.x + ball.radius < 0
    ) {

        scorePoint(false);

    }


    // Right side

    if (
        ball.x - ball.radius > canvas.width
    ) {

        scorePoint(true);

    }

}


function gameLoop() {

    if (!gameRunning) return;

    movePlayer();
    moveComputer();
    updateBall();
    draw();

    animationId =
        requestAnimationFrame(gameLoop);

}


function startGame() {

    cancelAnimationFrame(animationId);

    resetGame();

    gameRunning = true;

    startScreen.style.display = "none";

    gameLoop();

}


function endGame(title, message) {

    gameRunning = false;

    cancelAnimationFrame(animationId);

    startScreen.innerHTML = `
        <h2>${title}</h2>

        <p>${message}</p>

        <p>
            Final Score:
            <strong>${playerScore} - ${computerScore}</strong>
        </p>

        <button id="restartButton">
            PLAY AGAIN
        </button>
    `;

    startScreen.style.display = "flex";

    document
        .getElementById("restartButton")
        .addEventListener(
            "click",
            startGame
        );

}


function keyboardDown(event) {

    if (
        event.key === "ArrowUp" ||
        event.key.toLowerCase() === "w"
    ) {

        moveUp = true;

    }

    if (
        event.key === "ArrowDown" ||
        event.key.toLowerCase() === "s"
    ) {

        moveDown = true;

    }

}


function keyboardUp(event) {

    if (
        event.key === "ArrowUp" ||
        event.key.toLowerCase() === "w"
    ) {

        moveUp = false;

    }

    if (
        event.key === "ArrowDown" ||
        event.key.toLowerCase() === "s"
    ) {

        moveDown = false;

    }

}


function setupButton(button, direction) {

    button.addEventListener(
        "pointerdown",
        () => {

            if (direction === "up") {

                moveUp = true;

            } else {

                moveDown = true;

            }

        }
    );


    button.addEventListener(
        "pointerup",
        () => {

            if (direction === "up") {

                moveUp = false;

            } else {

                moveDown = false;

            }

        }
    );


    button.addEventListener(
        "pointerleave",
        () => {

            if (direction === "up") {

                moveUp = false;

            } else {

                moveDown = false;

            }

        }
    );


    button.addEventListener(
        "pointercancel",
        () => {

            moveUp = false;
            moveDown = false;

        }
    );

}


document.addEventListener(
    "keydown",
    keyboardDown
);

document.addEventListener(
    "keyup",
    keyboardUp
);


setupButton(upButton, "up");
setupButton(downButton, "down");


startButton.addEventListener(
    "click",
    startGame
);


// Initial screen

draw();

