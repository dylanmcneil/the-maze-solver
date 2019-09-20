package app.controller;

import app.User;
import app.models.Board;
import app.models.Point;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class BoardController {

    @GetMapping("/board")
    public Board getBoard(){
        System.out.println("Hi *****");
        return buildBoard();
    }

    public Board buildBoard(){
        List<Point> points = new ArrayList<>();

        for(int i = 0; i < 7; i ++){
            for (int j = 0; j < 7; j++){
                Point point = new Point(i, j, false);
                points.add(point);
            }
        }

        return new Board(points);
    }
}
