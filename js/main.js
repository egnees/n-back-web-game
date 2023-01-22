var startGameButton = document.getElementById("start-n-back-button");
var doneP = document.getElementById("done-n-back");

var nBackArg = 3;

var memorizeTime;
var showTime;

var rows = new Array()
var cols = new Array()
var lets = new Array();

var positionState = new Array();
var soundState = new Array();

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
var saveSettingsButton = document.getElementById("save-settings-button");

var nBackArgInput = document.getElementById("n-back-arg-input");
var amountArgInput = document.getElementById("amount-arg-input");
var memorizeTimeArgInput = document.getElementById("memorize-time-arg-input");
var showTimeArgInput = document.getElementById("show-time-arg-input");

var correctPosAnswers;
var incorrectPosAnswers;
var correctSoundAnswers;
var incorrectSoundAnswers;

var positionButtonPressed;
var soundButtonPressed;

const letters = "ABCDEFG";

function saveSettingsButtonPressed() {
    if (gameStarted) {
        stopGame();
    }
    updateSettings();
}

function updateSettings() {
    nBackArg = parseInt(nBackArgInput.value);
    needIterationsCount = parseInt(amountArgInput.value);
    memorizeTime = parseFloat(memorizeTimeArgInput.value) * 1000;
    showTime = parseFloat(showTimeArgInput.value) * 1000;

    needMatchCount = Math.round(needIterationsCount / 5);

    document.getElementById("done-n-back").innerText = "0 of " + needIterationsCount;
}

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
    }, showTime);

    setTimeout(() => {
        if (positionButtonPressed && checkPosition()) {
            positionState.push(1);
            correctPosAnswers++;
        } else if (positionButtonPressed && !checkPosition()) {
            incorrectPosAnswers++;
            positionState.push(-1);
        } else if (!positionButtonPressed && checkPosition()) {
            incorrectPosAnswers++;
            positionState.push(-1);
        } else {
            positionState.push(0);
        }

        if (soundButtonPressed && checkSound()) {
            correctSoundAnswers++;
            soundState.push(1);
        } else if (soundButtonPressed && !checkSound()) {
            incorrectSoundAnswers++;
            soundState.push(-1);
        } else if (!soundButtonPressed && checkSound()) {
            incorrectSoundAnswers++;
            soundState.push(-1);
        } else {
            soundState.push(0);
        }

        console.log("i checked correctness right now");
        console.log("checkPosition: " + checkPosition());
        console.log("checkSound: " + checkSound());

        iterationsCount++;
    }, showTime + memorizeTime - 100);
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

function displayResults() {
    console.log("displaying results");
    document.getElementById("n-back-results").style.visibility = "visible";

    var posRes = document.getElementById("position-results");
    var soundRes = document.getElementById("audio-results");
    var totalRes = document.getElementById("total-results");

    var posS = "";
    var soundS = "";

    posS = "<p>Positions: ";
    for (var i = 0; i < iterationsCount; ++i) {
        var x = (rows[i] - 1) * 3 + cols[i] + 1;
        if (positionState[i] == 1) {
            posS += "<span class=\"green-span\">" + x + "</span> ";
        } else if (positionState[i] == -1) {
            posS += "<span class=\"red-span\">" + x + "</span> ";
        } else {
            posS += "<span>" + x + "</span> ";
        }
    }
    posS += "</p>";
    var totalPos = incorrectPosAnswers + correctPosAnswers;
    var posPerc = 0;
    if (totalPos == 0) {
        posPerc = 100;
    } else {
        posPerc = 100 * correctPosAnswers / totalPos;
    }
    posS += "<p>" + posPerc.toFixed(2) + "%</p>";
    posRes.innerHTML = posS;

    soundS = "<p>Sound: ";
    for (var i = 0; i < iterationsCount; ++i) {
        if (soundState[i] == 1) {
            soundS += "<span class=\"green-span\">" + lets[i] + "</span> ";
        } else if (soundState[i] == -1) {
            soundS += "<span class=\"red-span\">" + lets[i] + "</span> ";
        } else {
            soundS += "<span class=\"white-span\">" + lets[i] + "</span> ";
        }
    }
    soundS += "</p>";
    var totalSound = incorrectSoundAnswers + correctSoundAnswers;
    var soundPerc = 0;
    if (totalSound == 0) {
        soundPerc = 100;
    } else {
        soundPerc = 100 * correctSoundAnswers / totalSound;
    }
    soundS += "<p>" + soundPerc.toFixed(2) + "%</p>";
    soundRes.innerHTML = soundS;

    var totalCorrAnswers = correctPosAnswers + correctSoundAnswers;
    var totalIncorrAnswers = incorrectPosAnswers + incorrectSoundAnswers;
    var total = 0;
    if (totalCorrAnswers + totalIncorrAnswers == 0) {
        total = 100;
    } else {
        total = 100 * totalCorrAnswers / (totalCorrAnswers + totalIncorrAnswers);
    }

    if (total >= 80) {
        totalRes.innerHTML = "<p class=\"green-span\">Total: " + total.toFixed(2) + "%</p>";
    } else {
        totalRes.innerHTML = "<p class=\"white-span\">Total: " + total.toFixed(2) + "%</p>";
    }
}

function stopGame() {
    clearInterval(intervalId);

    console.log("corr pos/corr sound: " + correctPosAnswers + "/" + correctSoundAnswers);
    console.log("incorr pos/incorr sound: " + incorrectPosAnswers + "/" + incorrectSoundAnswers);

    console.log("correct answers: " + (correctPosAnswers + correctSoundAnswers));
    console.log("incorrect answers: " + (incorrectPosAnswers + incorrectSoundAnswers));

    startGameButton.innerText = "Start";
    doneP.innerText = "0 of " + needIterationsCount;

    displayResults();

    gameStarted = false;
}

function startGame() {
    if (gameStarted) {
        stopGame();
        return;
    }
    updateSettings();
    iterationsCount = 0;
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

    positionState = new Array();
    soundState = new Array();

    document.getElementById("n-back-results").style.visibility = "hidden";

    intervalId = setInterval(generateCurrentCell, showTime + memorizeTime);

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
    for (var i = 3; i < total; i++) {
        if (rows[i - 3] == rows[i] && cols[i - 3] == cols[i]) {
            if (Math.random() < 0.5) {
                rows[i] = rows[i] % 3 + 1;
            } else {
                cols[i] = cols[i] % 3 + 1;
            }
        }
    }
    for (var i = 0; i < match; i++) {
        var x = matched[i];
        rows[x] = rows[x - 3];
        cols[x] = cols[x - 3];
    }
}

function generateLetters(total, match) {
    var matched = generateArray(match, 3, total - 1);
    lets = generateArrayWithReplays0(total, letters.length - 1);
    for (var i = 3; i < total; i++) {
        if (lets[i - 3] == lets[i]) {
            lets[i] = (lets[i] + 1) % letters.length;
        }
    }
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