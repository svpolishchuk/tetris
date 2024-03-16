// 1. Додати нові фігури
// 2. Стилізувати нові фігури
// 3. Додати функцію рандому котра буде поветати випадкову фігуру
// 4. Центрувати фігуру незалежно від ширини

// делаем музыку на странице
let player = document.querySelector("audio");
let musik = document.querySelector("#sound");
musik.onclick = showimg;		 //  ------ делаем переключатель звука и картинки  -
function showimg(){	
	let picture = document.querySelector("#sound img");
	let value = picture.attributes.src.nodeValue;
	console.dir(picture.attributes.src.nodeValue);
	value == "img/mute_sound.png" ?
	 (picture.attributes.src.nodeValue = "img/sound_on.png" , player.play() ) :
	 (picture.attributes.src.nodeValue = "img/mute_sound.png" , player.pause());
} 

const PLAYFIELD_COLUMNS = 15;
const PLAYFIELD_ROWS    = 15;
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

    const name   = TETROMINO_NAMES[randomIndex];
    const matrix = TETROMINOES[name];
    // console.log(matrix);
    // центрируем фигуру по центру поля
    const column = Math.floor((PLAYFIELD_COLUMNS -  matrix.length) / 2);
    // объект в котором хранится инфа об объекте  --- tetromino
    tetromino = {
        name,
        matrix,
        row: 3,
        column,
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

function rotateTetromino(){
    const oldMatrix = tetromino.matrix;
    const rotatedMatrix = rotateMatrix(tetromino.matrix);
    // showRotated = rotateMatrix(showRotated);
    tetromino.matrix = rotatedMatrix;
    if(!isValid()){
        tetromino.matrix = oldMatrix;
    }
}

draw();


function rotate(){
    rotateTetromino();
    draw();
}
// вешаем событие и слушаем действия
document.addEventListener('keydown', onKeyDown);
function onKeyDown(e){
    switch(e.key){
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
function rotateMatrix(matrixTetromino){
    const N = matrixTetromino.length;
    const rotateMatrix = [];
    for(let i = 0; i < N; i++){
        rotateMatrix[i] = [];
        for(let j = 0; j < N; j++){
            rotateMatrix[i][j] = matrixTetromino[N - j - 1][i];
        }
    }

    return rotateMatrix;
}
function moveTetrominoDown(){
    tetromino.row += 1;
    if(!isValid()){
        tetromino.row -= 1;
        placeTetromino();
    }
}
function moveTetrominoLeft(){
    tetromino.column -= 1;
    if(!isValid()){
        tetromino.column += 1;
    }
}
function moveTetrominoRight(){
    tetromino.column += 1;
    if(!isValid()){
        tetromino.column -= 1;
    }
}
function isValid(){
    const matrixSize = tetromino.matrix.length;
    for(let row = 0; row < matrixSize; row++){
        for(let column = 0; column < matrixSize; column++){
            // if(tetromino.matrix[row][column]) continue;
            if(isOutsideOfGameboard(row, column)) { return false; }
            if(hasCollisions(row, column)) { return false; }
        }
    }

    return true;
}
function isOutsideOfGameboard(row, column){
    return tetromino.matrix[row][column] && 
    (
        tetromino.column + column < 0 
        || tetromino.column + column >= PLAYFIELD_COLUMNS
        || tetromino.row + row >= PLAYFIELD_ROWS
    );
}

function hasCollisions(row, column){
    return tetromino.matrix[row][column] 
    && playfield[tetromino.row + row][tetromino.column + column];
}

