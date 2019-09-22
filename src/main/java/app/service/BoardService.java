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
        List<Point> pathTraversal = walkGrid(points);

        return new Board(points, pathTraversal);
    }

    private List<Point> walkGrid(List<Point> points) {
        List<Point> route = new ArrayList<>();

        Point startPoint = null;
        Point finishPoint = null;
        Point currentPoint = null;

        // Find the start and goal in the grid
        for (Point point : points) {
            if (point.isStart()) {
                startPoint = point;
                currentPoint = startPoint;
            } else if (point.isFinish()) {
                finishPoint = point;
            }
        }

        if (startPoint == null || finishPoint == null) {
            System.err.println("No start or end point found in grid!!!");
            return null;
        }

        // Walk to the finish tile
        while (!currentPoint.equals(finishPoint)) {
            route.add(currentPoint);

            // Solve X
            if (finishPoint.getX() > currentPoint.getX()) {
                currentPoint = new Point(currentPoint.getX() + 1, currentPoint.getY());
            } else if (finishPoint.getX() < currentPoint.getX()) {
                currentPoint = new Point(currentPoint.getX() - 1, currentPoint.getY());
            }
            // Solve Y
            else if (finishPoint.getY() > currentPoint.getY()) {
                currentPoint = new Point(currentPoint.getX(), currentPoint.getY() + 1);
            } else if (finishPoint.getY() < currentPoint.getY()) {
                currentPoint = new Point(currentPoint.getX(), currentPoint.getY() - 1);
            }
        }

        route.add(finishPoint);

        return route;
    }

    private void applyStartAndEndPoints(List<Point> points) {
        points.forEach(point -> {
            if (!point.isWall() && point.getX() == 0 && point.getY() == 3) {
                point.setStart(true);
            } else if (!point.isWall() && point.getY() == 0 && point.getX() == Math.sqrt(points.size()) - 1) {
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
