const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;
const TETROMINO_NAMES = [
    'O',
    'J',
    'L',
    'I',
    'S',
    'Z',
    'T'
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
        [0, 0, 0]
    ],
    'I': [
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
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

}

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
        .map(() =>
            new Array(PLAYFIELD_COLUMNS).fill(0)
        )
    // console.log(playfield);
}

function chooseTetromino() {
    return Math.floor(Math.random() * 7);
}

function generateTetromino() {
    const index = chooseTetromino();
    const name = TETROMINO_NAMES[index];
    const matrix = TETROMINOES[name];
    // console.log(matrix);
    tetromino = {
        name,
        color: 'red',
        matrix,
        row: 3,
        column: 4

    }
}

generatePlayField();
generateTetromino();
const cells = document.querySelectorAll('.grid div');
function drawPlayField() {
    for (let row = 0; row < PLAYFIELD_ROWS; row++) {
        for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
            if (playfield[row][column] == 0) continue;
            const name = playfield[row, column];
            const cellIndex = convertPositionToIndex(row, column);

            cells[cellIndex].classList.add(name);

        }
    }
}

let findColor = function () {
    const hex = '0123456789ABCDEF';
    let color = '#'
    for (let i = 0; i < 6; i++) {
        let index = Math.floor(Math.random() * 16);
        color += hex[index];
    }
    if (color == '#808080') {
        return findColor();
    }
    return color;
}
let color = findColor();
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
            // console.log(cellIndex);
            cells[cellIndex].style.backgroundColor = color;
            cells[cellIndex].classList.add(name);
        }
    }
}

function draw() {
    cells.forEach(cell => {
        cell.removeAttribute('class');
        cell.style.backgroundColor = 'grey';
    });

    drawPlayField();
    drawTetromino();
}
draw();

document.addEventListener('keydown', onKeyDown);
function onKeyDown(e) {
    switch (e.key) {
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
}

function moveTetrominoLeft() {
    tetromino.column -= 1;
}

function moveTetrominoRight() {
    tetromino.column += 1;
}