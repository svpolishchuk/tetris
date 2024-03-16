"use strict";

import "./modules/_body-height.js";
import "./modules/_loader.js";
import "./modules/_i18n.js";

// prettier-ignore
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
    RESTART_BTN,
    PAUSE_BTN,
    ROTATE_BTN,
    DOWN_BTN,
    LEFT_BTN,
    RIGHT_BTN,
    HEADER_TITLE,
    headerTitleText,
    DECOR_ELEMENTS,
    PLAY_FIELD,
    NEXT_TETROMINO_FIELD,
    INFO_WINDOW,
    INFO_WINDOW_ARROW,
    PAUSE_TITLE,
    GAME_OVER_TITLE,
    AUDIO_PLAYER
} from "./constants/_constants.js";

import "./modules/_tetromine-rain.js";

let tetrisColor = localStorage.getItem("tetrisColor") || "#454545"; /* gameSettings */

const check = {
    isSupportsWebP() {
        const canvas = document.createElement("canvas");
        if ((canvas?.getContext("2d"))) {
            return canvas.toDataURL("image/webp").startsWith("data:image/webp");
        }
    
        return false;
    },
    isOutsideOfGameboard(row, column) {
        return gameSettings.tetromino.matrix[row][column] && 
            (gameSettings.tetromino.column + column < 0 || 
            gameSettings.tetromino.column + column >= PLAYFIELD_COLUMNS || 
            gameSettings.tetromino.row + row >= PLAYFIELD_ROWS);
    },
    hasCollisions(row, column) {
        if (gameSettings.tetromino.row >= 0) {
            return gameSettings.tetromino.matrix[row][column] && 
            gameSettings.playfield[gameSettings.tetromino.row + row][gameSettings.tetromino.column + column];
        }
    },
    isValid() {
        const matrixSize = gameSettings.tetromino.matrix.length;
        for (let row = 0; row < matrixSize; row++) {
            for (let column = 0; column < matrixSize; column++) {
                if (this.isOutsideOfGameboard(row, column)) {
                    return false;
                }
                if (this.hasCollisions(row, column)) {
                    return false;
                }
            }
        }
        return true;
    },
    canRotateTetromino() {
        return (gameSettings.tetromino.column + gameSettings.tetromino.matrix.length <= PLAYFIELD_COLUMNS) && 
                (gameSettings.tetromino.column !== -1);
    },
    isLevelUp() {
        let points = currentGame.maximumPoints;
        let pointsToNextLvl = currentGame.pointsToNextLevel;
        return ( points >= pointsToNextLvl );
    },
};

const gameSettings = {
    soundOn: false,
    isGamePaused: true,
    gameStartTime: Date.now(),
    timeBeforePause: 0,
    gameTime: null,
    fallRate: 1, // 0.5 - 2 блоки в секунду | 1 - 1 блок в секунду
    multiplierFallRate: 0.1,
    gameOver: false,
    styleGame: localStorage.getItem("styleGame") || TETRIS_STYLES[0],
    playfield: [],
    tetromino: {},
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
    tetrominoColor: null,
    indexMatrixTetromino: 0,
    imageFormat: check.isSupportsWebP() ? "webp" : "png",
    cells: null,
    nextTetrominoCells: null,
    resetSettings() {
        this.soundOn = false;
        this.isGamePaused = true;
        this.gameStartTime = Date.now();
        this.timeBeforePause = 0;
        this.gameTime = null;
        this.fallRate = 1; 
        this.multiplierFallRate = 0.1;
        this.gameOver = false;
        this.styleGame = localStorage.getItem("styleGame") || TETRIS_STYLES[0];
        this.playfield = [];
        this.tetromino = {};
        this.nextTetromino = {
            tetromino: null,
            matrix: null,
            color: null,
            field: {
                rows: 2,
                columns: 4,
                matrix: [],
            },
        };
        this.tetrominoColor = null;
        this.indexMatrixTetromino = 0;
    },
};

