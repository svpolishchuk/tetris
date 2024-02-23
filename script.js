// 1. Додати нові фігури
// 2. Стилізувати фігури
// 3. Додати функцію рандому котра буде повертати випадкову фігуру
// 4. Центрувати фігуру незалежно від ширини



const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;
const TETROMINO_NAMES = [
    'O',
    'J',
    'L',
    'T',
    'Z',
    'S',
    'I'
]

const TETROMINOES = {
    "O": [
        [1, 1],
        [1, 1]
    ],
    "J": [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    "L": [
        [1, 0, 0],
        [1, 0, 0],
        [1, 1, 0]
    ],
    "T": [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0]
    ],
    "Z": [
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0]
    ],
    "S": [
        [0, 1, 0],
        [1, 1, 0],
        [1, 0, 0]
    ],
    "I": [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]
        
}

function convertPositionToIndex(row, column){
    return row * PLAYFIELD_COLUMNS + column;
}

function getRandomElement(array){
    const randomIndex = Math.floor(Math.random() * array.length)
    return array[randomIndex];
}

let playfield;
let tetromino;

function generatePlayField(){
    for(let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i++){
        const div = document.createElement(`div`);
        document.querySelector('.grid').append(div);
    }

    playfield = new Array(PLAYFIELD_ROWS).fill()
        .map( () => new Array (PLAYFIELD_COLUMNS).fill(0))
    // console.table(playfield);
}

function generateTetromino(){
    const randomFigure = Math.floor(Math.random() * TETROMINO_NAMES.length);

    const name = getRandomElement(TETROMINO_NAMES);
    const matrix = TETROMINOES[name];
    const column = PLAYFIELD_COLUMNS / 2 - Math.floor((matrix.length) / 2);
    // console.log(matrix);

    tetromino = {
        name,
        matrix,
        row: 3,
        column: column
    }
}



generatePlayField();
generateTetromino();
const cells = document.querySelectorAll('.grid div');

function drawPlayField(){
    for(let row = 0; row < PLAYFIELD_ROWS; row++){
        for(let column = 0; column < PLAYFIELD_COLUMNS; column++){
            if(playfield[row][column] == 0 ) continue;

            const name = playfield[row][column];
            const cellIndex = convertPositionToIndex(row,column);
                // console.log(cellIndex);
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
                // console.log(cellIndex);
                cells[cellIndex].classList.add(name);
        }
        //column
    }
    // row
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


