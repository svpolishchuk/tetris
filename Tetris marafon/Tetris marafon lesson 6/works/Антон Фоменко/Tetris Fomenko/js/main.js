"use strict";

const GAME_STYLES_BTNS = document.querySelectorAll(".game-styles__block");
const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;
const TETROMINO_NAMES = ["O", "L", "J", "I", "T", "Z", "S"];
const TETROMINOES = {
    O: [
        [1, 1],
        [1, 1],
    ],
    L: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    J: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
    I: [
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    T: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    S: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ],
};
const COLORS = [
    ["red", "blue", "green", "orange", "yellow", "gold", "pink"],
    [
        "#F2ED9C",
        "#A0CFE1",
        "#4077A7",
        "#F17456",
        "#BC85A4",
        "#FBABB9",
        "#D6E286",
        "#32BEB1",
    ],
    ["black"],
];
const TETRIS_STYLES = [
    "classic",
    "chopped",
    "bubble",
    "lego",
    "panel",
    "puzzle",
    "skull",
];
const COLOR_PICKER = document.getElementById("colorPicker");
const INFO_WINDOW_BTN = document.querySelector(".info-window__btn");

let gameStyle = localStorage.getItem("gameStyle") || TETRIS_STYLES[0];
localStorage.getItem("btnStyle")
    ? GAME_STYLES_BTNS[localStorage.getItem("btnStyle")].classList.add("active")
    : GAME_STYLES_BTNS[0].classList.add("active");
let playfield = [];
let tetromino = {};
let tetrominoColor = generateColor(gameStyle);
let tetrisColor = localStorage.getItem("tetrisColor") || "orange";
COLOR_PICKER.value = tetrisColor;

header();
tetrisDecoration();
coloringTetris();

document.addEventListener("keydown", onKeyDown);

GAME_STYLES_BTNS.forEach((btn, key) => {
    btn.addEventListener("click", () => {
        gameStyle = btn.dataset.style;
        localStorage.setItem("gameStyle", gameStyle);
        localStorage.setItem("btnStyle", key);
        location.reload();
    });
});

COLOR_PICKER.addEventListener("input", (e) => {
    tetrisColor = e.target.value;
    localStorage.setItem("tetrisColor", tetrisColor);
    coloringTetris();
});

INFO_WINDOW_BTN.addEventListener("click", showInfoWindow);

generatePlayField();
generateTetromino();

const cells = document.querySelectorAll(".play-field__cell");

draw();

function convertPositionToIndex(row, column) {
    return row * PLAYFIELD_COLUMNS + column;
}

function generatePlayField() {
    const PLAY_FIELD = document.querySelector(".play-field");

    for (let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i++) {
        const cell = document.createElement("div");
        cell.classList.add("play-field__cell", gameStyle);
        PLAY_FIELD.append(cell);
    }

    playfield = new Array(PLAYFIELD_ROWS)
        .fill()
        .map(() => new Array(PLAYFIELD_COLUMNS).fill(0));
}

function generateTetromino() {
    const name =
        TETROMINO_NAMES[Math.floor(Math.random() * TETROMINO_NAMES.length)];
    const matrix = TETROMINOES[name];

    tetromino = {
        name,
        matrix,
        row: 0,
        column: Math.ceil((PLAYFIELD_COLUMNS - matrix.length) / 2),
    };
}

/**
 *  функція нічого не робить
 */
function drawPlayField() {
    for (let row = 0; row < PLAYFIELD_ROWS; row++) {
        for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
            if (playfield[row][column] == 0) continue;

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
                tetromino.column + column,
            );

            cells[cellIndex].classList.add(`${gameStyle}-block`);

            if (gameStyle == "classic") continue;

            let img = document.createElement("img");
            img.src = `./img/${gameStyle}.png`;

            cells[cellIndex].append(img);
            cells[cellIndex].style.backgroundColor = tetrominoColor;
        }
    }
}

function draw() {
    // cells.forEach( cell => cell.removeAttribute( "class" ) );
    cells.forEach((cell) => {
        cell.classList.remove(`${gameStyle}-block`);
        cell.innerHTML = "";
        cell.style.backgroundColor = "";
    });
    drawPlayField();
    drawTetromino();
}

function onKeyDown(e) {
    switch (e.key.toLowerCase()) {
        case "arrowup":
        case "w":
            rotateTetromino();
            break;
        case "arrowdown":
        case "s":
            moveTetrominoDown();
            break;
        case "arrowleft":
        case "a":
            moveTetrominoLeft();
            break;
        case "arrowright":
        case "d":
            moveTetrominoRight();
            break;
        case "control":
            genNewTetromino();
            break;
        case " ":
            moveDrope();
            break;
        default:
            break;
    }
    draw();
}

function rotateTetromino() {
    let dropSound = new Audio("./sounds/mr_9999_01.wav");
    dropSound.play();
}

function moveTetrominoDown() {
    tetromino.row++;
    playSoundMove();
}

function moveTetrominoLeft() {
    tetromino.column--;
    playSoundMove();
}

function moveTetrominoRight() {
    tetromino.column++;
    playSoundMove();
}

function genNewTetromino() {
    tetrominoColor = generateColor(gameStyle);
    generateTetromino();
    drawTetromino();
}

function moveDrope() {
    let dropSound = new Audio("./sounds/mr_9999_11.wav");
    dropSound.play();
}

function playSoundMove() {
    let moveSound = new Audio("./sounds/mr_9999_05.wav");
    moveSound.play();
}

// ----------------------------------------------------

function coloringTetris() {
    document.querySelector(".tetris").style.backgroundColor =
        localStorage.getItem("tetrisColor");
    document.querySelector(".tetris__title").style.backgroundColor =
        localStorage.getItem("tetrisColor");
}

function showInfoWindow() {
    document.querySelector(".info-window").classList.toggle("active");
    document.querySelector(".info-window__arrow").classList.toggle("active");
}

function tetrisDecoration() {
    const TETRO_ROWS = 23;
    const TETRO_COLUMNS = 2;
    const TETRO_HIDDEN = [
        0, 5, 6, 7, 9, 13, 14, 15, 20, 21, 22, 26, 28, 29, 32, 34, 36, 37, 39,
        41, 43, 45,
    ];

    const decorBlocks = document.querySelectorAll(".tetris__decor");

    genDecor(decorBlocks[0]);
    genDecor(decorBlocks[1]);

    function genDecor(decorBlock) {
        for (let i = 0; i < TETRO_ROWS * TETRO_COLUMNS; i++) {
            const decorCell = document.createElement("div");
            decorCell.classList.add("decor-cell", gameStyle);
            TETRO_HIDDEN.includes(i)
                ? (decorCell.style.opacity = 0)
                : (decorCell.style.opacity = 1);
            decorBlock.append(decorCell);
        }
    }
}

function header() {
    const HEADER_TITLE = document.querySelector(".header__title");
    let headerTitleArray = HEADER_TITLE.innerHTML.split("");

    HEADER_TITLE.innerHTML = headerTitleArray
        .map((letter) => {
            let color = generateColor(gameStyle);
            return `<span style="color: ${color};">${letter}</span>`;
        })
        .join("");
}
function generateColor(gameStyle = "classic") {
    switch (gameStyle) {
        case "bubble":
            return COLORS[1][Math.floor(Math.random() * COLORS[1].length)];

        case "skull":
            return COLORS[2][0];

        case "classic":
            return;

        default:
            return COLORS[0][Math.floor(Math.random() * COLORS[0].length)];
    }
}