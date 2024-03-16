"use strict";

import { gameStyle, generateColorForTetromino } from "../main.js";

function generateColorfulTitleForHeader() {
    const HEADER_TITLE = document.querySelector(".header__title");

    HEADER_TITLE.innerHTML = HEADER_TITLE.innerHTML
        .split("")
        .map((letter) => {
            let color = generateColorForTetromino(gameStyle);
            return `<span style="color: ${color};">${letter}</span>`;
        })
        .join("");
}

export { generateColorfulTitleForHeader };
