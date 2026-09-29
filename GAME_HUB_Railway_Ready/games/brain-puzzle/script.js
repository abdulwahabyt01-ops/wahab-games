const startButton = document.getElementById("startButton");
const startScreen = document.getElementById("startScreen");

const questionBox = document.getElementById("questionBox");
const question = document.getElementById("question");
const answers = document.getElementById("answers");

const scoreDisplay = document.getElementById("score");
const questionNumberDisplay = document.getElementById("questionNumber");

let score = 0;
let questionNumber = 0;
let correctAnswer = 0;
let gameRunning = false;


startButton.addEventListener("click", startGame);


function startGame() {

    score = 0;
    questionNumber = 0;
    gameRunning = true;

    scoreDisplay.textContent = score;
    questionNumberDisplay.textContent = 1;

    startScreen.style.display = "none";
    questionBox.style.display = "block";

    createQuestion();
}


function createQuestion() {

    questionNumber++;

    questionNumberDisplay.textContent = questionNumber;


    let maxNumber = 10 + questionNumber * 5;

    let number1 = Math.floor(Math.random() * maxNumber) + 1;
    let number2 = Math.floor(Math.random() * maxNumber) + 1;


    const operations = ["+", "-", "×"];

    const operation =
        operations[Math.floor(Math.random() * operations.length)];


    if (operation === "+") {

        correctAnswer = number1 + number2;

    } else if (operation === "-") {

        if (number2 > number1) {
            [number1, number2] = [number2, number1];
        }

        correctAnswer = number1 - number2;

    } else {

        correctAnswer = number1 * number2;
    }


    question.textContent =
        `${number1} ${operation} ${number2} = ?`;


    createAnswers();
}


function createAnswers() {

    answers.innerHTML = "";


    let answerOptions = new Set();

    answerOptions.add(correctAnswer);


    while (answerOptions.size < 4) {

        let difference =
            Math.floor(Math.random() * 15) + 1;

        let wrongAnswer =
            correctAnswer +
            (Math.random() < 0.5 ? -difference : difference);


        if (wrongAnswer >= 0) {
            answerOptions.add(wrongAnswer);
        }
    }


    const shuffledAnswers =
        [...answerOptions].sort(() => Math.random() - 0.5);


    shuffledAnswers.forEach(answer => {

        const button =
            document.createElement("button");

        button.className = "answer-button";

        button.textContent = answer;

        button.addEventListener("click", () => {

            checkAnswer(answer);

        });

        answers.appendChild(button);

    });
}


function checkAnswer(answer) {

    if (!gameRunning) {
        return;
    }


    if (answer === correctAnswer) {

        score += 10;

        scoreDisplay.textContent = score;

        createQuestion();

    } else {

        endGame();

    }
}


function endGame() {

    gameRunning = false;

    questionBox.style.display = "none";


    startScreen.innerHTML = `
        <h2>🧠 Game Over!</h2>

        <p>
            You reached question
            <strong>${questionNumber}</strong>
            <br><br>
            Final Score:
            <strong>${score}</strong>
        </p>

        <button id="restartButton">
            PLAY AGAIN
        </button>
    `;


    startScreen.style.display = "block";


    document
        .getElementById("restartButton")
        .addEventListener("click", startGame);
}