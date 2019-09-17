import '../styles/index.scss';

const SQUARE_LENGTH = 40;
const SQUARE_SPACE = SQUARE_LENGTH + 1;
const CTX = document.getElementById('grid').getContext('2d');

initialiseGrid();
drawStartSquare();
drawEndSquare();

function initialiseGrid() {
    CTX.fillStyle = "rgb(200,0,0)";

    for (let x = 0, i = 0; i < 7; x += SQUARE_SPACE, i++) {
        for (let y = 0, j = 0; j < 6; y += SQUARE_SPACE, j++) {
            CTX.fillRect(x, y, SQUARE_LENGTH, SQUARE_LENGTH);
        }
    }
}

function drawSquare(x, y, c){
    CTX.fillStyle = "rgb(" + c.r + "," + c.g + "," + c.b + ")";

    let newX = x * SQUARE_SPACE;
    let newY = y * SQUARE_SPACE;

    CTX.fillRect(newX, newY, SQUARE_LENGTH, SQUARE_LENGTH);
}

function drawStartSquare() {
    drawSquare(0, 0, {r: 0, g: 255, b: 0});
}

function drawEndSquare() {
    drawSquare(6, 0, {r: 0, g: 0, b: 255});
}