const generate = {
    colorForTetromino() {
        return COLOR_PALETTES[gameSettings.styleGame][Math.floor(Math.random() * COLOR_PALETTES[gameSettings.styleGame].length)];
    },
    playField() {
        for (let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i++) {
            const cell = document.createElement("div");
            cell.classList.add("play-field__cell", `${gameSettings.styleGame}-bg`);
            PLAY_FIELD.append(cell);
        }
    
        gameSettings.playfield = new Array(PLAYFIELD_ROWS).fill().map(() => new Array(PLAYFIELD_COLUMNS).fill(0));
    },
    nextTetrominoField() {
        const rows = gameSettings.nextTetromino.field.rows;
        const columns = gameSettings.nextTetromino.field.columns;
    
        for (let i = 0; i < rows * columns; i++) {
            const cell = document.createElement("div");
            cell.classList.add("next-tetromino__cell", `${gameSettings.styleGame}-bg`);
            NEXT_TETROMINO_FIELD.append(cell);
        }
    
        gameSettings.nextTetromino.field.matrix = new Array(rows).fill().map(() => new Array(columns).fill(0));
    },
    tetromino() {
        gameSettings.indexMatrixTetromino = 0;
        const name = gameSettings.nextTetromino.tetromino || TETROMINO_NAMES[Math.floor(Math.random() * TETROMINO_NAMES.length)];
        gameSettings.nextTetromino.tetromino = TETROMINO_NAMES[Math.floor(Math.random() * TETROMINO_NAMES.length)];
        gameSettings.nextTetromino.matrix = TETROMINOES[gameSettings.nextTetromino.tetromino][0];
    
        const matrix = TETROMINOES[name][0];
        const rowTetro = -2;
    
        gameSettings.tetromino = {
            name,
            matrix,
            row: rowTetro,
            column: Math.ceil((PLAYFIELD_COLUMNS - matrix.length) / 2),
        };
        
        gameSettings.tetrominoColor = gameSettings.nextTetromino.color || generate.colorForTetromino(gameSettings.styleGame);
        gameSettings.nextTetromino.color = generate.colorForTetromino(gameSettings.styleGame);
    },
    generateTetrisDecorationField(decorBlock) {
        const DECORATIVE_PLAYFIELD_ROWS = 23;
        const DECORATIVE_PLAYFIELD_COLUMNS = 2;
        // prettier-ignore
        const DECORATIVE_TETROMINOES = [
            0, 1,
            1, 1,
            1, 0,
            0, 0,
            1, 0,
            1, 1,
            1, 0,
            0, 0,
            1, 1,
            1, 1,
            0, 0,
            0, 1,
            1, 1,
            0, 1,
            0, 0,
            1, 1,
            0, 1,
            0, 1,
            0, 0,
            1, 0,
            1, 0,
            1, 0,
            1, 0,
        ];
    
        for (let i = 0; i < DECORATIVE_PLAYFIELD_ROWS * DECORATIVE_PLAYFIELD_COLUMNS; i++) {
            const decorCell = document.createElement("div");
            decorCell.classList.add("decor-cell");
    
            if (DECORATIVE_TETROMINOES[i]) {
                decorCell.classList.add(`${gameSettings.styleGame}-bg`);
            }
    
            decorBlock.append(decorCell);
        }
    }
};

function convertPositionToIndex(row, column) {
    return row * PLAYFIELD_COLUMNS + column;
}

