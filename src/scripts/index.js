import '../styles/index.scss';

const SQUARE_LENGTH = 40;
const SQUARE_SPACE = SQUARE_LENGTH + 1;
const CTX = document.getElementById('grid').getContext('2d');

const STARTX = 0; const STARTY = 0;
const ENDX = 6; const ENDY = 4;

const WIDTH = 7; const HEIGHT = 7;

const BACKGROUND = [100,100,100];
/////////////////////////////////////////
initialiseGrid();

colourSurrounding(4,4);
drawLine(STARTX,STARTY,ENDX,ENDY);
colourPath();
drawStartSquare(STARTX,STARTY);
drawEndSquare(ENDX,ENDY);

////////////////////////////////////////
//
//
/////////////////////////////////////////
function initialiseGrid() {
    CTX.fillStyle = "rgb(" + BACKGROUND[0] + "," + BACKGROUND[1] + "," + BACKGROUND[2] + ")";

    for (let x = 0, i = 0; i < WIDTH; x += SQUARE_SPACE, i++) {
        for (let y = 0, j = 0; j < HEIGHT; y += SQUARE_SPACE, j++) {
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

function drawStartSquare(startX,startY) {
    drawSquare(startX, startY, {r: 0, g: 255, b: 0});
}

function drawEndSquare(endX,endY) {
    drawSquare(endX, endY, {r: 0, g: 0, b: 255});
}

function drawLine(startX, startY, endX, endY) {
    let start = findCentre(startX,startY);
    let end = findCentre(endX, endY);

    CTX.beginPath();
    CTX.moveTo(start[0],start[1]);
    CTX.lineTo(end[0],end[1]);
    CTX.lineWidth = 5;
    CTX.strokeStyle = 'white';
    CTX.stroke();
}

function findCentre(x,y){
    let newX = x * SQUARE_SPACE;
    let newY = y * SQUARE_SPACE;
    return [(SQUARE_LENGTH / 2) +newX, (SQUARE_LENGTH / 2) +newY];
}

function findAvgColour(x,y){ //returns an average rgb value from a square area
    let newX = x * SQUARE_SPACE;
    let newY = y * SQUARE_SPACE;
    let dat = CTX.getImageData(newX, newY, SQUARE_LENGTH,SQUARE_LENGTH).data;
    let arrayR=[]; let arrayG=[]; let arrayB=[];
    let j=0;
    for(let i=0; i<dat.length-1; i+=4){
        arrayR[j] = dat[i];
        arrayG[j] = dat[i + 1];
        arrayB[j] = dat[i+2];
        j=j+1;
    }

    //find avg r,g,b, put into one array
    let sumR =0;let sumG =0;let sumB =0;
    for(let i=0; i<arrayR.length; i=i+1){
        sumR =sumR +arrayR[i];sumG =sumG +arrayG[i];sumB =sumB +arrayB[i];
    }
    return [sumR / arrayR.length, sumG / arrayG.length, sumB / arrayB.length];

}

function detectAdjacent(x,y){  //Returns colour of adjacent squares [N,E,S,W], remember y axis is flipped (-ve is up)
    let adjacent = [];         // 2d array, each direction contains rgb value [N[r,b,g] , S[r,g,b] , etc....

    //North
    if (y>0){
        adjacent[0] = findAvgColour(x,y-1);

    }
    else{ adjacent[0] = null;
    }

    //East
    if (x<WIDTH){
        adjacent[1] = findAvgColour(x+1,y);
    }
    else{ adjacent[1] = null;
    }

    //South
    if (y<HEIGHT){
        adjacent[2] = findAvgColour(x,y+1);
    }
    else{ adjacent[2] = null;
    }

    //West
    if (x>0){
        adjacent[3] = findAvgColour(x-1,y);
    }
    else{ adjacent[3] = null;
    }
    return adjacent;
}

function colourSurrounding(x,y){ //currently being used to test detectAdjacent and colourPath, Works as expected

    let adj = detectAdjacent(x,y);
    let direction = [-1,1,1,-1]; // defines relative shifts for N,E,S,W
    for(let i=0; i<adj.length; i++){ //Loops through N,E,S,W
        let check = 0;
        for(let j=0; j<adj[i].length; j++){ //Loops through rbg value for specified direction (N,E,S or W)
            if (adj[i][j] ===BACKGROUND[j]){ //checks if selected square matches rgb values of background
                check = check + 1;
            }

        }
        if(check ===3 && i===0 || i===2){  // inefficient method of determining which direction adjacent square is
            drawSquare(x,y+direction[i],{r:255,g:255,b:255} );
        }
        else if (check ===3){
            drawSquare(x+direction[i],y,{r:255,g:255,b:255});
        }
    }


}

function colourPath(){ //uses findAvgColour and colours squares != 100,100,100 to indicate path taken

    for (let x = 0, i = 0; i < WIDTH; x += SQUARE_SPACE, i++) {
        for (let y = 0, j = 0; j < HEIGHT; y += SQUARE_SPACE, j++){

            let avg = findAvgColour(i,j);
            // not sure how to directly compare two arrays in an if statement so just done element by element :/
            if (avg[0] !== 100 && avg[1] !== 100 && avg [2] !== 100 &&
                avg[0] !==255 && avg[1] !== 0 && avg[2] !== 0){
                drawSquare(i,j,{r:255,g:160,b:0});
            }

        }
    }
}
