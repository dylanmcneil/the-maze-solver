package app.controller;

import app.models.Board;
import app.service.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class BoardController {

  private final BoardService boardService;

  @Autowired
  public BoardController(BoardService boardService) {
    this.boardService = boardService;
  }

  @GetMapping("/board")
  public Board getBoard() {
    System.out.println("<<<<< Getting board >>>>>");
    return boardService.buildBoard(10);
  }
}
