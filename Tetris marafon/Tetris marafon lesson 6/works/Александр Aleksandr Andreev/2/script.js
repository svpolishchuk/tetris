const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;
const INTERVAL = 1000;
const TETROMINO_NAMES = [
    'O',
    'J',
    'I',
    'T',
    'Z',
    'L',
    'S'
]

const TETROMINOES = {
    'O': [
        [1, 1],
        [1, 1]
    ],
    'J': [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    'L': [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
    'I': [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    'S': [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    'Z': [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    'T': [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0]
    ]
}

let playfield;
let tetromino;
let score = 0;

function convertPositionToIndex(row, column) {
    return row * PLAYFIELD_COLUMNS + column;
}

function generatePlayField() {
    for (let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i++) {
        const div = document.createElement('div');
        document.querySelector('.grid').append(div);
    }

    playfield = new Array(PLAYFIELD_ROWS).fill()
        .map(() => new Array(PLAYFIELD_COLUMNS).fill(0))

}

function generateTetromino() {
    const name = TETROMINO_NAMES[Math.floor(Math.random() * TETROMINO_NAMES.length)];
    const matrix = TETROMINOES[name];
    const col = Math.floor((playfield[0].length - matrix[0].length) / 2);
    const rowTetro = -2;

    tetromino = {
        name,
        matrix,
        row: rowTetro,
        column: col
    }
}

document.addEventListener('keydown', onKeyDown);
generatePlayField();
generateTetromino();
const cells = document.querySelectorAll('.grid div');


function placeTetromino() {
    const matrixSize = tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row++) {
        for (let column = 0; column < matrixSize; column++) {
            if (tetromino.matrix[row][column] && (tetromino.row + row >= 0)) {
                playfield[tetromino.row + row][tetromino.column + column] = tetromino.name;
            }
        }
    }
    generateTetromino();
}


function drawPlayField() {
    for (let row = 0; row < PLAYFIELD_ROWS; row++) {
        for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {

            if (playfield[row][column] == 0) continue;

            const name = playfield[row][column];
            const cellIndex = convertPositionToIndex(row, column);
            cells[cellIndex].classList.add(name);
        }
    }
}

function drawTetromino() {
    const name = tetromino.name;
    const tetrominoMatrixSize = tetromino.matrix.length;
    for (let row = 0; row < tetrominoMatrixSize; row++) {
        for (let column = 0; column < tetrominoMatrixSize; column++) {
            if (!tetromino.matrix[row][column]) continue;
            if ((tetromino.row + row) < 0) continue;
            const cellIndex = convertPositionToIndex(
                tetromino.row + row,
                tetromino.column + column);

            cells[cellIndex].classList.add(name);
        }
    }
}



function clearRow() {
    let rowsCleared = 0;

    for (let row = 0; row < PLAYFIELD_ROWS; row++) {
        if (playfield[row].every(cell => cell !== 0)) {
            playfield.splice(row, 1);
            playfield.unshift(new Array(PLAYFIELD_COLUMNS).fill(0));
            rowsCleared++;
        }
    }

    switch (rowsCleared) {
        case 1:
            score += 10;
            break;
        case 2:
            score += 30;
            break;
        case 3:
            score += 50;
            break;
        case 4:
            score += 100;
            break;
    }

    document.getElementById('score').innerText = score;
}

function draw() {
    cells.forEach(cell => cell.removeAttribute('class'));
    drawTetromino();
    drawPlayField();
    clearRow();
}


function rotateMatrix(matrixTetromino) {
    const N = matrixTetromino.length;
    const rotateMatrix = [];
    for (let i = 0; i < N; i++) {
        rotateMatrix[i] = [];
        for (let j = 0; j < N; j++) {
            rotateMatrix[i][j] = matrixTetromino[N - j - 1][i];
        }
    }
    return rotateMatrix;
}

function rotateTetromino() {
    const oldMatrix = tetromino.matrix;
    const rotatedMatrix = rotateMatrix(tetromino.matrix);
    tetromino.matrix = rotatedMatrix;
    if (!isValid()) {
        tetromino.matrix = oldMatrix;
    }
}

function rotate() {
    rotateTetromino();
    draw();
}
function isOutsideOfGameboard(row, column) {
    return tetromino.matrix[row][column] &&
        (
            tetromino.column + column < 0
            || tetromino.column + column >= PLAYFIELD_COLUMNS
            || tetromino.row + row >= PLAYFIELD_ROWS
        );
}

function isValid() {
    const matrixSize = tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row++) {
        for (let column = 0; column < matrixSize; column++) {
            if (isOutsideOfGameboard(row, column)) { return false; }
            if (hasCollisions(row, column)) { return false; }
        }
    }
    return true;
}
function hasCollisions(row, column) {
    return tetromino.matrix[row][column] &&
        ((tetromino.row + row) >= 0) && ((tetromino.row + row) < PLAYFIELD_ROWS) &&
        ((tetromino.column + column) >= 0) && ((tetromino.column + column) < PLAYFIELD_COLUMNS) &&
        playfield[tetromino.row + row][tetromino.column + column];
}

draw();


let intervalID = setInterval(() => { moveTetrominoDown(); draw(); }, INTERVAL);


function onKeyDown(e) {
    switch (e.key) {
        case 'ArrowUp':
            rotate();
            break;
        case 'ArrowDown':
            moveTetrominoDown();
            break;
        case 'ArrowLeft':
            moveTetrominoLeft();
            break;
        case 'ArrowRight':
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
