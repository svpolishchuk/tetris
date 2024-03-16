import { draw, clearGameInterval, notification} from "../script.js";
import { tetromino, playfield, generateTetromino } from "./generate.js";
import { clearFullRows } from "./clearRows.js";
import { randomColor } from "./helpers/randomColor.js";
import { isValid } from "./validation.js";

function rotate() {
    rotateTetromino();
    draw();
}
export function rotateTetromino() {
    const oldMatrix = tetromino.matrix;
    const rotatedMatrix = rotateMatrix(tetromino.matrix);
    tetromino.matrix = rotatedMatrix;
    if (!isValid) {
        tetromino.matrix = oldMatrix;
    }
}

function rotateMatrix(matrixTetromino) {
    const N = matrixTetromino.length;
    const rotateMatrix = [];
    for (let i = 0; i < N; i++) {
        rotateMatrix[i] = [];
        for (let j = 0; j < N; j++) {
            rotateMatrix[i][j] = matrixTetromino[N - j - 1][i]
        }
    }
    return rotateMatrix;
}


function placeTetromino() {
    const matrixSize = tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row++) {
        for (let column = 0; column < matrixSize; column++) {
            if (tetromino.matrix[row][column]) {
                playfield[tetromino.row + row][tetromino.column + column] = {
                    name: tetromino.name,
                    color: tetromino.color,
                };
            }
        }
    }
    generateTetromino();

    tetromino.color = randomColor();
}

function onKeyDown(e) {
    switch (e.key) {
        case "ArrowUp":
            rotate();
            break;
        case "ArrowDown":
            moveTetrominoDown();
            break;
        case "ArrowLeft":
            moveTetrominoLeft()
            break;
        case "ArrowRight":
            moveTetrominoRight();
            break;
    }

    draw();
}


function moveTetrominoDown() {
    tetromino.row += 1;
    if (!isValid()) {
        tetromino.row -= 1;
        placeTetromino();
        clearFullRows();
        draw();
        generateTetromino();
        if (!isValid()) {
            clearGameInterval();
            notification.innerHTML = "GAME OVER";
            // alert("GAME OVER");
        }
    }
}

function moveTetrominoLeft() {
    tetromino.column -= 1;
    if (!isValid()) {
        tetromino.column += 1;
    }
}

function moveTetrominoRight() {
    tetromino.column += 1;
    if (!isValid()) {
        tetromino.column -= 1;
    }
}

export {moveTetrominoDown, onKeyDown, placeTetromino}