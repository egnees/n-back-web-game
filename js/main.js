var rows = new Array()
var columns = new Array()
var lets = new Array();

var iterationsCount;
var needIterationsCount;

var currentRow;
var currentCol;
var currentCell;
var currentLetter;

var intervalId;

var positionButton = document.getElementById("position-button");
var soundButton = document.getElementById("sound-button");

var correctPosAnswers;
var incorrectPosAnswers;
var correctSoundAnswers;
var incorrectSoundAnswers;

var positionButtonPressed;
var soundButtonPressed;

const letters = "ABCDEFG";

function playLetterSound() {
    var audio = new Audio();
    audio.src = 'sounds/' + currentLetter + '.mp3';
    console.log(audio.src);
    audio.autoplay = true;
}

function generateCurrentCell() {
    iterationsCount++;
    console.log("round " + iterationsCount);

    soundButtonPressed = false;
    positionButtonPressed = false;

    if (iterationsCount == needIterationsCount) {
        clearInterval(intervalId);

        console.log("correct answers: " + (correctPosAnswers + correctSoundAnswers));
        console.log("incorrect answers: " + (incorrectPosAnswers + incorrectSoundAnswers));
    }

    rows.push(currentRow);
    columns.push(currentCol);

    var num = Math.round(Math.random() * 8);
    currentRow = Math.floor(num / 3) + 1;
    currentCol = num % 3 + 1;

    var letterId = Math.round(Math.random() * (letters.length - 1));
    currentLetter = letters[letterId];
    lets.push(currentLetter);

    playLetterSound();

    currentCell = document.getElementById("grid-cell-" + currentRow + "-" + currentCol);
    currentCell.style.backgroundColor = "blue";
    setTimeout(() => {
        currentCell.style.backgroundColor = "white";
    }, 750);

    setTimeout(() => {
        if (positionButtonPressed && checkPosition()) {
            correctPosAnswers++;
        } else if (positionButtonPressed && !checkPosition()) {
            incorrectPosAnswers++;
        } else if (!positionButtonPressed && checkPosition()) {
            incorrectPosAnswers++;
        }

        if (soundButtonPressed && checkSound()) {
            correctSoundAnswers++;
        } else if (soundButtonPressed && !checkSound()) {
            incorrectSoundAnswers++;
        } else if (!soundButtonPressed && checkSound()) {
            incorrectSoundAnswers++;
        }

        console.log("i checked correctness right now");
    }, 1900);
}

function checkPosition() {
    if (rows.length >= 3 && rows[rows.length - 3] == currentRow && columns[columns.length - 3] == currentCol) {
        return true;
    } 
    return false;
}

function checkSound() {
    if (lets.length >= 3 && lets[lets.length - 3] == currentLetter) {
        return true;
    } 
    return false;
}

function positionButtonClicked() {
    positionButton.disabled = true;
    positionButtonPressed = true;
    setTimeout(() => {
        console.log("making position button enabled");
        positionButton.disabled = false;
    }, 1000);
}

function soundButtonClicked() {
    soundButton.disabled = true;
    soundButtonPressed = true;
    setTimeout(() => {
        console.log("making sound button enabled");
        soundButton.disabled = false;
    }, 1000);
}

function startGame() {
    iterationsCount = 0;
    needIterationsCount = 10;
    correctPosAnswers = 0;
    incorrectPosAnswers = 0;
    correctSoundAnswers = 0;
    incorrectSoundAnswers = 0;
    soundButtonPressed = false;
    positionButtonPressed = false;
    intervalId = setInterval(generateCurrentCell, 2000);

    console.log("game started");
}

startGame();