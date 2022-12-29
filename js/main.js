function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function processGame() {
    for (var i = 0; i < 5; ++i) {
        console.log("round " + i);
        var num = Math.round(Math.random() * 8);
        var row = Math.floor(num / 3) + 1;
        var col = num % 3 + 1;

        await sleep(1500);

        var gridCell = document.getElementById("grid-cell-" + row + "-" + col);
        gridCell.style.backgroundColor = "blue";

        console.log(gridCell);

        await sleep(750);

        gridCell.style.backgroundColor = "white";
    }
}

processGame();