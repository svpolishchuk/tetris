const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;
const TETROMINO_NAMES = ['O', 'J', 'L', 'S', 'Z', 'T', 'I']
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
        [0, 0, 0]
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
    ],
    "I": [
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]
}


function convertPositionToIndex(row, column) {
    return row * PLAYFIELD_COLUMNS + column;
}

let playField;
let tetromino;

function generatePlayField() {
    for (let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i++) {
        const div = document.createElement('div');
        document.querySelector('.grid').append(div);
    }
    playField = new Array(PLAYFIELD_ROWS).fill()
        .map(() => new Array(PLAYFIELD_COLUMNS).fill(0))
}

function generateTetromino() {
    const index = Math.floor(Math.random() * TETROMINO_NAMES.length);
    const name = TETROMINO_NAMES[index];

    const matrix = TETROMINOES[name];

    tetromino = {
        name,
        matrix,
        row: 1,
        column: 4
    }
}

generatePlayField()
generateTetromino()
const cells = document.querySelectorAll('.grid div');

function drawPlayField() {
    for (let row = 0; row < PLAYFIELD_ROWS; row++) {
        for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
            if (playField[row][column] == 0) continue;

            const name = playField[row][column]
            const cellIndex = convertPositionToIndex(row, column);
            cells[cellIndex].classList.add(name)
        }
    }
}

function drawTetromino() {
    const name = tetromino.name;
    const tetrominoRows = tetromino.matrix.length;
    const tetrominoColumns = tetromino.matrix[0].length;

    for (let row = 0; row < tetrominoRows; row++) {
        for (let column = 0; column < tetrominoColumns; column++) {
            if (!tetromino.matrix[row][column]) continue
            const cellIndex = convertPositionToIndex(
                tetromino.row + row,
                tetromino.column + column,
            );
            cells[cellIndex].classList.add(name)
        }
    }
}
drawPlayField()
drawTetromino()

function draw() {
    cells.forEach(cell => cell.removeAttribute('class'))
    drawPlayField()
    drawTetromino()
}
draw()

document.addEventListener('keydown', onKeyDown)

function onKeyDown(e) {
    switch (e.key) {
        case 'ArrowDown':
            moveTetroMinoDown();
            break;
        case 'ArrowLeft':
            moveTetroMinoLeft();
            break;
        case 'ArrowRight':
            moveTetroMinoRight();
            break;
    }
    draw()
}
function moveTetroMinoDown() {
    tetromino.row += 1
}
function moveTetroMinoLeft() {
    tetromino.column -= 1
}
function moveTetroMinoRight() {
    tetromino.column += 1
}