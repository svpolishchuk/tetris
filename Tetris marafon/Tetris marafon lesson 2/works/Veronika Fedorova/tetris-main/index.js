'use strict';

const PLAY_FIELD_COLUMNS = 10;
const PLAY_FIELD_ROWS = 20;
const TETRIMINO_NAMES = ['O', 'J', 'L', 'S', 'D', 'I', 'T', 'X', 'C', 'W'];
const TETRIMINOES = {
  O: [
    [1, 1],
    [1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 1],
  ],
  S: [
    [1, 0, 0],
    [1, 1, 0],
    [0, 1, 0],
  ],
  D: [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ],
  I: [
    [1, 1, 1],
    [0, 0, 0],
    [0, 0, 0],
  ],
  T: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
  ],
  X: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
  ],
  C: [
    [1, 1, 1],
    [1, 0, 1],
    [0, 0, 0],
  ],
  W: [
    [1, 0, 0],
    [1, 1, 0],
    [0, 1, 1],
  ],
};
const tetrominoSequence = [];

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

  playfield = new Array(PLAY_FIELD_ROWS)
    .fill()
    .map(() => new Array(PLAY_FIELD_COLUMNS).fill(0));
  // console.table(playfield);
}

//This function generate random integer for the function that wiil generate random figure
function generateRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//This function generate random figure
function generateRandomTetrominoSequence() {
  const figures = TETRIMINO_NAMES;
  while (figures.length) {
    const randomNumber = generateRandomNumber(0, figures.length - 1);
    const randomTetromino = figures.splice(randomNumber, 1)[0];
    tetrominoSequence.push(randomTetromino);
  }
}

//This fucntion is where we return tetromino
function generateTetromino() {
  if (tetrominoSequence.length === 0) {
    generateRandomTetrominoSequence();
  }

  const name = tetrominoSequence.pop();
  const matrix = TETRIMINOES[name];
  const column = playfield[0].length / 2 - Math.ceil(matrix[0].length / 3);
  const row = 1;

  tetromino = {
    name: name,
    matrix,
    row: row,
    column: column,
  };
}

generatePlayField();
generateTetromino();
const cells = document.querySelectorAll('.grid div');

function drawPlayField() {
  for (let row = 0; row < PLAY_FIELD_ROWS; row++) {
    for (let column = 0; column < PLAY_FIELD_COLUMNS; column++) {
      if (playfield[row][column] === 0) continue;

      const name = playfield[row][column];
      const cellIndex = convertPositionToIndex(row, column);

      cells[cellIndex].classList.add(name);
    }
  }
}

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

      cells[cellIndex].classList.add(name);
    }
  }
}

// convertPositionToIndex();
// drawTetromino();
// drawPlayField();

function draw() {
  cells.forEach((cell) => cell.removeAttribute('class'));
  drawTetromino();
  drawPlayField();
}

draw();

document.addEventListener('keydown', onKeyDown);

function onKeyDown(eventKeyboard) {
  switch (eventKeyboard.key) {
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
