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

const PLAYFIELD_COLUMS = 10;
const PLAYFIELD_ROWS = 20;
const TETROMINO_NAMES = ["O", "J", "L", "S", "Z", "T", "I"];

let overlay = document.querySelector(".overlay");
const btnRestart = document.querySelector(".btn-restart");
btnRestart.addEventListener("click", () => {
  // document.querySelector(".grid").innerHTML = "";
  // overlay.style.display = "none";
  restart();
});

let runGame = true;
let score = 0;
let scoreDiv = document.getElementById("score");
// changeRandomBackground();
let pause = true;

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
let nextPlayfielf;
let nextTetramino;

function generateNextPlayField() {
  document.querySelector(".next").innerHTML = "";
  nextMatrixSize = nextTetramino.matrix.length;
  for (let row = 0; row < nextMatrixSize; row++) {
    for (let column = 0; column < nextMatrixSize; column++) {
      const div = document.createElement(`div`);
      if (nextTetramino.matrix[row][column]) {
        div.classList.add(nextTetramino.name);
        // document.querySelector(".next").append(div);
      }
      div.classList.add("0");
      document.querySelector(".next").append(div);
    }
  }
  // nextPlayfielf = new Array(nextMatrixSize)
  //   .fill()
  //   .map(() => new Array(nextMatrixSize).fill(0));

  document.querySelector(".next").style.gridTemplateColumns =
    "repeat(" + nextMatrixSize + ", auto)";
}

// function drawNextTetramino() {
//   // debugger;
//   const name = nextTetramino.name;
//   const nextMatrixSize = nextTetramino.matrix.length;
//   // console.log(tetraminoMatrixSize);
//   debugger;
//   for (let row = 0; row < nextMatrixSize; row++) {
//     for (let column = 0; column < nextMatrixSize; column++) {
//       try {
//         if (!nextTetramino.matrix[row][column]) continue;
//       } catch (error) {
//         // console.log(error, "\n", row, " ", column);
//       }
//       //return row * PLAYFIELD_COLUMS + column;
//       const cellIndex = row * nextMatrixSize + column; //convertPositionToIndex(
//       //   nextTetramino.row,
//       //   nextTetramino.column
//       // );
//       // console.log(cellIndex);
//       // debugger;
//       try {
//         // debugger;
//         nextCells[cellIndex].classList.add(name);
//       } catch (error) {
//         // console.log(" <<<<< --- Out --- >>>> ", error);
//         // generateTetramino();
//       }
//       // console.log(cells);
//       // if (!isValid()) generateTetramino();
//     }
//   }
// }

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

function generateNextTetramino() {
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

  nextTetramino = {
    name,
    matrix,
    row: 0,
    column: PLAYFIELD_COLUMS / 2 - 1,
  };

  generateNextPlayField();
  nextPlaceTetramino();
  // drawNextTetramino();
}

function generateTetramino() {
  if (!tetramino) {
    generateNextTetramino();
  }
  tetramino = nextTetramino;

  generateNextTetramino();

  // nextPlaceTetramino();
  console.log(" next: ", nextTetramino, "\n  carent: ", tetramino);
  score++;
  updateScore(0);
}

function nextPlaceTetramino() {
  const matrixSize = nextTetramino.matrix.length;
  for (let row = 0; row < matrixSize; row++) {
    for (let column = 0; column < matrixSize; column++) {
      // if (nextTetramino.matrix[row][column]) {
      try {
        nextPlayfielf[row][column] = nextTetramino.matrix[row][column].name;
      } catch (error) {}
      // }
    }
  }
}

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

generatePlayField();
generateTetramino();
// generateNextTetramino();

let cells = document.querySelectorAll(".grid div");

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
        // console.log(error, "\n", row, " ", column);
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
        // console.log(" <<<<< --- Out --- >>>> ", error);
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

  // drawNextTetramino();
}
draw();

document.addEventListener("keydown", onKeyDown);

function onKeyDown(e) {
  if (!runGame) {
    return;
  }
  // console.log(e);
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
  // debugger;
  const oldMatrix = JSON.parse(JSON.stringify(tetramino.matrix));
  rotateMatrix(tetramino.matrix);
  if (!isValid) {
    tetramino.matrix = oldMatrix;
  }
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
      debugger;
      muveDownPlayField(row);
      row++;
    }
  }
  // score += lines * 10;
  updateScore(lines);
  // console.log("lines ", lines, "\nScore = ", score);
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

function moveDown() {
  if (!runGame) {
    gameOver();
    return;
  }
  // moveTetraminoDown();
  // draw();

  if (pause) {
    moveTetraminoDown();
    draw();
  }
  // cancelAnimationFrame(timtId);
  // timtId = clearTimeout(timtId);
  timeOutId = setTimeout(() => {
    timeId = requestAnimationFrame(moveDown);
  }, 700);
}

let timeId = null;
let timeOutId = null;
moveDown();

// let interval = 700;
// let intervalId = setInterval(()=>{requestAnimationFrame(gameLoop)}, interval);

// let interval = 700;
// let intervalId = setInterval(gameLoop, interval);

// function gameLoop() {
//   moveDown();
//   if (pause) {
//     moveTetraminoDown();
//     draw();
//   }
// }

function gameOver() {
  cancelAnimationFrame(timeOutId);
  timeId = clearTimeout(timeId);
  console.log(" G A M E  O V E R ");
  // clearInterval(intervalId);
  runGame = false;
  overlay.style.display = "flex";
}

function restart() {
  tetramino = null;
  document.querySelector(".grid").innerHTML = "";
  generatePlayField();
  cells = document.querySelectorAll(".grid div");
  generateTetramino();
  drawPlayField();
  drawTetramino();
  runGame = true;
  // display: none;
  overlay.style.display = "none";
  score = 0;
  updateScore(0);
  draw();
  moveDown();
}
