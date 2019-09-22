import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BoardService} from '../service/board-service.service';
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
  private readonly BACKGROUND_COLOUR = new Colour(100, 100, 100);
  private readonly WALL_COLOUR = new Colour(0, 0, 0);
  private readonly START_COLOUR = new Colour(0, 255, 0);
  private readonly END_COLOUR = new Colour(0, 0, 255);
  private readonly START_X = 0;
  private readonly START_Y = 1;
  private readonly END_X = 6;
  private readonly END_Y = 4;
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
      this.colourOptimalPath(data);
      // this.colourSurrounding(4, 4);
      // this.drawLine(this.START_X, this.START_Y, this.END_X, this.END_Y);
      // this.colourPath();
    });
  }

  private initialiseGrid(data: any): void {
    data.points.forEach((point) => {
      this.drawSquare(point.x, point.y, this.calculateTileColour(point));
    });
  }

  private colourOptimalPath(data: any): void {
    const interval = 250;
    let promise = Promise.resolve();
    let colour = 50;
    data.optimalPath.forEach((point, index) => {
      promise = promise.then(() => {
        if (!(point.start || point.finish)) {
          this.drawSquare(point.x, point.y, new Colour(0, colour, colour));
          colour += 10;
        }
        return new Promise((resolve) => {
          setTimeout(resolve, interval);
        });
      });
    });
  }

  private calculateTileColour(point: any): Colour {
    if (point.wall) {
      return this.WALL_COLOUR;
    } else if (point.start) {
      return this.START_COLOUR;
    } else if (point.finish) {
      return this.END_COLOUR;
    } else {
      return this.BACKGROUND_COLOUR;
    }
  }

  private drawSquare(logicalX: number, logicalY: number, c: Colour): void {
    this.ctx.fillStyle = 'rgb(' + c.r + ',' + c.g + ',' + c.b + ')';
    this.ctx.fillRect(logicalX * this.SQUARE_SPACE, logicalY * this.SQUARE_SPACE, this.SQUARE_LENGTH, this.SQUARE_LENGTH);
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

  // Returns colour of adjacent squares [N,E,S,W], remember y axis is flipped (-ve is up)
  private detectAdjacent(logicalX, logicalY): Colour[] {
    const adjacent = [];         // 2d array, each direction contains rgb value [N[r,b,g] , S[r,g,b] , etc....

    // North
    if (logicalY > 0) {
      adjacent[0] = this.findAvgColour(logicalX, logicalY - 1);
    } else {
      adjacent[0] = null;
    }

    // East
    if (logicalX < this.WIDTH) {
      adjacent[1] = this.findAvgColour(logicalX + 1, logicalY);
    } else {
      adjacent[1] = null;
    }

    // South
    if (logicalY < this.HEIGHT) {
      adjacent[2] = this.findAvgColour(logicalX, logicalY + 1);
    } else {
      adjacent[2] = null;
    }

    // West
    if (logicalX > 0) {
      adjacent[3] = this.findAvgColour(logicalX - 1, logicalY);
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

      if (adj[i].r === this.BACKGROUND_COLOUR.r) {
        check++;
      }
      if (adj[i].g === this.BACKGROUND_COLOUR.g) {
        check++;
      }
      if (adj[i].b === this.BACKGROUND_COLOUR.b) {
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
        if (avg.r !== this.BACKGROUND_COLOUR.r && avg.g !== this.BACKGROUND_COLOUR.g && avg.b !== this.BACKGROUND_COLOUR.b &&
          avg.r !== 255 && avg.g !== 0 && avg.b !== 0) {
          this.drawSquare(i, j, new Colour(255, 160, 0));
        }
      }
    }
  }
}