const gameRenderer = {
    colorfulTitleForHeader() {    
        HEADER_TITLE.innerHTML = HEADER_TITLE.innerHTML
            .split("")
            .map((letter) => {
                let color = generate.colorForTetromino(gameSettings.styleGame);
                return `<span style="color: ${color};">${letter}</span>`;
            })
            .join("");
    },
    drawPlayField() {
        for (let row = 0; row < PLAYFIELD_ROWS; row++) {
            for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
                if (gameSettings.playfield[row][column] == 0) continue;
    
                const name = gameSettings.playfield[row][column];
                let [cellClass, cellColor] = name.split(" ");
    
                const cellIndex = convertPositionToIndex(row, column);
                gameSettings.cells[cellIndex].classList.add(cellClass);
    
                gameSettings.cells[cellIndex].style.backgroundColor = cellColor;
    
                let img = document.createElement("img");
                img.src = `./img/${gameSettings.styleGame}.${gameSettings.imageFormat}`;
    
                gameSettings.cells[cellIndex].append(img);
            }
        }
    },
    drawInformFieldForNextTetromino() {
        const matrixRows = gameSettings.nextTetromino.field.rows;
        const matrixColumns = gameSettings.nextTetromino.field.columns;
        const nextTetrominoMatrix = gameSettings.nextTetromino.field.matrix;
        for (let row = 0; row < matrixRows; row++) {
            for (let column = 0; column < matrixColumns; column++) {
                if (nextTetrominoMatrix[row][column] == 0) {
                    continue;
                }
    
                const cellIndex = row * matrixRows + column;
    
                let img = document.createElement("img");
                img.src = `./img/${gameSettings.styleGame}.${gameSettings.imageFormat}`;
    
                gameSettings.cells[cellIndex].append(img);
            }
        }
    },
    drawTetromino() {
        const tetrominoMatrixSize = gameSettings.tetromino.matrix.length;
    
        for (let row = 0; row < tetrominoMatrixSize; row++) {
            for (let column = 0; column < tetrominoMatrixSize; column++) {
                if (!gameSettings.tetromino.matrix[row][column]) continue;
                const cellIndex = convertPositionToIndex(gameSettings.tetromino.row + row, gameSettings.tetromino.column + column);
    
                if (cellIndex >= 0) {
                    let img = document.createElement("img");
                    img.src = `./img/${gameSettings.styleGame}.${gameSettings.imageFormat}`;
    
                    gameSettings.cells[cellIndex].append(img);
                    gameSettings.cells[cellIndex].style.backgroundColor = gameSettings.tetrominoColor;
                    gameSettings.cells[cellIndex].classList.add(`${gameSettings.styleGame}-block`);
                }
            }
        }
    },
    drawNextTetromino() {
        const tetrominoMatrixSize = gameSettings.nextTetromino.matrix.length;
        // const nextTetrominoCells = document.querySelectorAll(".next-tetromino__cell");
    
        for (let row = 0; row < tetrominoMatrixSize; row++) {
            for (let column = 0; column < tetrominoMatrixSize; column++) {
                if (!gameSettings.nextTetromino.matrix[row][column]) continue;
                const cellIndex = row * gameSettings.nextTetromino.field.columns + column;
    
                if (cellIndex >= 0) gameSettings.nextTetrominoCells[cellIndex].classList.add(`${gameSettings.styleGame}-block`);
    
                if (cellIndex >= 0) {
                    gameSettings.nextTetrominoCells[cellIndex].innerHTML = "";
                    let img = document.createElement("img");
                    img.src = `./img/${gameSettings.styleGame}.${gameSettings.imageFormat}`;
    
                    gameSettings.nextTetrominoCells[cellIndex].append(img);
                    gameSettings.nextTetrominoCells[cellIndex].style.backgroundColor = gameSettings.nextTetromino.color;
                }
            }
        }
    },
    draw() {
        if (gameSettings.isGamePaused) return;
        gameSettings.cells.forEach((cell) => {
            cell.classList.remove(`${gameSettings.styleGame}-block`);
            cell.innerHTML = "";
            cell.removeAttribute("style");
        });
    
        document.querySelectorAll(".next-tetromino__cell").forEach((cell) => {
            cell.innerHTML = "";
            cell.classList.remove(`${gameSettings.styleGame}-block`);
            cell.removeAttribute("style");
        });
    
        gameRenderer.drawPlayField();
        gameRenderer.drawInformFieldForNextTetromino();
        gameRenderer.drawTetromino();
        gameRenderer.drawNextTetromino();
    },
    drawTetrisDecorationTetrominoes() {
        
    
        generate.generateTetrisDecorationField(DECOR_ELEMENTS[0], gameSettings.styleGame);
        generate.generateTetrisDecorationField(DECOR_ELEMENTS[1], gameSettings.styleGame);
    },
    coloringTetris() {
        document.querySelector(".tetris").style.backgroundColor = tetrisColor;
        document.querySelector(".tetris__title").style.backgroundColor = tetrisColor;
    },
    // redrawTheGameStyle() {
    //     gameSettings.resetSettings();

    //     HEADER_TITLE.innerHTML = "TETRIS";

    //     for (const btn of GAME_STYLES_BTNS) {
    //         btn.classList.remove("active");
    //     }

    //     for (const cell of document.querySelectorAll(".play-field__cell")) {
    //         cell.remove();
    //     }

    //     NEXT_TETROMINO_FIELD.innerHTML = "";

    //     DECOR_ELEMENTS[0].innerHTML = "";
    //     DECOR_ELEMENTS[1].innerHTML = "";

    //     initGame();
        
    //     gameSettings.isGamePaused = false;
    //     document.querySelector(".display__pause-title").classList.add("none");
    //     togglePause(); 
    //     clearInterval(stepInterval);
    //     GAME_TIME.innerHTML = "00:00";

    // } // почекає до кращих часів)
};

