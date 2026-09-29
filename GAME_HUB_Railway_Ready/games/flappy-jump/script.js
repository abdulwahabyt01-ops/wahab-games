
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");

const scoreElement = document.getElementById("score");
const bestScoreElement = document.getElementById("bestScore");


canvas.width = 600;
canvas.height = 700;


let gameRunning = false;
let animationId;

let score = 0;

let bestScore =
    Number(localStorage.getItem("flappyBestScore")) || 0;

bestScoreElement.textContent = bestScore;


const bird = {
    x: 130,
    y: canvas.height / 2,
    radius: 18,

    velocity: 0,

    gravity: 0.45,
    jumpPower: -8
};


const pipeSettings = {

    width: 75,

    gap: 180,

    speed: 3.2,

    distance: 260

};


let pipes = [];


function createPipe(x) {

    const minimumTop = 80;
    const maximumTop =
        canvas.height -
        pipeSettings.gap -
        100;

    const topHeight =
        Math.random() *
        (maximumTop - minimumTop) +
        minimumTop;


    pipes.push({

        x: x,

        top: topHeight,

        bottom:
            topHeight +
            pipeSettings.gap,

        passed: false

    });

}


function resetGame() {

    score = 0;

    scoreElement.textContent = "0";

    bird.x = 130;
    bird.y = canvas.height / 2;
    bird.velocity = 0;

    pipes = [];

    createPipe(650);
    createPipe(650 + pipeSettings.distance);

}


function drawBackground() {

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            canvas.height
        );

    gradient.addColorStop(
        0,
        "#241b4b"
    );

    gradient.addColorStop(
        1,
        "#10152e"
    );

    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Stars

    ctx.fillStyle =
        "rgba(255,255,255,0.45)";

    for (
        let i = 0;
        i < 35;
        i++
    ) {

        const x =
            (i * 97) % canvas.width;

        const y =
            (i * 53) % 400;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            1.5,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }


    // Ground

    ctx.fillStyle = "#14142b";

    ctx.fillRect(
        0,
        canvas.height - 45,
        canvas.width,
        45
    );

}


