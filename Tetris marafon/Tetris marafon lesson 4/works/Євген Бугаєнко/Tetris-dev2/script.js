// Ctrl Shift i

function changeRandomBackground() {
  var body = document.body;

  // Масив із зображеннями фону
  var backgrounds = ["fon1.jpeg", "fon2.jpeg", "fon3.jpeg", "fon4.jpeg"];

  // Генеруємо випадковий індекс
  var randomIndex = Math.floor(Math.random() * backgrounds.length);
  // Встановлюємо новий фон
  body.style.background =
    "url('Img/fon3_1.png'),url('Img/fon3_1.png'),url('Img/" +
    backgrounds[randomIndex] +
    "') no-repeat center center fixed";
  // "url('" + backgrounds[randomIndex] + "') no-repeat center center fixed";
  body.style.backgroundSize = "cover";
}
let runGame = true;
let score = 0;
let scoreDiv = document.getElementById("score");
// changeRandomBackground();
let pause = true;
const PLAYFIELD_COLUMS = 10;
const PLAYFIELD_ROWS = 20;
const TETROMINO_NAMES = ["O", "J", "L", "S", "Z", "T", "I"];

const TETRAMINOES = {
  O: [
    [1, 1],
    [1, 1],
  ],

  J: [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0],

    // [ 1, 1],
    // [ 1],
    // [ 1]
  ],

  L: [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1],

    // [1],
    // [1],
    // [1, 1]
  ],

  S: [
    [1, 0, 0],
    [1, 1, 0],
    [0, 1, 0],

    // [1],
    // [1, 1],
    // [0, 1]
  ],

  Z: [
    [0, 1, 0],
    [1, 1, 0],
    [1, 0, 0],

    // [0, 1],
    // [1, 1],
    // [1]
  ],

  T: [
    [0, 1, 0],
    [1, 1, 0],
    [0, 1, 0],

    // [1],
    // [1, 1],
    // [1]
  ],

  I: [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],

    // [1],
    // [1],
    // [1],
    // [1]

    // [1],[1],[1],[1]
  ],
};

function convertPositionToIndex(row, column) {
  return row * PLAYFIELD_COLUMS + column;
}

let playfielf;
let tetramino;

function generatePlayField() {
  for (let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMS; i++) {
    const div = document.createElement(`div`);
    document.querySelector(".grid").append(div);
  }
  playfielf = new Array(PLAYFIELD_ROWS)
    .fill()
    .map(() => new Array(PLAYFIELD_COLUMS).fill(0));
}

function rotateMatrix(matrix) {
  // Транспонування матриці
  for (var i = 0; i < matrix.length; i++) {
    for (var j = i + 1; j < matrix[i].length; j++) {
      // Обмін елементів [i][j] та [j][i]
      var temp = matrix[i][j];
      matrix[i][j] = matrix[j][i];
      matrix[j][i] = temp;
    }
  }
  // Реверс кожного рядка матриці
  for (var i = 0; i < matrix.length; i++) {
    matrix[i].reverse();
  }
}

function generateTetramino() {
  if (!runGame) return;
  //Випадкова фігура
  const rndTetramino = Math.floor(Math.random() * TETROMINO_NAMES.length);

  const name = TETROMINO_NAMES[rndTetramino];
  const matrix = TETRAMINOES[name];
  console.log(matrix);

  //Випадкове положення фігури
  const rndTurn = Math.floor(Math.random() * 4);
  for (let index = 0; index < rndTurn; index++) {
    rotateMatrix(matrix);
  }

  tetramino = {
    name,
    matrix,
    row: 0,
    column: PLAYFIELD_COLUMS / 2 - 1,
  };
  console.log(tetramino);
  score++;
  updateScore(0);
}

//++++++++++
function placeTetramino() {
  const matrixSize = tetramino.matrix.length;
  for (let row = 0; row < matrixSize; row++) {
    for (let column = 0; column < matrixSize; column++) {
      if (tetramino.matrix[row][column]) {
        playfielf[tetramino.row + row][tetramino.column + column] =
          tetramino.name;
      }
    }
  }
  checkField();
  generateTetramino();
}

//-----------

generatePlayField();
generateTetramino();

const cells = document.querySelectorAll(".grid div");

function drawPlayField() {
  for (let row = 0; row < PLAYFIELD_ROWS; row++) {
    for (let column = 0; column < PLAYFIELD_COLUMS; column++) {
      if (playfielf[row][column] == 0) continue;

      const name = playfielf[row][column];
      const cellIndex = convertPositionToIndex(row, column);
      cells[cellIndex].classList.add(name);

      // console.log(cells);
      // debugger;
    }
    // debugger;
    if (checkLine(row)) {
      console.log("line", row);
    }
  }
}

