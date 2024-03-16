const PLAY_FIELD_ROWS = 20;
const PLAY_FIELD_COLUMS = 10;
const PLAY_FIELD_NAME = ".playField";
const PLAY_FIELD_CENTER = [0, Math.floor(PLAY_FIELD_COLUMS / 2 - 1)];

const FIGURE_NAMES = ["O", "J", "I", "L", "S", "T", "Z"];
const FIGURE_CENTER = {
  O: [0.5, 0.5],
  J: [1, 1],
  I: [0, 1],
  L: [1, 1],
  S: [1, 1],
  T: [1, 1],
  Z: [1, 1],
};
const FIGURS_POINTS = {
  O: [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ],
  J: [
    [0, 0],
    [1, 0],
    [1, 1],
    [1, 2],
  ],
  I: [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
  ],
  L: [
    [1, 0],
    [1, 1],
    [1, 2],
    [0, 2],
  ],
  S: [
    [1, 0],
    [1, 1],
    [0, 1],
    [0, 2],
  ],
  T: [
    [1, 0],
    [1, 1],
    [1, 2],
    [0, 1],
  ],
  Z: [
    [0, 0],
    [0, 1],
    [1, 1],
    [1, 2],
  ],
};

let figure = {
  name: undefined,
  oldPosition: undefined,
  position: undefined,
  points: undefined,
};

generatePlayField();

divList = document.querySelectorAll(`${PLAY_FIELD_NAME} > div`);
let playFieldMatrix = listToMatrix(divList, PLAY_FIELD_COLUMS);

document.addEventListener("keydown", onKeyPress);

function drawFigureOnField(figure, classList) {
  drawPosition = figure.position;
  figHeight = figure.points.length;
  for (let i = 0; i < figHeight; i++) {
    y = figure.points[i][0] + drawPosition[0];
    x = figure.points[i][1] + drawPosition[1];

    checkOutOfSideBounds(figure, x);
    checkOutOfBottomBound(figure, y);
    playFieldMatrix[y][x].classList.add(...classList);
  }
}

// function drawStatFigure() {
//   drawFigureOnField(figure, [figure.name, "stat"]);
//   deleteSelectedFigure(figure);
// }

function generateNextFigure() {
  max = FIGURE_NAMES.length;
  element = Math.floor(Math.random() * max);
  figure.name = FIGURE_NAMES[element];
  figure.points = FIGURS_POINTS[figure.name];
  console.log("Generated figure: ", figure.name);
}

function generatePlayField() {
  let container = document.querySelector(PLAY_FIELD_NAME);

  for (let i = 0; i < PLAY_FIELD_COLUMS * PLAY_FIELD_ROWS; i++) {
    div = document.createElement("div");
    // div.innerHTML = i;
    container.append(div);
  }
}

function onKeyPress(e) {
  if (e.keyCode >= 49 && e.keyCode <= 55) {
    fName = FIGURE_NAMES[FIGURE_NAMES.length - (55 - e.keyCode + 1)];
    generateSelectedFigureTEST(fName);
    clearPlayField();
    drawFigureOnField(figure, [figure.name]);
  }

  switch (e.keyCode) {
    case 40:
      moveFigure([1, 0]);
      break;
    case 37:
      moveFigure([0, -1]);
      break;
    case 39:
      moveFigure([0, 1]);
      break;
    case 38:
      newPoints = rotationFigure(figure);
      figure.points = newPoints;
      clearPlayField();
      drawFigureOnField(figure, [figure.name]);
      break;
    case 27:
      if (figure.name === undefined) {
        generateNextFigure();
        figure.position = [...PLAY_FIELD_CENTER];
        clearPlayField();
        drawFigureOnField(figure);
      } else {
        clearPlayField();
        deleteSelectedFigure(figure);
      }
      break;
  }
}

function generateSelectedFigureTEST(name) {
  console.log("Selected figure ", name);
  figure.name = name;
  figure.points = FIGURS_POINTS[name];
  figure.position = [...PLAY_FIELD_CENTER];
}

function clearPlayField() {
  playFieldMatrix.forEach((row) => {
    row.forEach((e) => {
      if (!e.classList.contains("stat")) e.classList = [];
    });
  });
}

function moveFigure(shift) {
  if (figure.name === undefined) return;

  newPosition = figure.position.map((value, index) => value + shift[index]);
  figure.oldPosition = figure.position;
  figure.position = newPosition;
  clearPlayField();
  drawFigureOnField(figure, [figure.name]);
}

function rotationFigure(figure) {
  newRotationPoints = [];
  rotationCenter = FIGURE_CENTER[figure.name];
  figure.points.forEach((e) => {
    angle = 90 * (Math.PI / 180);
    s = Math.sin(angle);
    c = Math.cos(angle);
    x =
      c * (e[1] - rotationCenter[1]) -
      s * (e[0] - rotationCenter[0]) +
      rotationCenter[1];
    y =
      s * (e[1] - rotationCenter[1]) +
      c * (e[0] - rotationCenter[0]) +
      rotationCenter[0];

    x = Math.round(x);
    y = Math.round(y);
    newRotationPoints.push([y, x]);
  });
  return newRotationPoints;
}

// function checkFigureCollision(point) {
//   if (playFieldMatrix[point[0]][point[1]].classList.contains("stat")) {
//     console.log("figure Is contact with another figure!");
//     return true;
//   }
//   return false;
// }

function checkOutOfSideBounds(figure, point) {
  if (point > playFieldMatrix[0].length - 1) {
    figure.position[1] -= x - (playFieldMatrix[0].length - 1);
    console.log("Figure is out of right bound!");
    clearPlayField();
    drawFigureOnField(figure, [figure.name]);
  }
  if (point < 0) {
    figure.position[1] += Math.abs(x);
    console.log("Figure is out of left bound!");
    clearPlayField();
    drawFigureOnField(figure, [figure.name]);
  }
}

function checkOutOfBottomBound(figure, point) {
  if (point > playFieldMatrix.length - 1) {
    console.log("Figure is out of bottom bound!");
    figure.position[0] -= point - (playFieldMatrix.length - 1);
    clearPlayField();
    drawFigureOnField(figure, [figure.name]);
  }
}

function deleteSelectedFigure(figure) {
  Object.keys(figure).forEach((k) => {
    figure[k] = undefined;
  });
}

function listToMatrix(list, elementsPerSubArray) {
  var matrix = [],
    i,
    k;

  for (i = 0, k = -1; i < list.length; i++) {
    if (i % elementsPerSubArray === 0) {
      k++;
      matrix[k] = [];
    }

    matrix[k].push(list[i]);
  }

  return matrix;
}
