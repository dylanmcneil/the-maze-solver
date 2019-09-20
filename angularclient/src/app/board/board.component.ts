import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BoardService} from "../service/board-service.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  @ViewChild('grid', {static: true})
  canvas: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D;

  constructor(private boardService: BoardService, private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');

    this.boardService.getBoard().subscribe(data => {
      console.log('***** hi', data);
      this.ctx.fillRect(100, 100, 100, 100);
    });
  }

}
