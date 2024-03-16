import { PLAYFIELD_COLUMNS, PLAYFIELD_ROWS, TETROMINO_NAMES, TETROMINOES } from "./variables.js";
import { maxInEachRow } from "./maxInEachRow.js";

function convertPositionToIndex(row, column) {
    return row * PLAYFIELD_COLUMNS + column;
}

let playfield;
let tetromino;

function generatePlayField() {
    for (let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i++) {
        const div = document.createElement('div');
        document.querySelector('.grid').append(div);
    }

    playfield = new Array(PLAYFIELD_ROWS).fill()
        .map(() => new Array(PLAYFIELD_COLUMNS).fill(0))
}

function generateTetromino() {
    const randomFigure = Math.floor(Math.random() * TETROMINO_NAMES.length);

    const name = TETROMINO_NAMES[randomFigure]
    const matrix = TETROMINOES[name];

    const maxRow = maxInEachRow(matrix);
    const column = Math.floor((PLAYFIELD_COLUMNS - maxRow)/2);

    tetromino = {
        name,
        matrix,
        row: 0,
        column,
    }
}

generatePlayField();
generateTetromino();
const cells = document.querySelectorAll('.grid div');

function drawPlayField() {
    for (let row = 0; row < PLAYFIELD_ROWS; row++) {
        for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
            if (!playfield[row][column]) continue;
            const name = playfield[row][column];
            const cellIndex = convertPositionToIndex(row, column);
            cells[cellIndex].classList.add(name, "figure")
        }
    }
}

function drawTetromino() {
    const name = tetromino.name;
    const tetrominoMatrixSize = tetromino.matrix.length;

    for (let row = 0; row < tetrominoMatrixSize; row++) {
        for (let column = 0; column < tetrominoMatrixSize; column++) {
            if (!tetromino.matrix[row][column]) continue;
            const cellIndex = convertPositionToIndex(
                tetromino.row + row,
                tetromino.column + column
            );
            cells[cellIndex].classList.add(name, "figure")
        }

    }
}

function draw() {
    cells.forEach(cell => cell.removeAttribute("class"));
    drawPlayField();
    drawTetromino();
}

draw();

document.addEventListener('keydown', onKeyDown);

function onKeyDown(e) {
    switch (e.key) {
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
}

function moveTetrominoLeft() {
    tetromino.column -= 1;
}

function moveTetrominoRight() {
    tetromino.column += 1;
}

function moveTetrominoSpace() {
    tetromino.row -= 1;
}