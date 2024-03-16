"use strict";

function $(selector) {
    return document.querySelector(`${selector}`);
}
function $All(selector) {
    return document.querySelectorAll(`${selector}`);
}

const LOADER                = $(".loader");

const AUDIO_PLAYER          = $("#audioPlayer");

const DECOR_ELEMENTS        = $All(".tetris__decor");

const HEADER_TITLE          = $(".header__title");
const headerTitleText       = "TETRIS";

const PAUSE_TITLE           = $(".display__pause-title");
const GAME_OVER_TITLE       =$(".display__game-over-title");

const GAME_STYLES_BTNS      = $All(".game-styles__block");
const COLOR_PICKER          = $("#color-picker");
const INFO_WINDOW_BTN       = $(".info-window__btn");

const PLAY_FIELD            = $(".play-field");

const SOUND_ROTATE_SRC      = "./../../sounds/mr_9999_01.wav";
const SOUND_MOVE_SRC        = "./../../sounds/mr_9999_05.wav";
const SOUND_DROP_SRC        = "./../../sounds/mr_9999_11.wav";

const MAXIMUM_POINTS        = $("#maximum-points");
const CLEARED_LINES         = $("#cleared-lines");
const LEVEL                 = $("#level");
const NEXT_TETROMINO_FIELD  = $("#next-tetromino");
const ICON_SOUND            = $("#icon-without-sound");
const ICON_PAUSE            = $("#icon-pause");
const GAME_TIME             = $("#game-time");

const RESTART_BTN           = $(".btn-restart");
const PAUSE_BTN             = $(".btn-pause");
const ROTATE_BTN            = $(".btn-rotate");
const DOWN_BTN              = $(".btn-down");
const LEFT_BTN              = $(".btn-left");
const RIGHT_BTN             = $(".btn-right");

const INFO_WINDOW           = $(".info-window");
const INFO_WINDOW_ARROW     = $(".info-window__arrow")

const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;
const TETROMINO_NAMES = [
    "O",
    "L",
    "J",
    "I",
    "T",
    "Z",
    "S"
];
const TETROMINOES = {
    O: [
        [
            [1, 1],
            [1, 1],
        ],
    ],
    L: [
        [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0],
        ],
        [
            [1, 1, 0],
            [0, 1, 0],
            [0, 1, 0],
        ],
        [
            [1, 1, 1],
            [1, 0, 0],
            [0, 0, 0],
        ],
        [
            [1, 0, 0],
            [1, 0, 0],
            [1, 1, 0],
        ],
    ],
    J: [
        [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0],
        ],
        [
            [1, 1, 0],
            [1, 0, 0],
            [1, 0, 0],
        ],
        [
            [1, 1, 1],
            [0, 0, 1],
            [0, 0, 0],
        ],
        [
            [0, 1, 0],
            [0, 1, 0],
            [1, 1, 0],
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
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0],
        ],
        [
            [0, 1, 0],
            [1, 1, 0],
            [0, 1, 0],
        ],
        [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0],
        ],
        [
            [0, 1, 0],
            [0, 1, 1],
            [0, 1, 0],
        ],
    ],
    S: [
        [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0],
        ],
        [
            [1, 0, 0],
            [1, 1, 0],
            [0, 1, 0],
        ],
    ],
    Z: [
        [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0],
        ],
        [
            [0, 1, 0],
            [1, 1, 0],
            [1, 0, 0],
        ],
    ],
};
// prettier-ignore
const COLOR_PALETTES = {
    chopped: [ 
        "red", 
        "blue", 
        "green", 
        "orange", 
        "yellow", 
        "gold", 
        "pink"
    ],
    lego: [
        "red", 
        "blue", 
        "green", 
        "orange", 
        "yellow", 
        "gold", 
        "pink"
    ],
    panel: [
        "red", 
        "blue", 
        "green", 
        "orange", 
        "yellow", 
        "gold", 
        "pink"
    ],
    puzzle: [
        "red", 
        "blue", 
        "green", 
        "orange", 
        "yellow", 
        "gold", 
        "pink"
    ],
    bubble: [
        "#F2ED9C", 
        "#A0CFE1", 
        "#4077A7", 
        "#F17456", 
        "#BC85A4", 
        "#FBABB9", 
        "#D6E286", 
        "#32BEB1"
    ],
    skull: ["black"],
    classic: ["#a9a9a9"],
};
const TETRIS_STYLES = ["classic", "chopped", "bubble", "lego", "panel", "puzzle", "skull"];


export { 
    $, 
    LOADER,
    DECOR_ELEMENTS,
    HEADER_TITLE,
    headerTitleText,
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
    PLAY_FIELD,
    MAXIMUM_POINTS, 
    CLEARED_LINES, 
    LEVEL, 
    NEXT_TETROMINO_FIELD, 
    GAME_TIME, 
    ICON_SOUND, 
    ICON_PAUSE,
    RESTART_BTN,
    PAUSE_BTN,
    ROTATE_BTN,
    DOWN_BTN,
    LEFT_BTN,
    RIGHT_BTN,
    INFO_WINDOW,
    INFO_WINDOW_ARROW,
    PAUSE_TITLE,
    GAME_OVER_TITLE,
    AUDIO_PLAYER,
};
