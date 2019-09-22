package app.models;

import java.util.List;

public class Board {
    private final List<Point> points;
    private final List<Point> optimalPath;
    private final int squareLength;

    public Board(List<Point> points, List<Point> optimalPath) {
        this.points = points;
        this.squareLength = (int) Math.sqrt(points.size());
        this.optimalPath = optimalPath;
    }

    public List<Point> getPoints() {
        return points;
    }

    public int getSquareLength() {
        return squareLength;
    }

    public List<Point> getOptimalPath() {
        return optimalPath;
    }
}
