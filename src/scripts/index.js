import '../styles/index.scss';
import './models/colour.js';
import {Colour} from "./models/colour";

const SQUARE_LENGTH = 40;
const SQUARE_SPACE = SQUARE_LENGTH + 1;
const CTX = document.getElementById('grid').getContext('2d');

const STARTX = 0, STARTY = 0, ENDX = 6, ENDY = 4, WIDTH = 7, HEIGHT = 7;
const BACKGROUND = new Colour(100, 100, 100);
/////////////////////////////////////////
initialiseGrid();

colourSurrounding(4, 4);
drawLine(STARTX, STARTY, ENDX, ENDY);
colourPath();
drawStartSquare(STARTX, STARTY);
drawEndSquare(ENDX, ENDY);

////////////////////////////////////////
//
//
/////////////////////////////////////////
function initialiseGrid() {
    CTX.fillStyle = "rgb(" + BACKGROUND.r + "," + BACKGROUND.g + "," + BACKGROUND.b + ")";

    for (let x = 0, i = 0; i < WIDTH; x += SQUARE_SPACE, i++) {
        for (let y = 0, j = 0; j < HEIGHT; y += SQUARE_SPACE, j++) {
            CTX.fillRect(x, y, SQUARE_LENGTH, SQUARE_LENGTH);
        }
    }
}

function drawSquare(x, y, c) {
    CTX.fillStyle = "rgb(" + c.r + "," + c.g + "," + c.b + ")";

    let newX = x * SQUARE_SPACE;
    let newY = y * SQUARE_SPACE;

    CTX.fillRect(newX, newY, SQUARE_LENGTH, SQUARE_LENGTH);
}

function drawStartSquare(startX, startY) {
    drawSquare(startX, startY, new Colour(0, 255, 0));
}

function drawEndSquare(endX, endY) {
    drawSquare(endX, endY, new Colour(0, 0, 255));
}

function drawLine(startX, startY, endX, endY) {
    let start = findCentre(startX, startY);
    let end = findCentre(endX, endY);

    CTX.beginPath();
    CTX.moveTo(start[0], start[1]);
    CTX.lineTo(end[0], end[1]);
    CTX.lineWidth = 5;
    CTX.strokeStyle = 'white';
    CTX.stroke();
}

function findCentre(x, y) {
    return [(SQUARE_LENGTH / 2) + x * SQUARE_SPACE, (SQUARE_LENGTH / 2) + y * SQUARE_SPACE];
}

function findAvgColour(x, y) { //returns an average rgb value from a square area
    let dat = CTX.getImageData(x * SQUARE_SPACE, y * SQUARE_SPACE, SQUARE_LENGTH, SQUARE_LENGTH).data;

    let arrayR = dat.filter(function (value, index) {
        return index % 4 === 0;
    });
    let arrayG = dat.filter(function (value, index) {
        return index % 4 === 1;
    });
    let arrayB = dat.filter(function (value, index) {
        return index % 4 === 2;
    });

    //find avg r,g,b, put into one array
    let sumR = 0;
    let sumG = 0;
    let sumB = 0;
    for (let i = 0; i < arrayR.length; i = i + 1) {
        sumR = sumR + arrayR[i];
        sumG = sumG + arrayG[i];
        sumB = sumB + arrayB[i];
    }

    return new Colour(sumR / arrayR.length, sumG / arrayG.length, sumB / arrayB.length);
}

function detectAdjacent(x, y) {  //Returns colour of adjacent squares [N,E,S,W], remember y axis is flipped (-ve is up)
    let adjacent = [];         // 2d array, each direction contains rgb value [N[r,b,g] , S[r,g,b] , etc....

    //North
    if (y > 0) {
        adjacent[0] = findAvgColour(x, y - 1);
    } else {
        adjacent[0] = null;
    }

    //East
    if (x < WIDTH) {
        adjacent[1] = findAvgColour(x + 1, y);
    } else {
        adjacent[1] = null;
    }

    //South
    if (y < HEIGHT) {
        adjacent[2] = findAvgColour(x, y + 1);
    } else {
        adjacent[2] = null;
    }

    //West
    if (x > 0) {
        adjacent[3] = findAvgColour(x - 1, y);
    } else {
        adjacent[3] = null;
    }

    return adjacent;
}

function colourSurrounding(x, y) { //currently being used to test detectAdjacent and colourPath, Works as expected
    let adj = detectAdjacent(x, y);
    let direction = [-1, 1, 1, -1]; // defines relative shifts for N,E,S,W

    for (let i = 0; i < adj.length; i++) { //Loops through N,E,S,W
        let check = 0;

        if (adj[i].r === BACKGROUND.r) {
            check++;
        }
        if (adj[i].g === BACKGROUND.g) {
            check++;
        }
        if (adj[i].b === BACKGROUND.b) {
            check++;
        }

        if (check === 3) {
            if (i % 2 === 0) {
                drawSquare(x, y + direction[i], new Colour(255, 255, 255));
            } else {
                drawSquare(x + direction[i], y, new Colour(255, 255, 255));
            }
        }
    }
}

function colourPath() { //uses findAvgColour and colours squares != 100,100,100 to indicate path taken
    for (let x = 0, i = 0; i < WIDTH; x += SQUARE_SPACE, i++) {
        for (let y = 0, j = 0; j < HEIGHT; y += SQUARE_SPACE, j++) {
            let avg = findAvgColour(i, j);
            // not sure how to directly compare two arrays in an if statement so just done element by element :/
            if (avg.r !== BACKGROUND.r && avg.g !== BACKGROUND.g && avg.b !== BACKGROUND.b &&
                avg.r !== 255 && avg.g !== 0 && avg.b !== 0) {
                drawSquare(i, j, new Colour(255, 160, 0));
            }
        }
    }
}
