"use strict";

const LOADER = document.querySelector(".loader");

const GAME_STYLES_BTNS = document.querySelectorAll(".game-styles__block");
const COLOR_PICKER = document.getElementById("colorPicker");
const INFO_WINDOW_BTN = document.querySelector(".info-window__btn");

const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;
const TETROMINO_NAMES = ["O", "L", "J", "I", "T", "Z", "S"];
const TETROMINOES = {
    O: [
        [
            [1,1],
            [1,1],
        ],
    ],
    L: [
        [
            [0,0,1],
            [1,1,1],
            [0,0,0],
        ],
        [
            [1,1,0],
            [0,1,0],
            [0,1,0],
        ],
        [
            [1,1,1],
            [1,0,0],
            [0,0,0],
        ],
        [
            [1,0,0],
            [1,0,0],
            [1,1,0],
        ],
    ],
    J: [
        [
            [1,0,0],
            [1,1,1],
            [0,0,0],
        ],
        [
            [1,1,0],
            [1,0,0],
            [1,0,0],
        ],
        [
            [1,1,1],
            [0,0,1],
            [0,0,0],
        ],
        [
            [0,1,0],
            [0,1,0],
            [1,1,0],
        ],
    ],
    I: [
        [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
        [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ],
    ],
    T: [
        [
            [0,1,0],
            [1,1,1],
            [0,0,0],
        ],
        [
            [0,1,0],
            [1,1,0],
            [0,1,0],
        ],
        [
            [0,0,0],
            [1,1,1],
            [0,1,0],
        ],
        [
            [0,1,0],
            [0,1,1],
            [0,1,0],
        ],
    ],
    S: [
        [
            [0,1,1],
            [1,1,0],
            [0,0,0],
        ],
        [
            [1,0,0],
            [1,1,0],
            [0,1,0],
        ],
    ],
    Z: [
        [
            [1,1,0],
            [0,1,1],
            [0,0,0],
        ],
        [
            [0,1,0],
            [1,1,0],
            [1,0,0],
        ],
    ],
};

const COLOR_PALETTES = [
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

const SOUND_ROTATE_SRC  = "./../../sounds/mr_9999_01.wav";
const SOUND_MOVE_SRC    = "./../../sounds/mr_9999_05.wav";
const SOUND_DROP_SRC    = "./../../sounds/mr_9999_11.wav";

const MAXIMUM_POINTS = document.getElementById("maximum-points");
const CLEARED_LINES = document.getElementById("cleared-lines");
const LEVEL = document.getElementById("level");
const NEXT_TETROMINO_FIELD = document.getElementById("next-tetromino");
const ICON_SOUND = document.getElementById("icon-without-sound");
const ICON_PAUSE = document.getElementById("icon-pause");
const GAME_TIME = document.getElementById("game-time");

export {
    LOADER,
    GAME_STYLES_BTNS,
    PLAYFIELD_COLUMNS,
    PLAYFIELD_ROWS,
    TETROMINO_NAMES,
    TETROMINOES,
    COLOR_PALETTES,
    TETRIS_STYLES,
    COLOR_PICKER,
    INFO_WINDOW_BTN,
    SOUND_ROTATE_SRC,
    SOUND_MOVE_SRC,
    SOUND_DROP_SRC,
    MAXIMUM_POINTS,
    CLEARED_LINES,
    LEVEL,
    NEXT_TETROMINO_FIELD,
    GAME_TIME,
    ICON_SOUND,
    ICON_PAUSE,
};
