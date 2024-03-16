"use strict";

import {  generateColorfulTitleForHeader } from "./modules/_header.js";
import {
    PLAYFIELD_COLUMNS,
    PLAYFIELD_ROWS,
    TETROMINO_NAMES,
    TETROMINOES,
    TETRIS_STYLES,
    GAME_STYLES_BTNS,
    COLOR_PICKER,
    INFO_WINDOW_BTN,
    COLOR_PALETTES,
    SOUND_ROTATE_SRC,
    SOUND_MOVE_SRC,
    SOUND_DROP_SRC,
    MAXIMUM_POINTS,
    CLEARED_LINES,
    LEVEL,
    GAME_TIME,
    ICON_SOUND,
    ICON_PAUSE,
} from "./constants/_constants.js";
import { drawTetrisDecorationTetrominoes } from "./modules/_decor.js";

let gameStyle = localStorage.getItem("gameStyle") || TETRIS_STYLES[0];
let playfield = [];
let tetromino = {};
let tetrominoColor = null;
let tetrisColor = localStorage.getItem("tetrisColor") || "#ffa500";

let indexMatrixTetromino = 0;

let statisticsAndOptions = {
    maximumPoints: 0,
    pointsScore: {
        touchdown: 10,
        cleanOneLine: 100,
        cleanTwoLines: 0,
        cleanThreeLines: 0,
        cleanFourLines: 0,
        multiplier: 3,
        countPoints() {
            this.cleanTwoLines = this.cleanOneLine * this.multiplier;
            this.cleanThreeLines = this.cleanTwoLines * this.multiplier;
            this.cleanFourLines = this.cleanThreeLines * this.multiplier;
        },
    },
    clearedLines: 0,
    level: 1,
    pointsToNextLevel: 50,
    multiplierToNextLevel: 1.5,
    calculatePointsToNextLevel() {
        this.pointsToNextLevel += Math.floor(this.pointsToNextLevel * this.multiplierToNextLevel);
    },
    nextTetromino: {
        tetromino: null,
        matrix: null,
        color: null,
        field: {
            rows: 2,
            columns: 4,
            matrix: [],
        },
    },
    soundOn: false,
    isGamePaused: true,
    startGameTime: Date.now(),
    timeBeforePause: 0,
    gameTime: null,
    fallRate: 1,// 0.5 - 2 блоки в секунду | 1 - 1 блок в секунду
    multiplierFallRate: 0.1,
};
statisticsAndOptions.pointsScore.countPoints();

MAXIMUM_POINTS.innerHTML = statisticsAndOptions.maximumPoints;
CLEARED_LINES.innerHTML = statisticsAndOptions.clearedLines;
LEVEL.innerHTML = statisticsAndOptions.level;

let gameTimer = setInterval( countingTime, 1000);
let canTetrominoMove = null;


COLOR_PICKER.value = tetrisColor;

coloringTetris();
generateColorfulTitleForHeader();
drawTetrisDecorationTetrominoes();

generatePlayField();
generateNextTetrominoField();
generateTetromino();


const cells = document.querySelectorAll(".play-field__cell");
tetrominoFalls();
// draw();



function generateColorForTetromino(gameStyle = "classic") {
    switch (gameStyle) {
        case "bubble":  return COLOR_PALETTES[1][Math.floor(Math.random() * COLOR_PALETTES[1].length)];
        case "skull":   return COLOR_PALETTES[2][0];
        case "classic": return;
        default:        return COLOR_PALETTES[0][Math.floor(Math.random() * COLOR_PALETTES[0].length)];
    }
}

function coloringTetris() {
    document.querySelector(".tetris").style.backgroundColor = tetrisColor;
    document.querySelector(".tetris__title").style.backgroundColor = tetrisColor;
}

function generatePlayField() {
    const PLAY_FIELD = document.querySelector(".play-field");

    for (let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i++) {
        const cell = document.createElement("div");
        cell.classList.add("play-field__cell", `${gameStyle}-bg`);
        PLAY_FIELD.append(cell);
    }

    playfield = new Array(PLAYFIELD_ROWS)
        .fill()
        .map(() => new Array(PLAYFIELD_COLUMNS).fill(0));
}

