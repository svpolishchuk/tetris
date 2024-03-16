import { tetromino, playfield } from "./generate.js";
import { PLAYFIELD_COLUMNS, PLAYFIELD_ROWS } from "./variables.js";

export function isValid() {
    const matrixSize = tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row++) {
        for (let column = 0; column < matrixSize; column++) {
            // if (tetromino.matrix[row][column]) continue;
            if (isOutsideOfGameboard(row, column)) {
                return false;
            }
            if (hasCollisions(row, column)) {
                return false;
            }
        }
    }
    return true;
}

function isOutsideOfGameboard(row, column) {
    return tetromino.matrix[row][column] &&
        (tetromino.column + column < 0 ||
            tetromino.column + column >= PLAYFIELD_COLUMNS ||
            tetromino.row + row >= PLAYFIELD_ROWS)
}

function hasCollisions(row, column) {
    return tetromino.matrix[row][column]
        && playfield[tetromino.row + row][tetromino.column + column];
}