function drawTetramino() {
  // debugger;
  const name = tetramino.name;
  const tetraminoMatrixSize = tetramino.matrix.length;
  // console.log(tetraminoMatrixSize);

  for (let row = 0; row < tetraminoMatrixSize; row++) {
    for (let column = 0; column < tetraminoMatrixSize; column++) {
      try {
        if (!tetramino.matrix[row][column]) continue;
      } catch (error) {
        console.log(error, "\n", row, " ", column);
      }
      const cellIndex = convertPositionToIndex(
        tetramino.row + row,
        tetramino.column + column
      );
      // console.log(cellIndex);
      // debugger;
      try {
        cells[cellIndex].classList.add(name);
      } catch (error) {
        console.log(" <<<<< --- Out --- >>>> ", error);
        // generateTetramino();
      }
      // console.log(cells);
      if (!isValid()) generateTetramino();
    }
  }
}

function draw() {
  cells.forEach((cell) => cell.removeAttribute("class"));
  drawPlayField();
  drawTetramino();
}
draw();

document.addEventListener("keydown", onKeyDown);

function onKeyDown(e) {
  if (!runGame) {
    return;
  }
  console.log(e);
  switch (e.key) {
    case "ArrowDown":
      moveTetraminoDown();
      break;
    case "ArrowLeft":
      moveTetraminoLeft();
      break;
    case "ArrowRight":
      moveTetraminoRight();
      break;
    case "ArrowUp":
      moveTetraminoUp();
      break;
    case "Escape":
      pause = !pause;
      break;

    case " ":
      generateTetramino();
      break;
    // Space
  }
  draw();
}

function moveTetraminoDown() {
  tetramino.row += 1;
  if (!isValid()) {
    tetramino.row -= 1;
    // generateTetramino();
    placeTetramino();
  }
}

function moveTetraminoUp() {
  rotateMatrix(tetramino.matrix);
  // tetramino.row -= 1;
}

function moveTetraminoLeft() {
  tetramino.column -= 1;
  if (!isValid()) {
    tetramino.column += 1;
  }
}
function moveTetraminoRight() {
  tetramino.column += 1;
  if (!isValid()) {
    tetramino.column -= 1;
  }
}

let interval = 700;
let intervalId = setInterval(gameLoop, interval);

function gameLoop() {
  if (pause) {
    moveTetraminoDown();
    draw();
  }
}

// ==========

function isValid() {
  const matrixsize = tetramino.matrix.length;
  for (let row = 0; row < matrixsize; row++) {
    for (let column = 0; column < matrixsize; column++) {
      // if (tetramino.matrix[row][column]) continue;
      if (isOutsideOfGameboard(row, column)) {
        return false;
      }
      if (hasCollision(row, column) && tetramino.row == 0) {
        gameOver();
        return false;
      }
      if (hasCollision(row, column)) {
        return false;
      }
    }
  }
  return true;
}

function isOutsideOfGameboard(row, column) {
  return (
    tetramino.matrix[row][column] &&
    (tetramino.column + column < 0 ||
      tetramino.column + column >= PLAYFIELD_COLUMS ||
      tetramino.row + row >= PLAYFIELD_ROWS)
  );
}

function hasCollision(row, column) {
  return (
    tetramino.matrix[row][column] &&
    playfielf[tetramino.row + row][tetramino.column + column]
  );
}

function checkField() {
  let lines = 0;
  for (let row = playfielf.length - 1; row > 0; row--) {
    if (checkLine(row)) {
      lines++;
      // debugger;
      muveDownPlayField(row);
      row++;
    }
  }
  // score += lines * 10;
  updateScore(lines);
  console.log("lines ", lines, "\nScore = ", score);
}

function checkLine(row) {
  // debugger;
  for (let column = 0; column < playfielf[row].length; column++) {
    if (playfielf[row][column] == 0) return false;
  }
  return true;
}

function muveDownPlayField(row) {
  for (row; row > 1; row--) {
    for (let column = 0; column < playfielf[row].length; column++) {
      playfielf[row][column] = playfielf[row - 1][column];
    }
  }

  changeRandomBackground();
}

function updateScore(lines) {
  score += lines * 10 * lines;

  scoreDiv.innerText = "SCORE: " + score;
  console.log("lines ", lines, "\nScore = ", score);
}

function gameOver() {
  console.log(" G A M E  O V E R ");
  clearInterval(intervalId);
  runGame = false;
}