const pointsScore = {
    touchdown: 10,
    cleanOneLine: 100,
    cleanTwoLines: 0,
    cleanThreeLines: 0,
    cleanFourLines: 0,
    multiplier: 1.5,
    countPoints() {
        this.cleanTwoLines = this.cleanOneLine * this.multiplier;
        this.cleanThreeLines = this.cleanTwoLines * this.multiplier;
        this.cleanFourLines = this.cleanThreeLines * this.multiplier;
    },
};

const currentGame = {
    maximumPoints: 0,
    clearedLines: 0,
    level: 1,
    pointsToNextLevel: 50,
    multiplierToNextLevel: 1.5,
    calculatePointsToNextLevel() {
        this.pointsToNextLevel += Math.floor(this.pointsToNextLevel * this.multiplierToNextLevel);
    },
};

const control = {
    rotate() {
        if (check.canRotateTetromino()) {
            gameSettings.indexMatrixTetromino = ( gameSettings.indexMatrixTetromino >= TETROMINOES[gameSettings.tetromino.name].length - 1 ) ?
                0 : 
                ++gameSettings.indexMatrixTetromino;
            gameSettings.tetromino.matrix = TETROMINOES[gameSettings.tetromino.name][gameSettings.indexMatrixTetromino];
        }
    },
    moveTetrominoDown() {
        gameSettings.tetromino.row++;
        if (!check.isValid()) {
            gameSettings.tetromino.row--;
            handleTetrominoInteraction();
        }
    },
    moveTetrominoLeft() {
        gameSettings.tetromino.column--;
        if (!check.isValid()) {
            gameSettings.tetromino.column++;
        }
    },
    moveTetrominoRight() {
        gameSettings.tetromino.column++;
        if (!check.isValid()) {
            gameSettings.tetromino.column--;
        }
    },
    moveDrop() {
        while (check.isValid()) {
            gameSettings.tetromino.row++;
        }
        gameSettings.tetromino.row--;
    },
    genNewTetromino() {
        generate.tetromino();
    },
};

