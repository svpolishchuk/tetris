"use strict";

import { gameStyle } from "./../main.js";

function generateTetrisDecorationField( decorBlock ) {
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

    for ( let i = 0; i < DECORATIVE_PLAYFIELD_ROWS * DECORATIVE_PLAYFIELD_COLUMNS; i++ ) {
        const decorCell = document.createElement( "div" );
        decorCell.classList.add( "decor-cell" );

        if ( DECORATIVE_TETROMINOES[i] ) {
            decorCell.classList.add( gameStyle );
        }

        decorBlock.append( decorCell );
    }
}

function drawTetrisDecorationTetrominoes() {
    const decorativeElementsOnTetris =
        document.querySelectorAll( ".tetris__decor" );

    generateTetrisDecorationField( decorativeElementsOnTetris[0] );
    generateTetrisDecorationField( decorativeElementsOnTetris[1] );
}

export { drawTetrisDecorationTetrominoes };
