import { playfield } from "./generate.js";
import { PLAYFIELD_COLUMNS, PLAYFIELD_ROWS } from "./variables.js";

let totalPoints = 0;
const score = document.querySelector(".score");
// let clearedRowsCount;

function calculatePoints(clearedRows) {
    switch (clearedRows) {
        case 1:
            return 20;
        case 2:
            return 50;
        case 3:
            return 150;
        case 4:
            return 500;
        default:
            return 0;
    }
}

function clearFullRows() {
    let clearedRowsCount = 0; // Лічильник видалених рядів

    for (let row = PLAYFIELD_ROWS - 1; row >= 0; row--) {
        if (isRowFull(row)) {
            removeRow(row);
            // console.log(row)
            clearedRowsCount++;
            // console.log(clearedRowsCount)
            moveRowsDown(row);
        }
    }
        totalPoints += calculatePoints(clearedRowsCount);
        score.innerHTML = totalPoints;
}


function isRowFull(row) {
    for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
        if (!playfield[row][column]) {
            return false;
        }
    }
    return true;
}

function removeRow(row) {
    playfield.splice(row, 1);
    playfield.unshift(new Array(PLAYFIELD_COLUMNS).fill(0));
}

function moveRowsDown(startRow) {
    for (let row = startRow - 1; row >= 0; row--) {
        for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
            playfield[row + 1][column] = playfield[row][column];
        }
    }
}

export {clearFullRows}