const sound = {
    play(src) {
        sound.load(src)
            .then((result) => {
                result.play();
            })
            .catch((err) => {
                console.log(err);
            });
    },
    load(src) {
        return new Promise((resolve, reject) => {
            const SOUND = new Audio(src);
            SOUND.oncanplaythrough = () => {
                resolve(SOUND);
            };
            SOUND.onerror = (error) => {
                reject(new Error("Failed to load sound: " + error.message));
            };
        });
    },
    toggle() {
        gameSettings.soundOn = !gameSettings.soundOn;
        ICON_SOUND.style.opacity = ( gameSettings.soundOn ) ? 0.5 : 1;
    },
};

function resetALL() {
    console.log("----------------------------------");
    console.log("------------RESET DONE------------");
    console.log("----------------------------------");

    HEADER_TITLE.innerHTML = headerTitleText;
    DECOR_ELEMENTS.forEach( element => {
        element.innerHTML = "";
    } );
    PLAY_FIELD.innerHTML = "";
    NEXT_TETROMINO_FIELD.innerHTML = "";

    clearInterval(stepInterval);
    stepInterval = null;





    gameSettings.resetSettings();
    initGame();

    PAUSE_TITLE.classList.remove("none");
    ICON_PAUSE.style.opacity = 1;
    GAME_OVER_TITLE.classList.add("none");
}

function initGame() {

    gameRenderer.coloringTetris();
    gameRenderer.colorfulTitleForHeader();
    gameRenderer.drawTetrisDecorationTetrominoes();

    pointsScore.countPoints();

    MAXIMUM_POINTS.innerHTML = currentGame.maximumPoints;
    CLEARED_LINES.innerHTML = currentGame.clearedLines;
    LEVEL.innerHTML = currentGame.level;
    COLOR_PICKER.value = tetrisColor;
    
    generate.playField();
    generate.nextTetrominoField();
    generate.tetromino();

    gameSettings.cells = document.querySelectorAll(".play-field__cell");
    gameSettings.nextTetrominoCells = document.querySelectorAll(".next-tetromino__cell");


    
    // prettier-ignore
    localStorage.getItem("btnStyle") ?
        GAME_STYLES_BTNS[localStorage.getItem("btnStyle")].classList.add("active") :
        GAME_STYLES_BTNS[0].classList.add("active");

    document.addEventListener("keydown", onKeyDown);

    GAME_STYLES_BTNS.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            gameSettings.styleGame = btn.dataset.style;
            localStorage.setItem("styleGame", gameSettings.styleGame);
            localStorage.setItem("btnStyle", index);
            location.reload(); // !!! переробити
            // gameRenderer.redrawTheGameStyle();// почекає до кращих часів)
            
        });
    });

    COLOR_PICKER.addEventListener("input", (e) => {
    tetrisColor = e.target.value;
    localStorage.setItem("tetrisColor", tetrisColor);
    gameRenderer.coloringTetris();
    });

    function simulationKeydown(code) {
        const event = new KeyboardEvent('keydown', {
            code: code
        });
        document.dispatchEvent(event);
    }

    INFO_WINDOW_BTN.addEventListener("click", showInfoWindow);
    INFO_WINDOW_BTN.addEventListener("click", showInfoWindow);

    ICON_SOUND.addEventListener("click", sound.toggle);

    ICON_PAUSE.addEventListener("click", togglePause);

    RESTART_BTN.addEventListener("click", resetALL);
    PAUSE_BTN.addEventListener("click", ()=>{
        simulationKeydown("KeyP");
    });
    ROTATE_BTN.addEventListener("click", ()=>{
        simulationKeydown("KeyW");
    });
    DOWN_BTN.addEventListener("click", ()=>{
        simulationKeydown("KeyS");
    });
    LEFT_BTN.addEventListener("click", ()=>{
        simulationKeydown("KeyA");
    });
    RIGHT_BTN.addEventListener("click", ()=>{
        simulationKeydown("KeyD");
    });
    

}