function generateNextTetrominoField() {
    const NEXT_TETROMINO_FIELD = document.getElementById("next-tetromino");
    const rows = statisticsAndOptions.nextTetromino.field.rows;
    const columns = statisticsAndOptions.nextTetromino.field.columns;

    for (let i = 0; i < rows * columns; i++) {
        const cell = document.createElement("div");
        cell.classList.add("next-tetromino__cell", `${gameStyle}-bg`);
        NEXT_TETROMINO_FIELD.append(cell);
    }

    statisticsAndOptions.nextTetromino.field.matrix = new Array(rows)
        .fill()
        .map(() => new Array(columns).fill(0));
}

function generateTetromino() {
    const name = statisticsAndOptions.nextTetromino.tetromino || TETROMINO_NAMES[Math.floor(Math.random() * TETROMINO_NAMES.length)];
    statisticsAndOptions.nextTetromino.tetromino = TETROMINO_NAMES[Math.floor(Math.random() * TETROMINO_NAMES.length)];
    statisticsAndOptions.nextTetromino.matrix = TETROMINOES[statisticsAndOptions.nextTetromino.tetromino][0];
    
    const matrix = TETROMINOES[name][0];
    const rowTetro = -2; // -2

    tetromino = {
        name,
        matrix,
        row: rowTetro,
        column: Math.ceil((PLAYFIELD_COLUMNS - matrix.length) / 2),

    };
    tetrominoColor = statisticsAndOptions.nextTetromino.color || generateColorForTetromino(gameStyle);
    statisticsAndOptions.nextTetromino.color = generateColorForTetromino(gameStyle);

    // console.log("--------------------");
    // console.log(`tetrominoColor: ${tetrominoColor} nextTetromino.color: ${statisticsAndOptions.nextTetromino.color}`);
    // console.log("--------------------");
}

function convertPositionToIndex(row, column) {
    return row * PLAYFIELD_COLUMNS + column;
}

function drawPlayField() {
    for (let row = 0; row < PLAYFIELD_ROWS; row++) {
        for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
            if (playfield[row][column] == 0) continue;

            const name = playfield[row][column];
            let [cellClass, cellColor] = name.split(" ");
            
            const cellIndex = convertPositionToIndex(row, column);
            cells[cellIndex].classList.add(cellClass);
            
            cells[cellIndex].style.backgroundColor = cellColor;

            if ( gameStyle === "classic") continue;

            let img = document.createElement("img");
            img.src = `./img/${gameStyle}.png`;

            cells[cellIndex].append(img);
        }
    }
}

function drawNextTetrominoField() {
    const matrixRows = statisticsAndOptions.nextTetromino.field.rows;
    const matrixColumns = statisticsAndOptions.nextTetromino.field.columns;
    const nextTetrominoMatrix = statisticsAndOptions.nextTetromino.field.matrix;
    for (let row = 0; row < matrixRows; row++) {
        for (let column = 0; column < matrixColumns; column++) {
            if( nextTetrominoMatrix[row][column] == 0 ) { continue };

            const name = nextTetrominoMatrix[row][column];
            
            const cellIndex = row * matrixRows + column;
            
            let img = document.createElement("img");
            img.src = `./img/${gameStyle}.png`;

            cells[cellIndex].append(img);
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
                tetromino.column + column,
            );
            
            if( cellIndex >= 0 ) cells[cellIndex].classList.add(`${gameStyle}-block`);

            if (gameStyle == "classic") continue;

            if( cellIndex >= 0 ) {
                let img = document.createElement("img");
                img.src = `./img/${gameStyle}.png`;

                cells[cellIndex].append(img);
                cells[cellIndex].style.backgroundColor = tetrominoColor;
            }
        }
    }
}

function drawNextTetromino() {
    const tetrominoMatrixSize = statisticsAndOptions.nextTetromino.matrix.length;
    const cells = document.querySelectorAll(".next-tetromino__cell");

    for (let row = 0; row < tetrominoMatrixSize; row++) {
        for (let column = 0; column < tetrominoMatrixSize; column++) {
            if (!statisticsAndOptions.nextTetromino.matrix[row][column]) continue;
            const cellIndex = row * statisticsAndOptions.nextTetromino.field.columns + column
            
            if( cellIndex >= 0 ) cells[cellIndex].classList.add(`${gameStyle}-block`);

            if (gameStyle == "classic") continue;

            if( cellIndex >= 0 ) {
                cells[cellIndex].innerHTML = "";
                let img = document.createElement("img");
                img.src = `./img/${gameStyle}.png`;

                cells[cellIndex].append(img);
                cells[cellIndex].style.backgroundColor = statisticsAndOptions.nextTetromino.color;
            }
        }
    }
}

