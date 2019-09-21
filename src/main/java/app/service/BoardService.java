package app.service;

import app.models.Board;
import app.models.Point;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class BoardService {
    public Board buildBoard(int squareLength) {
        List<Point> points = new ArrayList<>();

        for (int i = 0; i < squareLength; i++) {
            for (int j = 0; j < squareLength; j++) {
                Point point = new Point(i, j, false);
                points.add(point);
            }
        }

        applyWallsToPoints(points);
        applyStartAndEndPoints(points);

        return new Board(points);
    }

    private void applyStartAndEndPoints(List<Point> points) {
        points.forEach(point -> {
            if (!point.isWall() && point.getX() == 0 && point.getY() == 0) {
                point.setStart(true);
            }
            else if(!point.isWall() && point.getY() == 0 && point.getX() == Math.sqrt(points.size()) - 1){
                point.setFinish(true);
            }
        });
    }

    private void applyWallsToPoints(List<Point> points) {
        points.forEach(point -> {
            if (point.getX() == 3 && point.getY() > Math.sqrt(points.size()) - 6) {
                point.setWall(true);
            }
        });
    }
}
