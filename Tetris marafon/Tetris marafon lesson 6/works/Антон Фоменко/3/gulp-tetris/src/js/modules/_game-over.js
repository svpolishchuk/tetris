import { GAME_OVER_TITLE, PLAYFIELD_COLUMNS, PLAYFIELD_ROWS } from "./../constants/_constants.js";
// prettier-ignore
import { 
    convertPositionToIndex, 
    gameSettings, 
    generate,
} from "./../main.js";

function fillGameBoard() {
    gameSettings.gameOver = true;
    GAME_OVER_TITLE.classList.toggle("none");
    let fillTimeout = null;
    let timeout = 70;
    for (let row = 0; row <= PLAYFIELD_ROWS; row++) {
        fillTimeout = setTimeout( () => {
                for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
                    const cellIndex = convertPositionToIndex(row, column);

                    let img = document.createElement("img");
                    img.src = `./img/${gameSettings.styleGame}.${gameSettings.imageFormat}`;

                    gameSettings.cells[cellIndex].innerHTML = "";
                    gameSettings.cells[cellIndex].append(img);

                    gameSettings.cells[cellIndex].removeAttribute = "style";
                    gameSettings.cells[cellIndex].style.backgroundColor = generate.colorForTetromino(gameSettings.styleGame);
                    gameSettings.cells[cellIndex].classList.remove(`stable-${gameSettings.styleGame}-block`);
                    gameSettings.cells[cellIndex].classList.add(`${gameSettings.styleGame}-block`);
                }
                clearTimeout(fillTimeout);
            }, (timeout),
        );
        timeout += 70;
    }
}

export { fillGameBoard };
