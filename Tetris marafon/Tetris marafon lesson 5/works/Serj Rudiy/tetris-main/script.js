const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;
const TETROMINO_NAMES = [
  'O',
  'J',
  'G',
  'I',
  'Z',
  'S',
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
  'G': [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0]
  ],
  'I': [
    [1,0,0,0],
    [1,0,0,0],
    [1,0,0,0],
    [1,0,0,0],
  ],
  'Z': [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0]
  ],
  'S': [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0]
  ],
  'T': [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
}
let playfield;
let tetromino;

function convertPositionToIndex(row, column) {
  return row * PLAYFIELD_COLUMNS + column;
}

function generatePlayField() {
  for (let index = 0; index < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; index++) {
    // const element = array[index];
    const div = document.createElement(`div`);
    document.querySelector(".grid").append(div);
  }
  playfield = new Array(PLAYFIELD_ROWS)
    .fill()
    .map(() => new Array(PLAYFIELD_COLUMNS).fill(0));
 }

function generateTetromino() {
  const name = TETROMINO_NAMES[6];
  const matrix = TETROMINOES[name];
  console.log(matrix);
  tetromino = {
    name,
    matrix,
    row: 0,
    column: 3
  }
}

generatePlayField();
generateTetromino();
const cells = document.querySelectorAll('.grid div');
function drawPlayField() {
  for (let row = 0; row < PLAYFIELD_ROWS; row++) {
    for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
      if (playfield[row][column] == 0) continue;
      const name = playfield[row][column];
      const cellIndex = convertPositionToIndex(row, column);
      // console.log(cellIndex);
      cells[cellIndex].classList.add(name);
    }
  }
}

function drawTetromino() {
  const name = tetromino.name;
  const tetrominoMatrixSize = tetromino.matrix.length;
  // cells[15].classList.add(TETROMINO_NAMES[0]);   
  for (let row = 0; row < tetrominoMatrixSize; row++) {
    for (let column = 0; column < tetrominoMatrixSize; column++) {
      if (!tetromino.matrix[row][column]) continue;
      const cellIndex = convertPositionToIndex(
        tetromino.row + row,
        tetromino.column + column
      );
      // console.log(cellIndex);
      cells[cellIndex].classList.add(TETROMINO_NAMES[6]);
    }
  }
}

function draw() {
  cells.forEach(cell => cell.removeAttribute('class'))
  drawPlayField();
  drawTetromino();
}

draw();

document.addEventListener('keydown', OnKeyDown)
function OnKeyDown(e) {
  // console.log(e);
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

    // default:
    //   break;
  }
  draw();
}


function moveTetrominoDown() {
  tetromino.row += 1;
  drawTetromino();
}
function moveTetrominoLeft() {
  tetromino.column -= 1;
  drawTetromino();
}
function moveTetrominoRight() {
  tetromino.column += 1;
  drawTetromino();
}