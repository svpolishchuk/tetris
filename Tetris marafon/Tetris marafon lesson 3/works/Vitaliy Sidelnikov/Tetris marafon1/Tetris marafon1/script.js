// 1. Додати нові фігури
// 2. Стилізувати нові фігури
// 3. Додати функцію рандому котра буде поветати випадкову фігуру
// 4. Центрувати фігуру незалежно від ширини



const PLAYFIELD_COLUMNS = 15;
const PLAYFIELD_ROWS    = 20;
const TETROMINO_NAMES = [
    'O',
    'J',
    'l',
    'M',
    'N'
]

const TETROMINOES = {
    'O': [
        [1,1],
        [1,1]
    ],
    'J': [
        [1,0,0],
        [1,1,1],
        [0,0,0]
    ],
    'l': [
        [0,0,0],
        [1,1,1],
        [0,0,0]
    ],
    'M': [
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0]
    ],
    'N': [
        [1,0,0],
        [1,0,0],
        [1,0,0]
    ]
}
// случайное число
// var cats = ["Барсик", "Мурзик", "Рыжик", "Васька"];
let randomIndex = Math.floor(Math.random() * 5);
console.log(TETROMINO_NAMES[randomIndex]);

function convertPositionToIndex(row, column){
    return row * PLAYFIELD_COLUMNS + column;
}

let playfield;
let tetromino;
// function generatePlayField -- создаём поле игры,генерируем элементы-- квадратики
function generatePlayField(){
    for(let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i++){
        const div = document.createElement(`div`);
        document.querySelector('.grid').append(div);
    }

    playfield = new Array(PLAYFIELD_ROWS).fill()
                    .map( ()=> new Array(PLAYFIELD_COLUMNS).fill(0) )
    // console.table(playfield);
}
// function generateTetromino --  отрисовываем фигуру на поле
function generateTetromino(){

    const name = TETROMINO_NAMES[randomIndex];
    const matrix = TETROMINOES[name];
    // console.log(matrix);
    // объект в котором хранится инфа об объекте  --- tetromino
    tetromino = {
        name,
        matrix,
        row: 3,
        column: 4
    }
}

generatePlayField();
generateTetromino();
const cells = document.querySelectorAll('.grid div');

function drawPlayField(){
    for(let row = 0; row < PLAYFIELD_ROWS; row++){
        for(let column = 0; column < PLAYFIELD_COLUMNS; column++){
            if(playfield[row][column] == 0) continue;
            
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
        // column
    }
    // row
}
// drawTetromino();
// drawPlayField();

function draw(){
    cells.forEach(cell => cell.removeAttribute('class'));
    drawPlayField();
    drawTetromino();
}

draw();
// вешаем событие и слушаем действия
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

