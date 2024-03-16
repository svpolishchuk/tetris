const PLAY_FIELD_COLUMNS = 10;
const PLAY_FIELD_ROWS = 20;
const TETRIMINO_NAMES = [
    'O',
    'J',
    'T',
    'F',
    'U',
    'I',
    'Z',
    'Q'
];
const TETRIMINOES = {
  'O': [
    [1,1],
    [1,1]
  ],
  'J': [
    [1,0,0],
    [1,1,1],
    [0,0,0],
    ],
  'T': [
      [1, 1, 1],
      [0, 1, 0],
      [0, 0, 0]
    ],
    'F': [
        [1, 1, 1],
        [1, 0, 0],
        [1, 0, 0]      
    ],
    'U': [
        [1, 1, 1],
        [1, 0, 1],
        [0, 0, 0]
    ],
    'I': [
        [0,1,0],
        [0,1,0],
        [0, 1, 0],
        [0,1,0],
    ],
    'Z': [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 1]
    ],
    'Q': [
        [1]
    ]
};

function convertPositionToIndex(row, column) {
  return row * PLAY_FIELD_COLUMNS + column;
}

let playfield;
let tetromino;


function generatePlayField() {
  for (let i = 0; i < PLAY_FIELD_ROWS * PLAY_FIELD_COLUMNS; i++) {
    const div = document.createElement('div');
    document.querySelector('.grid').append(div);
  }

  playfield = new Array(PLAY_FIELD_ROWS).fill()
    .map( () => new Array(PLAY_FIELD_COLUMNS).fill(0) );
  // console.table(playfield);
}

function generateTetromino() {

    let x = Math.floor(Math.random() * 7);

  const name = TETRIMINO_NAMES[x];
  const matrix = TETRIMINOES[name];

  // console.log(matrix);
  tetromino = {
    name: TETRIMINO_NAMES[x],
    matrix,
    row: 2,
    column: 4
  }
}


generatePlayField();
generateTetromino();
const cells = document.querySelectorAll('.grid div');



function drawPlayField() {
  for(let row = 0; row < PLAY_FIELD_ROWS; row++) {
    for(let column = 0; column < PLAY_FIELD_COLUMNS; column++) {
      if(playfield[row][column] === 0) continue;

      const name = playfield[row][column];
      const cellIndex = convertPositionToIndex( row, column );
      
      // console.log(cellIndex);
      cells[cellIndex].classList.add(name);

    }
  }
}



function drawTetromino() {
  const name = tetromino.name;
  const tetrominoMatrixSize = tetromino.matrix.length;


  for(let row = 0; row < tetrominoMatrixSize; row++) {
    for(let column = 0; column < tetrominoMatrixSize; column++) {
      if(!tetromino.matrix[row][column]) continue;

      const cellIndex = convertPositionToIndex(
        tetromino.row + row,
        tetromino.column + column
      );
      
      console.log(cellIndex);
      cells[cellIndex].classList.add(name);
    }
    //column
  }
  //row
}

// convertPositionToIndex();
// drawTetromino();
// drawPlayField();



function draw() {
  cells.forEach(cell => cell.removeAttribute('class'));
  drawTetromino();
  drawPlayField();
}

draw();

document.addEventListener('keydown', onKeyDown);

function onKeyDown(eventKeyboard) {
  switch(eventKeyboard.key) {
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
