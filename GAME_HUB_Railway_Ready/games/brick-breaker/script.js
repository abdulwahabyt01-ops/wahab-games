
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");

const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");

const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");

canvas.width = 800;
canvas.height = 500;

let gameRunning = false;
let animationId;

let score = 0;
let lives = 3;

const paddle = {
    width: 120,
    height: 14,
    x: canvas.width / 2 - 60,
    y: canvas.height - 35,
    speed: 8
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height - 60,
    radius: 9,
    speed: 5,
    dx: 4,
    dy: -4
};

const brickSettings = {
    rows: 5,
    columns: 10,
    width: 68,
    height: 22,
    gap: 8,
    top: 55,
    left: 30
};

let bricks = [];

let moveLeft = false;
let moveRight = false;


function createBricks() {

    bricks = [];

    for (let row = 0; row < brickSettings.rows; row++) {

        for (let column = 0; column < brickSettings.columns; column++) {

            bricks.push({
                x:
                    brickSettings.left +
                    column * (brickSettings.width + brickSettings.gap),

                y:
                    brickSettings.top +
                    row * (brickSettings.height + brickSettings.gap),

                width: brickSettings.width,
                height: brickSettings.height,

                alive: true
            });

        }
    }
}


function resetBall() {

    ball.x = canvas.width / 2;
    ball.y = canvas.height - 60;

    ball.dx = Math.random() > 0.5 ? 4 : -4;
    ball.dy = -4;
}


function resetGame() {

    score = 0;
    lives = 3;

    scoreElement.textContent = score;
    livesElement.textContent = lives;

    paddle.x = canvas.width / 2 - paddle.width / 2;

    createBricks();
    resetBall();
}


function drawBackground() {

    ctx.fillStyle = "#080812";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(255,255,255,0.035)";
    ctx.lineWidth = 1;

    for (let x = 0; x < canvas.width; x += 40) {

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();

    }

    for (let y = 0; y < canvas.height; y += 40) {

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();

    }
}


function drawPaddle() {

    ctx.beginPath();

    ctx.roundRect(
        paddle.x,
        paddle.y,
        paddle.width,
        paddle.height,
        7
    );

    ctx.fillStyle = "#ff3d81";
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
    ctx.shadowColor = "#ff3d81";
    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.closePath();
}


function drawBricks() {

    bricks.forEach((brick, index) => {

        if (!brick.alive) return;

        const row = Math.floor(index / brickSettings.columns);

        const colors = [
            "#ff3d81",
            "#ff6b35",
            "#ffd166",
            "#06d6a0",
            "#4cc9f0"
        ];

        ctx.fillStyle = colors[row % colors.length];

        ctx.beginPath();

        ctx.roundRect(
            brick.x,
            brick.y,
            brick.width,
            brick.height,
            5
        );

        ctx.fill();

        ctx.closePath();

    });
}


function draw() {

    drawBackground();
    drawBricks();
    drawPaddle();
    drawBall();

}


function movePaddle() {

    if (moveLeft) {

        paddle.x -= paddle.speed;

    }

    if (moveRight) {

        paddle.x += paddle.speed;

    }

    if (paddle.x < 0) {

        paddle.x = 0;

    }

    if (paddle.x + paddle.width > canvas.width) {

        paddle.x = canvas.width - paddle.width;

    }
}


function collisionDetection() {

    bricks.forEach((brick) => {

        if (!brick.alive) return;

        if (
            ball.x + ball.radius > brick.x &&
            ball.x - ball.radius < brick.x + brick.width &&
            ball.y + ball.radius > brick.y &&
            ball.y - ball.radius < brick.y + brick.height
        ) {

            brick.alive = false;

            ball.dy *= -1;

            score += 10;

            scoreElement.textContent = score;

        }

    });

}


function checkWin() {

    const remaining = bricks.some(brick => brick.alive);

    if (!remaining) {

        endGame(
            "🎉 YOU WIN!",
            "Amazing! You destroyed every brick!"
        );

    }

}


function loseLife() {

    lives--;

    livesElement.textContent = lives;

    if (lives <= 0) {

        endGame(
            "GAME OVER",
            "You ran out of lives!"
        );

        return;

    }

    resetBall();

}


function updateBall() {

    ball.x += ball.dx;
    ball.y += ball.dy;


    // Left wall

    if (ball.x - ball.radius <= 0) {

        ball.x = ball.radius;
        ball.dx *= -1;

    }


    // Right wall

    if (ball.x + ball.radius >= canvas.width) {

        ball.x = canvas.width - ball.radius;
        ball.dx *= -1;

    }


    // Top wall

    if (ball.y - ball.radius <= 0) {

        ball.y = ball.radius;
        ball.dy *= -1;

    }


    // Paddle collision

    if (
        ball.y + ball.radius >= paddle.y &&
        ball.y - ball.radius <= paddle.y + paddle.height &&
        ball.x >= paddle.x &&
        ball.x <= paddle.x + paddle.width &&
        ball.dy > 0
    ) {

        ball.y = paddle.y - ball.radius;

        const hitPosition =
            (ball.x - paddle.x) / paddle.width;

        const angle =
            (hitPosition - 0.5) * Math.PI * 0.9;

        const speed =
            Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);

        ball.dx = Math.sin(angle) * speed;

        ball.dy = -Math.cos(angle) * speed;

    }


    // Bottom

    if (ball.y - ball.radius > canvas.height) {

        loseLife();

    }


    collisionDetection();
    checkWin();

}


function gameLoop() {

    if (!gameRunning) return;

    movePaddle();
    updateBall();
    draw();

    animationId = requestAnimationFrame(gameLoop);

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
        <p>Final Score: <strong>${score}</strong></p>
        <button id="restartButton">PLAY AGAIN</button>
    `;

    startScreen.style.display = "flex";

    document
        .getElementById("restartButton")
        .addEventListener("click", startGame);

}


function keyboardDown(event) {

    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {

        moveLeft = true;

    }

    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {

        moveRight = true;

    }

}


function keyboardUp(event) {

    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {

        moveLeft = false;

    }

    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {

        moveRight = false;

    }

}


function setupButton(button, direction) {

    button.addEventListener("pointerdown", () => {

        if (direction === "left") {

            moveLeft = true;

        } else {

            moveRight = true;

        }

    });

    button.addEventListener("pointerup", () => {

        if (direction === "left") {

            moveLeft = false;

        } else {

            moveRight = false;

        }

    });

    button.addEventListener("pointerleave", () => {

        if (direction === "left") {

            moveLeft = false;

        } else {

            moveRight = false;

        }

    });

}


document.addEventListener("keydown", keyboardDown);
document.addEventListener("keyup", keyboardUp);

setupButton(leftButton, "left");
setupButton(rightButton, "right");

startButton.addEventListener("click", startGame);


// Draw the game before it starts

createBricks();
draw();