function drawStableTetromino() {
    
}

function draw() {
    cells.forEach((cell) => {
        cell.classList.remove(`${gameStyle}-block`);
        cell.innerHTML = "";
        cell.removeAttribute("style");
    });

    document.querySelectorAll(".next-tetromino__cell").forEach((cell) => {
        cell.classList.remove(`${gameStyle}-block`);
        cell.removeAttribute("style");
    });

    drawPlayField();
    drawNextTetrominoField();
    drawTetromino();
    drawNextTetromino()
    
    drawStableTetromino();
}


function tetrominoFalls() {
    let time = statisticsAndOptions.fallRate;
    
    
    canTetrominoMove = setInterval( ()=> {

        if( canTetrominoMove && time != statisticsAndOptions.fallRate ) {
            clearInterval(canTetrominoMove);
            canTetrominoMove = null;
            tetrominoFalls();
        }

        if( !statisticsAndOptions.isGamePaused ) {
            moveTetrominoDown();
            draw();
        } else {
            clearInterval(canTetrominoMove);
            canTetrominoMove = null;
        }

    }, time * 1000);
}

function isOutsideOfGameboard( row, column ) {

    return tetromino.matrix[row][column] && 
    (
        tetromino.column + column < 0 ||
        tetromino.column + column >= PLAYFIELD_COLUMNS ||
        tetromino.row + row >= PLAYFIELD_ROWS
    );
}

function hasCollisions( row, column ) {
    if ( tetromino.row >= 0) {
        return tetromino.matrix[row][column] &&
            playfield[tetromino.row + row][tetromino.column + column];
    }
}

function isValid() {
    const matrixSize = tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row++) {
        for (let column = 0; column < matrixSize; column++) {
            if ( isOutsideOfGameboard( row, column ) ) { return false };
            if ( hasCollisions( row, column) ) { return false };
        }
    }
    return true;
}

function canRotateTetromino() {
    if ( tetromino.column + tetromino.matrix.length > PLAYFIELD_COLUMNS ) { return false; }
    if ( tetromino.column === -1 ) { return false; }

    return true;
}

function isLevelUp() {
    let points = statisticsAndOptions.maximumPoints;
    let pointsToNextLvl = statisticsAndOptions.pointsToNextLevel;
    if ( points >= pointsToNextLvl ) {
        statisticsAndOptions.level++;
        statisticsAndOptions.calculatePointsToNextLevel();
        LEVEL.innerHTML = statisticsAndOptions.level;

        if( statisticsAndOptions.fallRate <= 0.1 ) { return };
        statisticsAndOptions.fallRate -= statisticsAndOptions.multiplierFallRate;
    }
}

function placeTetromino() {
    const matrixSize = tetromino.matrix.length;
    // console.log(tetromino.matrix);
    for (let row = 0; row < matrixSize; row++) {
        for (let column = 0; column < matrixSize; column++) {
            if ( tetromino.matrix[row][column] ) {
                playfield[tetromino.row + row][tetromino.column + column] = `stable-${gameStyle}-block ${tetrominoColor}`;
            }
        }
    }
    
    statisticsAndOptions.maximumPoints += statisticsAndOptions.pointsScore.touchdown;
    isLevelUp();

    MAXIMUM_POINTS.innerHTML = statisticsAndOptions.maximumPoints;
    generateTetromino();
}

function onKeyDown(e) {
    let soundSrc = null;

    if( e.code == "KeyP" ) { togglePause(); }
    if( statisticsAndOptions.isGamePaused ) return;

    switch (e.code) {
        case "KeyW":
            rotate();
            soundSrc = SOUND_ROTATE_SRC;
            break;
        case "KeyS":
            moveTetrominoDown();
            soundSrc = SOUND_MOVE_SRC;
            break;
        case "KeyA":
            moveTetrominoLeft();
            soundSrc = SOUND_MOVE_SRC;
            break;
        case "KeyD":
            moveTetrominoRight();
            soundSrc = SOUND_MOVE_SRC;
            break;
        case "ControlLeft":
            genNewTetromino();
            // soundSrc = SOUND_;
            break;
        case "Space":
            moveDrop();
            soundSrc = SOUND_DROP_SRC;
            break;
        default:
            break;
    }
    draw();
    if( statisticsAndOptions.soundOn && soundSrc ) playSound( soundSrc );
}

