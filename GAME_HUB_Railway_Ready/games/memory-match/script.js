
const gameBoard = document.getElementById("gameBoard");

const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");

const resultScreen = document.getElementById("resultScreen");
const resultTitle = document.getElementById("resultTitle");
const resultMessage = document.getElementById("resultMessage");
const restartButton = document.getElementById("restartButton");

const movesElement = document.getElementById("moves");
const matchesElement = document.getElementById("matches");
const timerElement = document.getElementById("timer");


const symbols = [
    "🐶",
    "🐱",
    "🦊",
    "🐼",
    "🐸",
    "🦁",
    "🐵",
    "🐯"
];


let cards = [];

let firstCard = null;
let secondCard = null;

let lockBoard = false;

let moves = 0;
let matches = 0;

let seconds = 0;
let timerInterval = null;

let gameStarted = false;


function shuffle(array) {

    return array.sort(
        () => Math.random() - 0.5
    );

}


function createCards() {

    gameBoard.innerHTML = "";

    const cardSymbols =
        shuffle([...symbols, ...symbols]);

    cards = [];

    cardSymbols.forEach((symbol, index) => {

        const card = document.createElement("div");

        card.classList.add("card");

        card.dataset.symbol = symbol;
        card.dataset.index = index;

        card.innerHTML = `
            <div class="card-inner">

                <div class="card-back">
                    ❓
                </div>

                <div class="card-front">
                    ${symbol}
                </div>

            </div>
        `;

        card.addEventListener(
            "click",
            flipCard
        );

        gameBoard.appendChild(card);

        cards.push(card);

    });

}


function flipCard() {

    if (!gameStarted) return;

    if (lockBoard) return;

    if (this === firstCard) return;

    if (this.classList.contains("matched")) return;

    this.classList.add("flipped");


    if (!firstCard) {

        firstCard = this;

        return;

    }


    secondCard = this;

    moves++;

    movesElement.textContent = moves;

    checkForMatch();

}


function checkForMatch() {

    const isMatch =
        firstCard.dataset.symbol ===
        secondCard.dataset.symbol;


    if (isMatch) {

        disableMatchedCards();

    } else {

        unflipCards();

    }

}


function disableMatchedCards() {

    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    matches++;

    matchesElement.textContent = matches;

    resetTurn();


    if (matches === symbols.length) {

        setTimeout(
            winGame,
            500
        );

    }

}


function unflipCards() {

    lockBoard = true;

    setTimeout(() => {

        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");

        resetTurn();

    }, 850);

}


function resetTurn() {

    [
        firstCard,
        secondCard
    ] = [null, null];

    lockBoard = false;

}


function startTimer() {

    clearInterval(timerInterval);

    seconds = 0;

    timerElement.textContent =
        "0:00";


    timerInterval = setInterval(() => {

        seconds++;

        const minutes =
            Math.floor(seconds / 60);

        const remainingSeconds =
            seconds % 60;

        timerElement.textContent =
            `${minutes}:${String(
                remainingSeconds
            ).padStart(2, "0")}`;

    }, 1000);

}


function stopTimer() {

    clearInterval(timerInterval);

}


function startGame() {

    stopTimer();

    moves = 0;
    matches = 0;

    movesElement.textContent = "0";
    matchesElement.textContent = "0";
    timerElement.textContent = "0:00";

    firstCard = null;
    secondCard = null;
    lockBoard = false;

    gameStarted = true;

    resultScreen.style.display = "none";
    startScreen.style.display = "none";

    createCards();

    startTimer();

}


function winGame() {

    gameStarted = false;

    stopTimer();

    resultTitle.textContent =
        "🎉 YOU WIN!";

    resultMessage.innerHTML = `
        You found all the pairs!<br>
        <strong>
            ${moves} moves • ${timerElement.textContent}
        </strong>
    `;

    resultScreen.style.display = "flex";

}


startButton.addEventListener(
    "click",
    startGame
);


restartButton.addEventListener(
    "click",
    startGame
);


// Create the board behind the start screen

createCards();

