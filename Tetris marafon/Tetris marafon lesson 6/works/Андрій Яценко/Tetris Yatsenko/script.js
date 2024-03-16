    const PLAYFIELD_COLUMNS = 10;
    const PLAYFIELD_ROWS = 20;

    const TETROMINO_NAMES = [
        'O',
        'J',
        'L',
        'Z',
        'S',
        'I',
        'T'
    ]
    const TETROMINOES = {
        'O' : 
        [
            [1,1],
            [1,1]
        ],
        'J' :
        [
            [1,0,0],
            [1,1,1],
            [0,0,0]

        ],
        'S' :
        [
            [0,1,1],
            [1,1,0],
            [0,0,0]
        ],
        'Z' :
        [
            [1,1,0],
            [0,1,1],
            [0,0,0]
        ],
        'L' :
        [
            [0,0,0],
            [0,0,1],
            [1,1,1]
        ],
        'I' :
        [
            [0,0,0,0],
            [1,1,1,1],
            [0,0,0,0],
            [0,0,0,0],

        ],
        'T' :
        [
            [0,1,0],
            [1,1,1],
            [0,0,0]
        ]
        
    }

    function convertPositionToIndex(row, column)
    {
        return row * PLAYFIELD_COLUMNS + column;
    }

    let playfield;
    let tetromino;
    let score = 0;
    let intervalId;
    let speed = 1000;

    function generatePlayField()
    {
        for (let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i++)
        {
            const div = document.createElement('div');
            document.querySelector('.grid').append(div);
        }

        playfield = new Array(PLAYFIELD_ROWS).fill()
            .map(()=> new Array(PLAYFIELD_COLUMNS).fill(0))
    }
    generatePlayField();

    function getRandomIndex(array)
    {
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }

    function rotate()
    {
        rotateTetromino();
        draw();
    }

    function generateTetromino(index) 
    {
        
        const name = getRandomIndex(TETROMINO_NAMES);
        const matrix = TETROMINOES[name];
        const column = PLAYFIELD_COLUMNS /2 - Math.floor(matrix.length  / 2);
        tetromino = {
            name,
            matrix,
            row: 0,
            column: column
        };
    }

    function placeTetromino()
    {
        const matrixSize = tetromino.matrix.length;
        for (let row = 0; row < matrixSize; row++)
        {
            for (let column = 0; column < matrixSize; column++)
            {
                if(tetromino.matrix[row][column]){
                    playfield[tetromino.row + row][tetromino.column + column] = tetromino.name;
                }   
            }
        }
        generateTetromino();

    }

    const cells = document.querySelectorAll('.grid div');

    function drawPlayField()
    {
        for (let row = 0; row < PLAYFIELD_ROWS; row ++)
        {
            for (let column = 0; column < PLAYFIELD_COLUMNS; column++) 
            {
                if (playfield[row][column] == 0) continue;
                const name = playfield[row][column];
                const cellIndex = convertPositionToIndex
                (row, column);
                cells[cellIndex].classList.add(name);
            }
        }
    }
    function drawTetromino()
    {
        const name = tetromino.name;
        const tetrominoMatrixSize = tetromino.matrix.length;

        for (let row = 0; row < tetrominoMatrixSize; row ++)
        {
            for (let column = 0; column < tetrominoMatrixSize; column++) 
            {
                if (!tetromino.matrix[row][column]) continue;
                const cellIndex = convertPositionToIndex(
                    tetromino.row + row,
                    tetromino.column + column
                );
                cells[cellIndex].classList.add(name);
            }
        }
        
    }



    function draw()
    {
        cells.forEach(cell => cell.removeAttribute('class'));
        drawPlayField();
        drawTetromino();
    }

    document.addEventListener('keydown', onKeyDown)

    function onKeyDown(e)
    {
        switch(e.code)
        {
            case 'ArrowUp' : rotate();
            break;
            case 'ArrowDown' : moveTetrominoDown();
            break;
            case 'ArrowLeft' : moveTetrominoLeft();
            break;
            case 'ArrowRight' : moveTetrominoRight();
            break;
            case 'Space' : generateTetromino();
            break;

        }
        draw();
    }


    function rotateTetromino()
    {
        const oldMatrix = tetromino.matrix;
        const rotatedMatrix = rotateMatrix(tetromino.matrix);

        tetromino.matrix = rotatedMatrix;

        if (!isValid())
        {
            tetromino.matrix = oldMatrix;
        }
    }

    function rotateMatrix(matrixTetromino)
    {
        const N = matrixTetromino.length;
        const rotateMatrix = []; 
        for (let i = 0; i < N; i++)
        {
            rotateMatrix[i] = [];
            for ( let j = 0; j < N; j++)
            {
                rotateMatrix[i][j] = matrixTetromino[N - j -1][i];
            }
        }

        return rotateMatrix;
    }

    function moveTetrominoDown()
    {
        tetromino.row += 1;
        if (!isValid())
        {
            tetromino.row -=1;
            placeTetromino();
            clearField();
            generateTetromino();
            updateSpeed();
        }
        draw();
    }
    function moveTetrominoLeft()
    {
        tetromino.column -= 1;
        if (!isValid())
        {
            tetromino.column += 1;
        }
    }
    function moveTetrominoRight()
    {
        tetromino.column += 1;
        if (!isValid())
        {
            tetromino.column -= 1;
        }
    }

    function isValid()
    {
        const matrixSize = tetromino.matrix.length;
        for (let row = 0; row < matrixSize; row++)
        {
            for (let column = 0; column < matrixSize; column++)
            {   
                if (isOutsideOffGameboard(row, column)) return false;
                if (hasCollision(row, column)) return false;
            }
        }
        return true;
    }

    function isOutsideOffGameboard(row, column)
    {
        
    return tetromino.matrix[row][column] && 
        (
            tetromino.column + column < 0 
                || tetromino.column + column >= PLAYFIELD_COLUMNS
                    || tetromino.row + row >= PLAYFIELD_ROWS
        );
    }

    function clearField()
    {     
        let rowsCleared = 0; 
        for(let row = PLAYFIELD_ROWS - 1; row > 0; row--)
        {         
            let isRowFull = true;         
            for(let column = 0; column < PLAYFIELD_COLUMNS; column++)
            {
                if (!playfield[row][column]) {
                    isRowFull = false;
                    break;
                }        
            }         
            if (isRowFull)
            {             
                rowsCleared++;             
                playfield[row].fill(0);             
                for(let row1 = row - 1; row1 > 0; row1--)
                {                 
                    playfield[row1 + 1] = playfield[row1].slice();             
                }             
                playfield[0] = new Array(PLAYFIELD_COLUMNS).fill(0);             
                row++; 
            }     
        } 
        if (rowsCleared > 0) {
            updateScore(rowsCleared); 
        }
    };

    function hasCollision(row, column)
    {
        return tetromino.matrix[row][column] 
            && playfield[tetromino.row + row][tetromino.column + column];
    }
    generateTetromino();
    draw();

    function updateScore(rowsCleared) {
        switch (rowsCleared) {
            case 1:
                score += 10;
                break;
            case 2:
                score += 30;
                break;
            case 3:
                score += 50;
                break;
            case 4:
                score += 100;
                break;
            default:
                break;
        }
        document.getElementById('score').textContent = score;
        updateSpeed();
    }

    function startGame() {
        clearInterval(intervalId);
        intervalId = setInterval(moveTetrominoDown, speed);
    }

    function updateSpeed() {
        const speedIncrease = Math.floor(score / 200) * 0.05;
        const newSpeed = 1000 * (1 - speedIncrease);
        speed = Math.max(100, newSpeed);
        clearInterval(intervalId);
        intervalId = setInterval(moveTetrominoDown, speed);
    }

    function moveTetrominoDown() {
        tetromino.row += 1;
        if (!isValid()) {
            tetromino.row -= 1;
            placeTetromino();
            clearField();
            generateTetromino();
            updateSpeed();
        }
        draw();
    }
    function moveTetrominoLeft() {
        tetromino.column -= 1;
        if (!isValid()) {
            tetromino.column += 1;
        }
    }
    function moveTetrominoRight() {
        tetromino.column += 1;
        if (!isValid()) {
            tetromino.column -= 1;
        }
    }

    function isValid() {
        const matrixSize = tetromino.matrix.length;
        for (let row = 0; row < matrixSize; row++) {
            for (let column = 0; column < matrixSize; column++) {   
                if (isOutsideOffGameboard(row, column)) return false;
                if (hasCollision(row, column)) return false;
            }
        }
        return true;
    }

    function isOutsideOffGameboard(row, column) {
        
    return tetromino.matrix[row][column] && 
        (
            tetromino.column + column < 0 
                || tetromino.column + column >= PLAYFIELD_COLUMNS
                    || tetromino.row + row >= PLAYFIELD_ROWS
        );
    }

    function clearField() {     
        let rowsCleared = 0; 
        for(let row = PLAYFIELD_ROWS - 1; row > 0; row--) {         
            let isRowFull = true;         
            for(let column = 0; column < PLAYFIELD_COLUMNS; column++) {
                if (!playfield[row][column]) {
                    isRowFull = false;
                    break;
                }        
            }         
            if (isRowFull) {             
                rowsCleared++;             
                playfield[row].fill(0);             
                for(let row1 = row - 1; row1 > 0; row1--) {                 
                    playfield[row1 + 1] = playfield[row1].slice();             
                }             
                playfield[0] = new Array(PLAYFIELD_COLUMNS).fill(0);             
                row++; 
            }     
        } 
        if (rowsCleared > 0) {
            updateScore(rowsCleared); 
        }
    };

    function hasCollision(row, column) {
        return tetromino.matrix[row][column] 
            && playfield[tetromino.row + row][tetromino.column + column];
    }
    generateTetromino();
    draw();

    function updateScore(rowsCleared) {
        switch (rowsCleared) {
            case 1:
                score += 10;
                break;
            case 2:
                score += 30;
                break;
            case 3:
                score += 50;
                break;
            case 4:
                score += 100;
                break;
            default:
                break;
        }
        document.getElementById('score').textContent = score;
        updateSpeed();
    }

    function startGame() {
        clearInterval(intervalId);
        intervalId = setInterval(moveTetrominoDown, speed);
    }

    startGame();
