// 1. Додати нові фігури+
// 2. Стилізувати нові фігури+
// 3. Додати функцію рандому котра буде поветати випадкову фігуру+
// 4. Центрувати фігуру незалежно від ширини



const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS    = 20;
const TETROMINO_NAMES = ['O','L','A', `l`, `S`, `T`,`SS`,`LL`,`K`]

const TETROMINOES = {
    'O': [
        [1,1],
        [1,1]
    ],
    'L': [
        [0,1,0],
        [0,1,0],
        [0,1,1]
    ],
    'LL': [
        [0,1,0],
        [0,1,0],
        [1,1,0]
    ],
    'A': [
        [0,1,0],
        [1,1,1],
        [0,1,0]
    ],
    'l': [
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0]
    ],
    'S': [
        [1,0,0],
        [1,1,0],
        [0,1,0]
    ],
    'T': [
        [0,1,0],
        [0,1,0],
        [1,1,1]
    ],
    'SS': [
        [0,0,1],
        [0,1,1],
        [0,1,0]
    ],
    'K': [
        [0,0,0],
        [0,1,0],
        [1,1,1]
    ]
}

function convertPositionToIndex(row, column){
    return row * PLAYFIELD_COLUMNS + column;
}

let playfield;
let tetromino;
let randomInt = getRandomInt(0, 8);

function generatePlayField(){
    for(let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i++){
        const div = document.createElement(`div`);
        document.querySelector('.grid').append(div);
    }

    playfield = new Array(PLAYFIELD_ROWS).fill()
            .map( ()=> new Array(PLAYFIELD_COLUMNS).fill(0) )
    
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function generateTetromino(){

    const name = TETROMINO_NAMES[randomInt];
    const matrix = TETROMINOES[name];
    
    tetromino = {
        name,
        matrix,
        row: 0,
        column: 3
    }
}

generatePlayField();
generateTetromino();
getRandomInt();
const cells = document.querySelectorAll('.grid div');

function drawPlayField(){
    for(let row = 0; row < PLAYFIELD_ROWS; row++){
        for(let column = 0; column < PLAYFIELD_COLUMNS; column++){
            if(playfield[row][column] == 0) continue;
            
            const name = playfield[row][column];
            const cellIndex = convertPositionToIndex(row,column);
            cells[cellIndex].classList.add(name);
        }
    }
}

function drawTetromino(){
    const name = tetromino.name;
    const tetrominoMatrixSize = tetromino.matrix.length;
    
    for(let row = 0; row < tetrominoMatrixSize; row++){
        for(let column = 0; column < tetrominoMatrixSize; column++){
            if(!tetromino.matrix[row][column]) continue;
            const cellIndex = convertPositionToIndex(
                tetromino.row + row,
                tetromino.column + column
            );
            cells[cellIndex].classList.add(name);
        }
    }
}


function draw(){
    cells.forEach(cell => cell.removeAttribute('class'));
    drawPlayField();
    drawTetromino();
}

draw();

document.addEventListener('keydown', onKeyDown);
function onKeyDown(e){
    switch(e.key){
        case 'ArrowDown':
            moveTetrominoDown();
            break;
        case 'ArrowLeft':
            moveTetrominoLeft();
            break;
        case 'ArrowRight':
            moveTetrominoRight();
            break;
        case 'ArrowUp':
            moveTetrominoUp();
            break;
    }

    draw();
}


function moveTetrominoDown(){
    tetromino.row += 1;
    
}
function moveTetrominoLeft(){
    tetromino.column -= 1;
}
function moveTetrominoRight(){
    tetromino.column += 1;
}
function moveTetrominoUp(){
    tetromino.row -= 1;
}

