const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;

const TETROMINO_NAMES = ['O', 'J', 'I', 'T', 'Z'];
const TETROMINOES = {
    'O': [[1, 1], [1, 1]],
    'J': [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
    'I': [[1, 0, 0, 0],[1, 0, 0, 0],[1, 0, 0, 0],[1, 0, 0, 0]],
    'T': [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
    'Z': [[1, 1, 0, 0],[0, 1, 1, 0],[0, 0, 0, 0]]
}

function getRandomTetrominoName() {
    const randomIndex = Math.floor(Math.random() * TETROMINO_NAMES.length);
    return TETROMINO_NAMES[randomIndex];
}

function convertPositionToIndex(row, column) {
    return row * PLAYFIELD_COLUMNS + column;
}

let playfield;
let tetromino;

function generatePlayField() {
    for(let i = 0; i < PLAYFIELD_COLUMNS * PLAYFIELD_ROWS; i++){
        const div = document.createElement('div');
        document.querySelector('.grid').append(div);
    }

    playfield = new Array(PLAYFIELD_ROWS).fill()
        .map(()=> new Array(PLAYFIELD_COLUMNS).fill(0));
}

function generateTrtromino() {
    const name = getRandomTetrominoName();
    const matrix = TETROMINOES[name];
    tetromino = {
        name,
        matrix,
        row: 0,
        column: Math.floor((PLAYFIELD_COLUMNS - matrix[0].length)/2)
    }
}

generatePlayField();
generateTrtromino();

const cells = document.querySelectorAll('.grid div');

function drawPlayfield() {
    for(let row = 0; row < PLAYFIELD_ROWS; row++){
        for(let column = 0; column < PLAYFIELD_COLUMNS; column++) {
            if (playfield[row][column] === 0) {
                continue;
            }
            const cellIndex = convertPositionToIndex(row, column);
            cells[cellIndex].classList.add(playfield[row][column]);  
        }
    }
}

function drawTetromino() {
    const tetrominoMatrixSize = tetromino.matrix.length;
    for(let row = 0; row < tetrominoMatrixSize; row++){
        for(let column = 0; column < tetrominoMatrixSize; column++) {
            if (!tetromino.matrix[row][column]) {
                continue;
            }
            const cellIndex = convertPositionToIndex(
                tetromino.row + row, 
                tetromino.column + column);
            cells[cellIndex].classList.add(tetromino.name);    
        }
    }
}

function draw() {
    cells.forEach(cell => cell.removeAttribute('class'));
    drawTetromino();
    drawPlayfield();
}

draw();

document.addEventListener('keydown', onKeyDown);

function onKeyDown(e) {
    //console.log(e);
    const keys = ['ArrowDown', 'ArrowLeft', 'ArrowRight'/*, 'ArrowUp'*/];
    const key = e.key;
    if (keys.includes(key)) {
        moveTetromino(key);
    }
}

function moveTetromino(key){
    switch(key) {
        case 'ArrowDown':
            tetromino.row +=1;
            break;
        case 'ArrowLeft':
            tetromino.column -=1;
            break;
        case 'ArrowRight':
            tetromino.column +=1;
            break;
        /*
        case 'ArrowUp':
            tetromino.row -=1;
            break;
            */
    }
    draw();
}
