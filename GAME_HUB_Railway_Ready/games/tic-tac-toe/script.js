const cells = document.querySelectorAll(".cell");
const turnDisplay = document.getElementById("turnDisplay");
const message = document.getElementById("message");
const restartButton = document.getElementById("restartButton");

const scoreXElement = document.getElementById("scoreX");
const scoreOElement = document.getElementById("scoreO");
const scoreDrawElement = document.getElementById("scoreDraw");

let board = ["", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

let scoreX = 0;
let scoreO = 0;
let scoreDraw = 0;

// Computer timer
let computerTimer = null;

// Prevent old computer moves from affecting a new game
let gameNumber = 0;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];


// ========================================
// PLAYER CLICK
// ========================================

function handleCellClick(event) {

    // Player can only play during their turn
    if (!gameActive || currentPlayer !== "X") {
        return;
    }

    const index = Number(event.currentTarget.dataset.index);

    // Cell already occupied
    if (board[index] !== "") {
        return;
    }

    // Player move
    makeMove(index, "X");

    // Check if player won or game is draw
    if (finishIfNeeded()) {
        return;
    }

    // Computer's turn
    currentPlayer = "O";
    updateTurn();

    startComputerTurn();
}


// ========================================
// MAKE MOVE
// ========================================

function makeMove(index, player) {

    if (board[index] !== "") {
        return false;
    }

    board[index] = player;

    const cell = cells[index];

    cell.textContent = player;

    if (player === "X") {
        cell.classList.add("x");
        cell.classList.remove("o");
    } else {
        cell.classList.add("o");
        cell.classList.remove("x");
    }

    return true;
}


// ========================================
// COMPUTER TURN
// ========================================

function startComputerTurn() {

    // Cancel any old timer
    clearComputerTimer();

    const thisGame = gameNumber;

    computerTimer = setTimeout(() => {

        computerTimer = null;

        // Make sure this is still the same game
        if (thisGame !== gameNumber) {
            return;
        }

        if (!gameActive || currentPlayer !== "O") {
            return;
        }

        const move = findBestMove();

        if (move === -1) {
            return;
        }

        makeMove(move, "O");

        if (finishIfNeeded()) {
            return;
        }

        currentPlayer = "X";

        updateTurn();

    }, 350);
}


// ========================================
// FIND BEST COMPUTER MOVE
// ========================================

function findBestMove() {

    const emptyCells = getEmptyCells();

    if (emptyCells.length === 0) {
        return -1;
    }


    // 1. Try to win
    for (const index of emptyCells) {

        board[index] = "O";

        const win = hasWinner("O");

        board[index] = "";

        if (win) {
            return index;
        }
    }


    // 2. Block player
    for (const index of emptyCells) {

        board[index] = "X";

        const playerWin = hasWinner("X");

        board[index] = "";

        if (playerWin) {
            return index;
        }
    }


    // 3. Take center
    if (board[4] === "") {
        return 4;
    }


    // 4. Take a corner
    const corners = [0, 2, 6, 8];

    const availableCorners = corners.filter(
        index => board[index] === ""
    );

    if (availableCorners.length > 0) {

        return availableCorners[
            Math.floor(Math.random() * availableCorners.length)
        ];
    }


    // 5. Take any remaining square
    return emptyCells[
        Math.floor(Math.random() * emptyCells.length)
    ];
}


// ========================================
// GET EMPTY CELLS
// ========================================

function getEmptyCells() {

    const emptyCells = [];

    for (let i = 0; i < board.length; i++) {

        if (board[i] === "") {
            emptyCells.push(i);
        }
    }

    return emptyCells;
}


// ========================================
// CHECK GAME
// ========================================

function finishIfNeeded() {

    const winningCombination = getWinningCombination();

    // Someone won
    if (winningCombination) {

        gameActive = false;

        clearComputerTimer();

        winningCombination.forEach(index => {
            cells[index].classList.add("winner");
        });


        if (currentPlayer === "X") {

            scoreX++;
            scoreXElement.textContent = scoreX;

            message.textContent = "🎉 You Win!";

        } else {

            scoreO++;
            scoreOElement.textContent = scoreO;

            message.textContent = "🤖 Computer Wins!";
        }

        turnDisplay.textContent = "🏆 Game Over";

        return true;
    }


    // Draw
    if (!board.includes("")) {

        gameActive = false;

        clearComputerTimer();

        scoreDraw++;

        scoreDrawElement.textContent = scoreDraw;

        message.textContent = "🤝 It's a Draw!";

        turnDisplay.textContent = "Game Over";

        return true;
    }

    return false;
}


// ========================================
// GET WINNING COMBINATION
// ========================================

function getWinningCombination() {

    for (const combination of winningCombinations) {

        const [a, b, c] = combination;

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {
            return combination;
        }
    }

    return null;
}


// ========================================
// CHECK WINNER
// ========================================

function hasWinner(player) {

    return winningCombinations.some(combination => {

        const [a, b, c] = combination;

        return (
            board[a] === player &&
            board[b] === player &&
            board[c] === player
        );
    });
}


// ========================================
// TURN DISPLAY
// ========================================

function updateTurn() {

    if (!gameActive) {
        return;
    }

    if (currentPlayer === "X") {

        turnDisplay.textContent = "❌ Your Turn";

    } else {

        turnDisplay.textContent = "🤖 Computer is Thinking...";
    }
}


// ========================================
// CLEAR COMPUTER TIMER
// ========================================

function clearComputerTimer() {

    if (computerTimer !== null) {

        clearTimeout(computerTimer);

        computerTimer = null;
    }
}


// ========================================
// RESTART GAME
// ========================================

function restartGame() {

    // Stop old computer move
    clearComputerTimer();

    // Create a new game number
    gameNumber++;

    board = ["", "", "", "", "", "", "", ""];

    currentPlayer = "X";

    gameActive = true;

    message.textContent = "";

    cells.forEach(cell => {

        cell.textContent = "";

        cell.classList.remove("x");
        cell.classList.remove("o");
        cell.classList.remove("winner");

    });

    updateTurn();
}


// ========================================
// CELL EVENTS
// ========================================

cells.forEach(cell => {

    cell.addEventListener("click", handleCellClick);

});


// ========================================
// RESTART EVENT
// ========================================

restartButton.addEventListener("click", restartGame);


// ========================================
// START GAME
// ========================================

updateTurn();