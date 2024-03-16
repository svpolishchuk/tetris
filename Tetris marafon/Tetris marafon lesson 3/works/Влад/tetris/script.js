//1. Додати нові фігури
//2. Стилізувати новів фігури
//3. Додати функцію рандому котра буде повертати випадкову фігуру
//4. Центрувати фігуру не залежно від ширини


const PLAYFIELD_COLUMS = 10;
const PLAYFIELD_ROWS   = 20;
const TETROMINO_NAMES =[
    "O","J","T","S","L","I"
]

const TETROMINOES = {
    "O":[
        [1, 1],
        [1, 1]
    ],
    'J':[
        [1, 0 ,0],
        [1, 1 ,1],
        [0, 0 ,0]
    ],
    'T':[
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    'S':[
        [1, 0],
        [1, 1],
        [0, 1]   
    ],
    'L':[
        [1, 0],
        [1, 1] 
    ],
    'I':[
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

}
let randomNum = Math.floor(Math.random() * TETROMINO_NAMES.length);
function convertPositionToIndex(row,column){
    return row * PLAYFIELD_COLUMS + column;
}

let playfield;
let tetromino;

function generatePlayField(){
    for(let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMS; i++){
        const div = document.createElement("div");
        document.querySelector(".grid").append(div);

    }

    playfield = new Array(PLAYFIELD_ROWS).fill()
                        .map( () => new Array(PLAYFIELD_COLUMS).fill());

}


function generateTetramino(){

    const name = TETROMINO_NAMES[randomNum];
    const matrix = TETROMINOES[name];

    tetromino = {
        name,
        matrix,
        row:3,
        column:Math.floor(PLAYFIELD_COLUMS/2-matrix[0].length/2)
    }
}

generatePlayField();
generateTetramino();
const cells = document.querySelectorAll(".grid div");




function drawPlayField(){
    for(let row = 0; row<PLAYFIELD_ROWS;row++){
        for(let column=0;column<PLAYFIELD_COLUMS;column++){
            if(playfield[row][column]==0){
                continue;
            }
            const name = playfield[row][column];
            const cellIndex = convertPositionToIndex(row,column);
            cells[cellIndex].classList.add(name);
        }
    }
}



function drawTetromino(){
    const name = tetromino.name;
    const tetrominoMatrixSize = tetromino.matrix.length;


    for(let row = 0; row<tetrominoMatrixSize;row++){
        for(let column=0;column<tetrominoMatrixSize;column++){
            if(!tetromino.matrix[row][column]){
                continue;
            }  
            const cellIndex = convertPositionToIndex(
                tetromino.row + row,
                tetromino.column + column
                );
            cells[cellIndex].classList.add(TETROMINO_NAMES[randomNum]);
        }
    }
    
}

function draw(){
    cells.forEach(cell => cell.removeAttribute("class"));
    drawTetromino()
    drawPlayField();
}

draw();

document.addEventListener("keydown", onKeyDown);

function onKeyDown(e){
    switch(e.key){
        case 'ArrowDown':
            moveTetraminoDown();
            break;
        case 'ArrowLeft':
                moveTetraminoLeft();
                break;
        case 'ArrowRight':
                moveTetraminoRight();
                break;
    }
    draw();
}

function moveTetraminoDown(){
    tetromino.row ++;
}
function moveTetraminoRight(){
    tetromino.column ++;
}
function moveTetraminoLeft(){
    tetromino.column --;
}
