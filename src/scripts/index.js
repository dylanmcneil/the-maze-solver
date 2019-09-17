import '../styles/index.scss';

const squareLength = 40;
const squareSpace = squareLength + 1;
const ctx = document.getElementById('grid').getContext('2d');

initialiseGrid();
drawStartSquare();
drawEndSquare();

function initialiseGrid() {
    ctx.fillStyle = "rgb(200,0,0)";

    for (let x = 0, i = 0; i < 7; x += squareSpace, i++) {
        for (let y = 0, j = 0; j < 6; y += squareSpace, j++) {
            ctx.fillRect(x, y, squareLength, squareLength);
        }
    }
}

function drawSquare(x, y, c){
    ctx.fillStyle = "rgb(" + c.r + "," + c.g + "," + c.b + ")";

    let newX = x * squareSpace;
    let newY = y * squareSpace;

    ctx.fillRect(newX, newY, squareLength, squareLength);
}

function drawStartSquare() {
    drawSquare(0, 0, {r: 0, g: 255, b: 0});
}

function drawEndSquare() {
    drawSquare(6, 0, {r: 0, g: 0, b: 255});
}