function onKeyDown(e) {
    let soundSrc = null;

    if (e.code == "KeyP") {
        togglePause();
    }
    if (gameSettings.isGamePaused) return;

    switch (e.code) {
        case "KeyW":
            control.rotate();
            soundSrc = SOUND_ROTATE_SRC;
            break;
        case "KeyS":
            control.moveTetrominoDown();
            soundSrc = SOUND_MOVE_SRC;
            break;
        case "KeyA":
            control.moveTetrominoLeft();
            soundSrc = SOUND_MOVE_SRC;
            break;
        case "KeyD":
            control.moveTetrominoRight();
            soundSrc = SOUND_MOVE_SRC;
            break;
        case "ControlLeft":
            control.genNewTetromino();
            // soundSrc = SOUND_;
            break;
        case "Space":
            control.moveDrop();
            soundSrc = SOUND_DROP_SRC;
            break;
        default:
            break;
    }
    gameRenderer.draw();
    if (gameSettings.soundOn && soundSrc) sound.play(soundSrc);
}

function showInfoWindow() {
    INFO_WINDOW.classList.toggle("active");
    INFO_WINDOW_ARROW.classList.toggle("active");
}

initGame();

import { fillGameBoard } from "./modules/_game-over.js";

function handleTetrominoInteraction() {

    function gameOver() { // доробити
        togglePause();
        clearInterval(stepInterval);
        stepInterval = null;
        clearInterval(canTetrominoMove);
        canTetrominoMove = null;
        fillGameBoard();
    }

    function getLevelUp() {
        currentGame.level++;
        currentGame.calculatePointsToNextLevel();
        LEVEL.innerHTML = currentGame.level;

        if (gameSettings.fallRate <= 0.1) { return; }
        gameSettings.fallRate -= gameSettings.multiplierFallRate;
    }

    function findFillRow() {
        const fillRows = [];
        for (let row = 0; row < PLAYFIELD_ROWS; row++) {
            let flag = true;
            for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
                if (gameSettings.playfield[row][column] == 0) {
                    flag = false;
                }
            }
            if (flag) {
                fillRows.push(row);
            }
        }
        return fillRows;
    }

    function getPointsForDestroyingLines(fillRows) {
        switch (fillRows) {
            case 1: currentGame.maximumPoints += Math.floor(pointsScore.cleanOneLine);     break;
            case 2: currentGame.maximumPoints += Math.floor(pointsScore.cleanTwoLines);    break;
            case 3: currentGame.maximumPoints += Math.floor(pointsScore.cleanThreeLines);  break;
            case 4: currentGame.maximumPoints += Math.floor(pointsScore.cleanFourLines);   break;
        }
        MAXIMUM_POINTS.innerHTML = currentGame.maximumPoints;
    }

    function dropLine(rowDelete) {
        for (let row = rowDelete; row > 0; row--) {
            for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
                const removeCellIndex = convertPositionToIndex(row, column);
                const upperCellIndex = removeCellIndex - PLAYFIELD_COLUMNS;
    
                gameSettings.cells[removeCellIndex].innerHTML = "";
                gameSettings.cells[removeCellIndex].classList.remove(`stable-${gameSettings.styleGame}-block`);
    
                gameSettings.cells[removeCellIndex].style.backgroundColor = "purple";
                gameSettings.cells[removeCellIndex].innerHTML = "+";
    
                if (gameSettings.playfield[rowDelete - 1][column]) {
                    gameSettings.playfield[row][column] = gameSettings.playfield[row - 1][column];
    
                    let img = document.createElement("img");
                    img.src = `./img/${gameSettings.styleGame}.${gameSettings.imageFormat}`;
                    gameSettings.cells[removeCellIndex].append(img);
    
                    gameSettings.cells[upperCellIndex].innerHTML = "";
                    gameSettings.cells[upperCellIndex].classList.remove(`stable-${gameSettings.styleGame}-block`);
    
                    gameSettings.cells[removeCellIndex].innerHTML = "-";
                } else {
                    gameSettings.playfield[row][column] = 0;
    
                    gameSettings.cells[removeCellIndex].innerHTML = "0";
                }
            }
        }
        gameRenderer.draw();
    }

    function blinkingFillRow(rowDelete) {
        let counter = 0;
    
        for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
            const removeCellIndex = convertPositionToIndex(rowDelete, column);
    
            gameSettings.cells[removeCellIndex].classList.add("blinking");
            setTimeout(() => {
                gameSettings.cells[removeCellIndex].classList.remove("blinking");
                counter++;
    
                if (counter == PLAYFIELD_COLUMNS) { dropLine(rowDelete); }
            }, 200);
        }
    }

    function removeFillRow(fillRows) {
        getPointsForDestroyingLines(fillRows.length);
        if ( check.isLevelUp() ) { getLevelUp(); };
    
        for (const row of fillRows) {
            blinkingFillRow(row);
        }
    }
    
    function placeTetromino() {
        const matrixSize = gameSettings.tetromino.matrix.length;
    
        for (let row = 0; row < matrixSize; row++) {
            for (let column = 0; column < matrixSize; column++) {
                
                if (gameSettings.tetromino.row <= 0 && !gameSettings.isGamePaused) {
                    gameOver();
                    return;
                }
                
                if (gameSettings.tetromino.matrix[row][column]) {
                    gameSettings.playfield[gameSettings.tetromino.row + row][gameSettings.tetromino.column + column] = `stable-${gameSettings.styleGame}-block ${gameSettings.tetrominoColor}`;
                }
            }
        }
    
        currentGame.maximumPoints += pointsScore.touchdown;
        if ( check.isLevelUp() ) { getLevelUp(); };
        MAXIMUM_POINTS.innerHTML = currentGame.maximumPoints;
    
        // removeFillRow();

        let fillRows = findFillRow();
        if (fillRows.length > 0) { removeFillRow(fillRows); };

        generate.tetromino();
    }

    placeTetromino();

}























