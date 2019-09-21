import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BoardService} from '../service/board-service.service';
import {Router} from '@angular/router';
import {Colour} from '../model/colour';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  @ViewChild('grid', {static: true})
  private canvas: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D;

  private readonly SQUARE_LENGTH = 40;
  private readonly SQUARE_SPACE = this.SQUARE_LENGTH + 1;
  private readonly BACKGROUND = new Colour(100, 100, 100);
  private readonly STARTX = 0;
  private readonly STARTY = 0;
  private readonly ENDX = 6;
  private readonly ENDY = 4;
  private readonly WIDTH = 7;
  private readonly HEIGHT = 7;

  constructor(private boardService: BoardService) {

  }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');

    // wait for the data to return from the HTTP call, then execute the listed functions
    this.boardService.getBoard().subscribe(data => {
      console.log('response from backend: ', data);
      // main
      this.initialiseGrid(data);

      this.colourSurrounding(4, 4);
      this.drawLine(this.STARTX, this.STARTY, this.ENDX, this.ENDY);
      this.colourPath();
      this.drawStartSquare(this.STARTX, this.STARTY);
      this.drawEndSquare(this.ENDX, this.ENDY);
    });
  }

  private initialiseGrid(data: any): void {
    data.points.forEach((point) => {
      this.drawSquare(point.x, point.y, new Colour(this.BACKGROUND.r, this.BACKGROUND.g, this.BACKGROUND.b));
    });
  }

  private drawSquare(logicalX: number, logicalY: number, c: Colour): void {
    this.ctx.fillStyle = 'rgb(' + c.r + ',' + c.g + ',' + c.b + ')';
    this.ctx.fillRect(logicalX * this.SQUARE_SPACE, logicalY * this.SQUARE_SPACE, this.SQUARE_LENGTH, this.SQUARE_LENGTH);
  }

  private drawStartSquare(logicalX: number, logicalY: number): void {
    this.drawSquare(logicalX, logicalY, new Colour(0, 255, 0));
  }

  private drawEndSquare(logicalX: number, logicalY: number): void {
    this.drawSquare(logicalX, logicalY, new Colour(0, 0, 255));
  }

  private drawLine(logicalStartX, logicalStartY, endStartX, endStartY): void {
    const start = this.findCentre(logicalStartX, logicalStartY);
    const end = this.findCentre(endStartX, endStartY);

    this.ctx.beginPath();
    this.ctx.moveTo(start[0], start[1]);
    this.ctx.lineTo(end[0], end[1]);
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = 'white';
    this.ctx.stroke();
  }

  private findCentre(logicalX, logicalY): number[] {
    return [(this.SQUARE_LENGTH / 2) + logicalX * this.SQUARE_SPACE, (this.SQUARE_LENGTH / 2) + logicalY * this.SQUARE_SPACE];
  }

  private findAvgColour(logicalX, logicalY): Colour { // returns an average rgb value from a square area
    const dat = this.ctx.getImageData(logicalX * this.SQUARE_SPACE, logicalY * this.SQUARE_SPACE,
      this.SQUARE_LENGTH, this.SQUARE_LENGTH).data;

    const arrayR = dat.filter((value, index) => {
      return index % 4 === 0;
    });

    const arrayG = dat.filter((value, index) => {
      return index % 4 === 1;
    });

    const arrayB = dat.filter((value, index) => {
      return index % 4 === 2;
    });

    // find avg r,g,b, put into one array
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

  private detectAdjacent(x, y): Colour[] {  // Returns colour of adjacent squares [N,E,S,W], remember y axis is flipped (-ve is up)
    const adjacent = [];         // 2d array, each direction contains rgb value [N[r,b,g] , S[r,g,b] , etc....

    // North
    if (y > 0) {
      adjacent[0] = this.findAvgColour(x, y - 1);
    } else {
      adjacent[0] = null;
    }

    // East
    if (x < this.WIDTH) {
      adjacent[1] = this.findAvgColour(x + 1, y);
    } else {
      adjacent[1] = null;
    }

    // South
    if (y < this.HEIGHT) {
      adjacent[2] = this.findAvgColour(x, y + 1);
    } else {
      adjacent[2] = null;
    }

    // West
    if (x > 0) {
      adjacent[3] = this.findAvgColour(x - 1, y);
    } else {
      adjacent[3] = null;
    }

    return adjacent;
  }

  private colourSurrounding(logicalX, logicalY): void { // currently being used to test detectAdjacent and colourPath, Works as expected
    const adj = this.detectAdjacent(logicalX, logicalY);
    const direction = [-1, 1, 1, -1]; // defines relative shifts for N,E,S,W

    for (let i = 0; i < adj.length; i++) { // Loops through N,E,S,W
      let check = 0;

      if (adj[i].r === this.BACKGROUND.r) {
        check++;
      }
      if (adj[i].g === this.BACKGROUND.g) {
        check++;
      }
      if (adj[i].b === this.BACKGROUND.b) {
        check++;
      }

      if (check === 3) {
        if (i % 2 === 0) {
          this.drawSquare(logicalX, logicalY + direction[i], new Colour(255, 255, 255));
        } else {
          this.drawSquare(logicalX + direction[i], logicalY, new Colour(255, 255, 255));
        }
      }
    }
  }

  private colourPath() { // uses findAvgColour and colours squares != 100,100,100 to indicate path taken
    for (let x = 0, i = 0; i < this.WIDTH; x += this.SQUARE_SPACE, i++) {
      for (let y = 0, j = 0; j < this.HEIGHT; y += this.SQUARE_SPACE, j++) {
        const avg = this.findAvgColour(i, j);
        // not sure how to directly compare two arrays in an if statement so just done element by element :/
        if (avg.r !== this.BACKGROUND.r && avg.g !== this.BACKGROUND.g && avg.b !== this.BACKGROUND.b &&
          avg.r !== 255 && avg.g !== 0 && avg.b !== 0) {
          this.drawSquare(i, j, new Colour(255, 160, 0));
        }
      }
    }
  }
}