function drawBird() {

    ctx.save();

    ctx.translate(
        bird.x,
        bird.y
    );


    let rotation =
        Math.min(
            bird.velocity * 0.06,
            0.7
        );

    ctx.rotate(rotation);


    // Body

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        bird.radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#ffd166";

    ctx.fill();

    ctx.closePath();


    // Wing

    ctx.beginPath();

    ctx.ellipse(
        -7,
        6,
        11,
        6,
        -0.3,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#ff9f1c";

    ctx.fill();

    ctx.closePath();


    // Eye

    ctx.beginPath();

    ctx.arc(
        7,
        -7,
        5,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "white";

    ctx.fill();

    ctx.closePath();


    ctx.beginPath();

    ctx.arc(
        9,
        -7,
        2,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#111";

    ctx.fill();

    ctx.closePath();


    // Beak

    ctx.beginPath();

    ctx.moveTo(
        bird.radius - 2,
        -1
    );

    ctx.lineTo(
        bird.radius + 13,
        4
    );

    ctx.lineTo(
        bird.radius - 2,
        9
    );

    ctx.closePath();

    ctx.fillStyle = "#ff6b35";

    ctx.fill();


    ctx.restore();

}


function drawPipe(pipe) {

    const pipeTopHeight =
        pipe.top;

    const pipeBottomHeight =
        canvas.height -
        pipe.bottom -
        45;


    // Top pipe

    ctx.fillStyle = "#06d6a0";

    ctx.fillRect(
        pipe.x,
        0,
        pipeSettings.width,
        pipeTopHeight
    );


    // Top pipe cap

    ctx.fillRect(
        pipe.x - 6,
        pipeTopHeight - 22,
        pipeSettings.width + 12,
        22
    );


    // Bottom pipe

    ctx.fillRect(
        pipe.x,
        pipe.bottom,
        pipeSettings.width,
        pipeBottomHeight
    );


    // Bottom pipe cap

    ctx.fillRect(
        pipe.x - 6,
        pipe.bottom,
        pipeSettings.width + 12,
        22
    );


    // Pipe highlights

    ctx.fillStyle =
        "rgba(255,255,255,0.18)";

    ctx.fillRect(
        pipe.x + 10,
        0,
        8,
        pipeTopHeight - 20
    );

    ctx.fillRect(
        pipe.x + 10,
        pipe.bottom + 20,
        8,
        pipeBottomHeight
    );

}


function draw() {

    drawBackground();

    pipes.forEach(drawPipe);

    drawBird();

}


function flap() {

    if (!gameRunning) return;

    bird.velocity =
        bird.jumpPower;

}


function updateBird() {

    bird.velocity +=
        bird.gravity;

    bird.y +=
        bird.velocity;


    // Ceiling

    if (
        bird.y - bird.radius < 0
    ) {

        bird.y =
            bird.radius;

        bird.velocity = 0;

    }


    // Ground

    if (
        bird.y + bird.radius >
        canvas.height - 45
    ) {

        gameOver();

    }

}


function updatePipes() {

    pipes.forEach(pipe => {

        pipe.x -=
            pipeSettings.speed;


        if (
            !pipe.passed &&
            pipe.x +
            pipeSettings.width <
            bird.x
        ) {

            pipe.passed = true;

            score++;

            scoreElement.textContent =
                score;

            if (score > bestScore) {

                bestScore = score;

                bestScoreElement.textContent =
                    bestScore;

                localStorage.setItem(
                    "flappyBestScore",
                    bestScore
                );

            }

        }

    });


    if (
        pipes.length > 0 &&
        pipes[0].x +
        pipeSettings.width <
        -20
    ) {

        pipes.shift();

    }


    const lastPipe =
        pipes[pipes.length - 1];


    if (
        lastPipe &&
        lastPipe.x <
        canvas.width -
        pipeSettings.distance
    ) {

        createPipe(
            canvas.width + 50
        );

    }

}


function checkCollision() {

    for (const pipe of pipes) {

        const birdLeft =
            bird.x - bird.radius;

        const birdRight =
            bird.x + bird.radius;

        const birdTop =
            bird.y - bird.radius;

        const birdBottom =
            bird.y + bird.radius;


        const pipeLeft =
            pipe.x;

        const pipeRight =
            pipe.x +
            pipeSettings.width;


        const hitsPipeX =
            birdRight > pipeLeft &&
            birdLeft < pipeRight;


        const hitsTopPipe =
            birdTop < pipe.top;


        const hitsBottomPipe =
            birdBottom > pipe.bottom;


        if (
            hitsPipeX &&
            (hitsTopPipe ||
             hitsBottomPipe)
        ) {

            gameOver();

            return;

        }

    }

}


function update() {

    updateBird();

    updatePipes();

    checkCollision();

}


function gameLoop() {

    if (!gameRunning) return;

    update();

    draw();

    animationId =
        requestAnimationFrame(
            gameLoop
        );

}


function startGame() {

    cancelAnimationFrame(
        animationId
    );

    resetGame();

    gameRunning = true;

    startScreen.style.display =
        "none";

    gameLoop();

}


function gameOver() {

    if (!gameRunning) return;

    gameRunning = false;

    cancelAnimationFrame(
        animationId
    );


    if (score > bestScore) {

        bestScore = score;

        localStorage.setItem(
            "flappyBestScore",
            bestScore
        );

    }


    bestScoreElement.textContent =
        bestScore;


    startScreen.innerHTML = `

        <h2>💥 GAME OVER!</h2>

        <p>
            You scored
            <strong>${score}</strong> points!
        </p>

        <p>
            Best Score:
            <strong>${bestScore}</strong>
        </p>

        <button id="restartButton">
            PLAY AGAIN
        </button>

    `;


    startScreen.style.display =
        "flex";


    document
        .getElementById("restartButton")
        .addEventListener(
            "click",
            startGame
        );

}


function handleInput(event) {

    if (
        event.type === "keydown" &&
        event.code !== "Space"
    ) {

        return;

    }

    if (
        event.type === "keydown"
    ) {

        event.preventDefault();

    }


    flap();

}


startButton.addEventListener(
    "click",
    startGame
);


canvas.addEventListener(
    "pointerdown",
    () => {

        if (gameRunning) {

            flap();

        }

    }
);


document.addEventListener(
    "keydown",
    handleInput
);


resetGame();
draw();

