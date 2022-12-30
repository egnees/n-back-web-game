var startGameButton = document.getElementById("start-n-back-button");
var doneP = document.getElementById("done-n-back");

var rows = new Array()
var cols = new Array()
var lets = new Array();

var gameStarted = false;

var iterationsCount;
var needIterationsCount;
var needMatchCount;

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
    console.log("round " + iterationsCount);

    soundButtonPressed = false;
    positionButtonPressed = false;

    soundButton.disabled = false;
    positionButton.disabled = false;

    if (iterationsCount == needIterationsCount) {
        stopGame();
        return;
    }

    currentLetter = lets[iterationsCount];
    playLetterSound();

    currentRow = rows[iterationsCount];
    currentCol = cols[iterationsCount];

    currentCell = document.getElementById("grid-cell-" + currentRow + "-" + currentCol);
    currentCell.style.backgroundColor = "blue";

    doneP.innerText = (iterationsCount + 1) + " of " + needIterationsCount;

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
        console.log("checkPosition: " + checkPosition());
        console.log("checkSound: " + checkSound());

        iterationsCount++;
    }, 1900);
}

function checkPosition() {
    if (iterationsCount >= 3 && rows[iterationsCount - 3] == currentRow && cols[iterationsCount - 3] == currentCol) {
        return true;
    } 
    return false;
}

function checkSound() {
    if (iterationsCount >= 3 && lets[iterationsCount - 3] == currentLetter) {
        return true;
    } 
    return false;
}

function positionButtonClicked() {
    if (!gameStarted) {
        return;
    }
    positionButton.disabled = true;
    positionButtonPressed = true;
}

function soundButtonClicked() {
    if (!gameStarted) {
        return;
    }
    soundButton.disabled = true;
    soundButtonPressed = true;
}

function stopGame() {
    clearInterval(intervalId);

    console.log("corr pos/corr sound: " + correctPosAnswers + "/" + correctSoundAnswers);
    console.log("incorr pos/incorr sound: " + incorrectPosAnswers + "/" + incorrectSoundAnswers);

    console.log("correct answers: " + (correctPosAnswers + correctSoundAnswers));
    console.log("incorrect answers: " + (incorrectPosAnswers + incorrectSoundAnswers));

    startGameButton.innerText = "Start";
    doneP.innerText = "0 of " + needIterationsCount;

    gameStarted = false;
}

function startGame() {
    if (gameStarted) {
        stopGame();
        return;
    }
    iterationsCount = 0;
    needIterationsCount = 30;
    needMatchCount = 8;
    correctPosAnswers = 0;
    incorrectPosAnswers = 0;
    correctSoundAnswers = 0;
    incorrectSoundAnswers = 0;
    soundButtonPressed = false;
    positionButtonPressed = false;
    
    console.log("generating positions...");
    generatePositions(needIterationsCount, needMatchCount);
    console.log("rows: " + rows);
    console.log("cols: " + cols);

    console.log("generating letters...");
    generateLetters(needIterationsCount, needMatchCount);
    console.log("lets: " + lets);

    gameStarted = true;

    startGameButton.innerText = "Stop";

    intervalId = setInterval(generateCurrentCell, 2000);

    console.log("game started");
}

function generateArray0(n, r) {
    s = new Set();
    while (s.size < n) {
        var num = Math.round(Math.random() * r);
        s.add(num);
    }
    var arr = new Array();
    arr = Array.from(s);
    arr.sort(function(a, b) {
        return a - b;
    });
    console.log("generated array 0: " + arr);
    return arr;
}

function generateArray(n, l, r) {
    arr = generateArray0(n, r - l);
    for (var i = 0; i < arr.length; i++) {
        arr[i] += l;
    }
    console.log("generated array: " + arr);
    return arr;
}

function generateArrayWithReplays0(n, r) {
    var arr = new Array();
    for (var i = 0; i < n; i++) {
        arr[i] = Math.round(Math.random() * r);
    }
    return arr;
}

function generateArrayWithReplays(n, l, r) {
    var arr = generateArrayWithReplays0(n, r - l);
    for (var i = 0; i < n; i++) {
        arr[i] += l;
    }
    return arr;
}

function generatePositions(total, match) {
    var matched = generateArray(match, 3, total - 1);
    rows = generateArrayWithReplays(total, 1, 3);
    cols = generateArrayWithReplays(total, 1, 3);
    for (var i = 0; i < match; i++) {
        var x = matched[i];
        rows[x] = rows[x - 3];
        cols[x] = cols[x - 3];
    }
}

function generateLetters(total, match) {
    var matched = generateArray(match, 3, total - 1);
    lets = generateArrayWithReplays0(total, letters.length - 1);
    for (var i = 0; i < match; ++i) {
        var x = matched[i];
        lets[x] = lets[x - 3];
    }
    for (var i = 0; i < total; i++) {
        lets[i] = letters[lets[i]];
    }
}

document.addEventListener("keypress", function(event) {
    if (event.key == 'A' || event.key == 'a') {
        positionButton.click();
    } else if (event.key == 'L' || event.key == 'l') {
        soundButton.click();
    }
});