let stepInterval = setInterval(countingTime, 1000); // ?

let canTetrominoMove = null; // ?


tetrominoMoveDown();


function tetrominoMoveDown() {
    let time = gameSettings.fallRate;

    canTetrominoMove = setInterval(() => {
        if (canTetrominoMove && time != gameSettings.fallRate) {
            clearInterval(canTetrominoMove);
            canTetrominoMove = null;
            tetrominoMoveDown();
        }

        if (!gameSettings.isGamePaused) {
            control.moveTetrominoDown();
            gameRenderer.draw();
        } else {
            clearInterval(canTetrominoMove);
            canTetrominoMove = null;
        }
    }, time * 1000);
}

function togglePause() {
    clearInterval(canTetrominoMove);
    canTetrominoMove = null;
    if ( gameSettings.gameOver ) { return };
    

    gameSettings.isGamePaused = !gameSettings.isGamePaused;
    PAUSE_TITLE.classList.toggle("none");

    if (gameSettings.isGamePaused) {
        ICON_PAUSE.style.opacity = 1;

        gameSettings.timeBeforePause = Date.now() - gameSettings.gameStartTime;

        clearInterval(stepInterval);
        stepInterval = null;
        
    } else {
        ICON_PAUSE.style.opacity = 0.5;

        gameSettings.gameStartTime = Date.now() - gameSettings.timeBeforePause;

        clearInterval(stepInterval);
        stepInterval = null;
        stepInterval = setInterval(countingTime, 1000);

        tetrominoMoveDown();
    }
}

function countingTime() {
    if (!gameSettings.isGamePaused) {
        let difference = Date.now() - gameSettings.gameStartTime;
        let minutes = Math.floor(difference / 60000);
        let seconds = Math.floor((difference % 60000) / 1000);

        gameSettings.gameTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

        GAME_TIME.innerHTML = gameSettings.gameTime;
    }
}


// prettier-ignore
export {  
    generate, 
    convertPositionToIndex,
    gameSettings,
};
