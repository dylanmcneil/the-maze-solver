import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BoardService} from '../service/board-service.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Colour} from '../model/colour';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  @ViewChild('grid', {static: true})
  canvas: ElementRef<HTMLCanvasElement>;

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

  constructor(private boardService: BoardService, private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');

    this.boardService.getBoard().subscribe(data => {
      console.log('***** hi', data);
      this.initialiseGrid(data);
    });
  }

  initialiseGrid(data: any) {
    this.ctx.fillStyle = 'rgb(' + this.BACKGROUND.r + ',' + this.BACKGROUND.g + ',' + this.BACKGROUND.b + ')';

    const points = data.points;

    points.forEach((point) => {
      this.ctx.fillRect(point.x * this.SQUARE_SPACE, point.y * this.SQUARE_SPACE, this.SQUARE_LENGTH, this.SQUARE_LENGTH);
    });
  }
}
