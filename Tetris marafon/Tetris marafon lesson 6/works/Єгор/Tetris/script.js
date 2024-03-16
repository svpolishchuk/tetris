
runGame = true;
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
  

    ],
  
    L: [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
  
     
    ],
  
    S: [
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 0],
  
    
    ],
  
    Z: [
      [0, 1, 0],
      [1, 1, 0],
      [1, 0, 0],
  
      
    ],
  
    T: [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 0],
  
    ],
  
    I: [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
  
     
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
  
  function getRandomElement(array){
    const randomIndex = Math.floor(Math.random() * array.length)
    return array[randomIndex];
}
  
  function generateTetramino() {
   

    const rndTetramino = Math.floor(Math.random() * TETROMINO_NAMES.length);
  
    const name = TETROMINO_NAMES[rndTetramino];
    const matrix = TETRAMINOES[name];
    // console.log(matrix);
  
    
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
    // console.log(tetramino);
    score++;
    updateScore(0);
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
  
  const cells = document.querySelectorAll(".grid div");
  
  function drawPlayField() {
    for (let row = 0; row < PLAYFIELD_ROWS; row++) {
      for (let column = 0; column < PLAYFIELD_COLUMS; column++) {
        if (playfielf[row][column] == 0) continue;
  
        const name = playfielf[row][column];
        const cellIndex = convertPositionToIndex(row, column);
        cells[cellIndex].classList.add(name);
  
        
      }
  
      if (checkLine(row)) {
        console.log("line", row);
      }
    }
  }
  
  function drawTetromino(){
    const name = tetramino.name;
    const tetrominoMatrixSize = tetramino.matrix.length;
    
    for(let row = 0; row < tetrominoMatrixSize; row++){
        for(let column = 0; column < tetrominoMatrixSize; column++){
           
            if(!tetramino.matrix[row][column]) continue;
            const cellIndex = convertPositionToIndex(
                tetramino.row + row,
                tetramino.column + column
            );
            
            cells[cellIndex].classList.add(name);
        }
      
    }
    
}
  
  function draw() {
    cells.forEach((cell) => cell.removeAttribute("class"));
    drawPlayField();
    drawTetromino();
  }
  draw();
  
  document.addEventListener("keydown", onKeyDown);
  
  function onKeyDown(e) {
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
      
  
     
    }
    draw();
  }
  
  function rotateMatrix(matrix) {
    
    for (let i = 0; i < matrix.length; i++) {
      for (let j = i + 1; j < matrix[i].length; j++) {
        var temp = matrix[i][j];
        matrix[i][j] = matrix[j][i];
        matrix[j][i] = temp;
      }
    }
 
    for (var i = 0; i < matrix.length; i++) {
      matrix[i].reverse();
    }
  }

  function moveTetraminoDown() {
    tetramino.row += 1;
    if (!isValid()) {
      tetramino.row -= 1;
   
      placeTetramino();
    }
  }
  
  function moveTetraminoUp() {
    rotateMatrix(tetramino.matrix);
 
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
  

 

  
  function isValid() {
    const matrixsize = tetramino.matrix.length;
    for (let row = 0; row < matrixsize; row++) {
      for (let column = 0; column < matrixsize; column++) {
      //  if (hasCollision(row, column) && tetramino.row == 0) {  gameOver();return false; }
        if (isOutsideOfGameboard(row, column)) { return false}
        if (hasCollision(row, column)) {return false;}
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
        moveDownPlayField(row);
        row++;
        
      }
    }
  
    updateScore(lines);
    console.log("lines ", lines, "\nScore = ", score);
  }
  
  function checkLine(row) {
    
    for (let column = 0; column < playfielf[row].length; column++) {
      if (playfielf[row][column] == 0) return false;
    }
    return true;
  }
  
  function moveDownPlayField(row) {
    for (row; row > 1; row--) {
      for (let column = 0; column < playfielf[row].length; column++) {
        playfielf[row][column] = playfielf[row - 1][column];
      }
    }
  }
  
  function updateScore(lines) {
    score += lines * 10 ;
  
    scoreDiv.innerText = "SCORE: " + score;
    console.log("lines ", lines, "\nScore = ", score);
  }
  
  function gameOver() {
    console.log(" G A M E  O V E R ");
    clearInterval(intervalId);
    runGame = false;
  }
  



