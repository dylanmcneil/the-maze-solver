package app.service;

import app.models.Board;
import app.models.Point;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class BoardService {
    public Board buildBoard(){
      List<Point> points = new ArrayList<>();

      for(int i = 0; i < 10; i ++){
        for (int j = 0; j < 10; j++){
          Point point = new Point(i, j, false);
          points.add(point);
        }
      }

      return new Board(points);
    }
}
