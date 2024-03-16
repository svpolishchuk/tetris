

const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;
const TETROMINO_NAMES = [
    'O',
    'J',
    'G',
    'L',
    'T',
    'S',
    'C'
]

const TETROMINOES = {
    'O': [
        [1, 1],
        [1, 1]
    ],
    'J': [
        [1,0,0],
        [1,1,1],
        [0,0,0]
    ],
    'G': [
        [0,0,1],
        [1,1,1],
        [0,0,0]
    ],
    'L': [
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0]
    ],
    'T': [
        [0,1,0],
        [1,1,0],
        [0,1,0]
    ],
    'S': [
        [1,0,0],
        [1,1,1],
        [0,0,1]
    ],
    'C': [
        [1,0],
        [1,1],
        [0,1]
    ]
}

// addEventListener("DOMContentLoaded", (event) => {
//     randomItem(TETROMINO_NAMES)
// })

function convertPositionToIndex(row, column) {
    return row * PLAYFIELD_COLUMNS + column
}

let playfield;
let tetromino;

function generatePlayField() {
    for (let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i++) {
        const div = document.createElement('div')
        document.querySelector('.grid').append(div)
    }

    playfield = new Array(PLAYFIELD_ROWS).fill().map(() => new Array(PLAYFIELD_COLUMNS).fill(1))
}

function generateTetromino() {
    const name = randomItem(TETROMINO_NAMES)
    const matrix = TETROMINOES[name]

    tetromino = {
        name,
        matrix, 
        row: 0,
        column: (PLAYFIELD_COLUMNS/2) -1
    }
}

generatePlayField()
generateTetromino()

const cells = document.querySelectorAll('.grid div')

function drawPlayField() {
    for (let row = 0; row < PLAYFIELD_ROWS; row++) {
        for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
            if (playfield[row][column] == 0) continue;
            const name = playfield[row][column]
            const cellIndex = convertPositionToIndex(row, column)
            cells[cellIndex].classList.add(name)
        }
    }
}

function drawTetromito() {
    const name = tetromino.name
    const tetrominoMatrixSize = tetromino.matrix.length

    for (let row = 0; row < tetrominoMatrixSize; row++) {
        for (let column = 0; column < tetrominoMatrixSize; column++) {
            if (!tetromino.matrix[row][column]) continue;
            const cellIndex = convertPositionToIndex(tetromino.row + row, tetromino.column + column)
            cells[cellIndex].classList.add(name)
        }
    }
}

function draw() {
    cells.forEach(cell => cell.removeAttribute('class'))
    drawTetromito()
    drawPlayField()
}
draw()

document.addEventListener('keydown', onKeyDown)
function onKeyDown(e) {
    switch (e.key) {
        case 'ArrowDown':
            moveTetrominoDown()
            break;
        case 'ArrowRight':
            moveTetrominoRight()
            break;
        case 'ArrowLeft':
            moveTetrominoLeft()
            break;
    }
    draw()
}

function moveTetrominoDown() {
    tetromino.row += 1
}

function moveTetrominoRight() {
    tetromino.column += 1
}

function moveTetrominoLeft() {
    tetromino.column -= 1
}

function randomItem(item) {
  return item[(Math.floor(Math.random() * item.length))]
}


