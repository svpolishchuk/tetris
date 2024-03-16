import { PLAYFIELD_COLUMNS, PLAYFIELD_ROWS } from "./js/variables.js";
import { playfield, tetromino, rowTetro, generatePlayField, generateTetromino } from "./js/generate.js"
import { onKeyDown, moveTetrominoDown } from "./js/move.js";

let gameInterval;
export const notification = document.querySelector(".notification");

generatePlayField();
generateTetromino();
const cells = document.querySelectorAll('.grid div');

function convertPositionToIndex(row, column) {
    return row * PLAYFIELD_COLUMNS + column;
}

function drawPlayField() {
    for (let row = 0; row < PLAYFIELD_ROWS; row++) {
        for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
            if (!playfield[row][column]) continue;
            // const name = playfield[row][column];
            const cellIndex = convertPositionToIndex(row, column);
            const cellData = playfield[row][column];

            if (!cells[cellIndex].classList.contains("figure")) {
                cells[cellIndex].classList.add("figure");
                cells[cellIndex].style.backgroundColor = cellData.color;
            }
        }
    }
}

function drawTetromino() {
    // const name = tetromino.name;
    const tetrominoMatrixSize = tetromino.matrix.length;

    for (let row = 0; row < tetrominoMatrixSize; row++) {
        for (let column = 0; column < tetrominoMatrixSize; column++) {
            if (!tetromino.matrix[row][column]) continue;
            const cellIndex = convertPositionToIndex(
                tetromino.row + row,
                tetromino.column + column
            );
            if (cells[cellIndex]) {
                cells[cellIndex].classList.add("figure");
                cells[cellIndex].style.backgroundColor = tetromino.color;
            }

        }
    }
}

export function draw() {
    cells.forEach(cell => {
        if (cell) {
            cell.removeAttribute("class");
            cell.removeAttribute("style")
        }
    }
    );
    drawPlayField();
    drawTetromino();
}


function startInterval() {
    gameInterval = setInterval(() => {
        moveTetrominoDown();
    }, 1000);
    
    setInterval(() => {
        draw();
    }, 50);
}

export function clearGameInterval() {
    clearInterval(gameInterval);
}


draw();

startInterval();
document.addEventListener('keydown', onKeyDown);