function rotate() {
    // rotateTetromino(); //origin
    if ( canRotateTetromino() ) {
        indexMatrixTetromino = indexMatrixTetromino >= TETROMINOES[tetromino.name].length - 1 ?
                            0 : 
                            ++indexMatrixTetromino;
        tetromino.matrix = TETROMINOES[tetromino.name][indexMatrixTetromino];
    } 
}

function moveTetrominoDown() {
    tetromino.row++;
    if( !isValid() ) {
        tetromino.row--;
        placeTetromino();
    }
}

function moveTetrominoLeft() {
    tetromino.column--;
    if ( !isValid() ) {
        tetromino.column++;
    }
}

function moveTetrominoRight() {
    tetromino.column++;
    if ( !isValid() ) {
        tetromino.column--;
    }
}

function moveDrop() {
    
}

function genNewTetromino() {
    // tetrominoColor = generateColorForTetromino(gameStyle);
    generateTetromino();
    // drawTetromino();
}

function playSound(src) {
    loadSound(src)
            .then( (result) => {
                result.play();
            }).catch( (err) => {
                console.log(err);
            });
}

function showInfoWindow() {
    document.querySelector(".info-window").classList.toggle("active");
    document.querySelector(".info-window__arrow").classList.toggle("active");
}


function loadSound(src) {
    return new Promise( (resolve, reject) => {
        const SOUND = new Audio(src);
        SOUND.oncanplaythrough = () => {
            resolve(SOUND);
        }
        SOUND.onerror = (error) => {
            reject( new Error( "Failed to load sound: " + error.message ) );
        };
    });
}

function toggleSound() {
    statisticsAndOptions.soundOn = !statisticsAndOptions.soundOn;
    if( statisticsAndOptions.soundOn ) { 
        ICON_SOUND.style.opacity = 0.5;
    } else {
        ICON_SOUND.style.opacity = 1;
    };
}

function togglePause() {
    // console.log(statisticsAndOptions.isGamePaused);
    statisticsAndOptions.isGamePaused = !statisticsAndOptions.isGamePaused;
    document.querySelector(".display__pause-title").classList.toggle("none");

    if( statisticsAndOptions.isGamePaused ) { 
        
        ICON_PAUSE.style.opacity = 1;
        
        statisticsAndOptions.timeBeforePause = Date.now() - statisticsAndOptions.startGameTime;

        clearInterval(gameTimer);
        gameTimer = null;
    } else {
        ICON_PAUSE.style.opacity = 0.5;
        
        statisticsAndOptions.startGameTime = Date.now() - statisticsAndOptions.timeBeforePause;
        gameTimer = setInterval( countingTime, 1000);
        tetrominoFalls();
    };
}

function countingTime() {
    if ( !statisticsAndOptions.isGamePaused ) {
        let difference = Date.now() - statisticsAndOptions.startGameTime;
        let minutes = Math.floor( difference / 60000 );
        let seconds = Math.floor( (difference % 60000) / 1000 );
        
        statisticsAndOptions.gameTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`

        GAME_TIME.innerHTML = statisticsAndOptions.gameTime;

        // setInterval( countingTime, 1000);
    }
}


localStorage.getItem("btnStyle") ? 
    GAME_STYLES_BTNS[ localStorage.getItem("btnStyle") ].classList.add("active") :
    GAME_STYLES_BTNS[0].classList.add("active");


document.addEventListener("keydown", onKeyDown);

GAME_STYLES_BTNS.forEach( ( btn, index ) => {
    btn.addEventListener("click", () => {
        gameStyle = btn.dataset.style;
        localStorage.setItem("gameStyle", gameStyle);
        localStorage.setItem("btnStyle", index);
        location.reload();
    });
} );

COLOR_PICKER.addEventListener("input", (e) => {
    tetrisColor = e.target.value;
    localStorage.setItem("tetrisColor", tetrisColor);
    coloringTetris();
});

INFO_WINDOW_BTN.addEventListener("click", showInfoWindow);

ICON_SOUND.addEventListener("click", toggleSound);

ICON_PAUSE.addEventListener("click", togglePause);

export { gameStyle,generateColorForTetromino };

