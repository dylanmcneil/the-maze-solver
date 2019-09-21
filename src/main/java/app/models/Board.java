package app.models;

import java.util.List;

public class Board {
    private final List<Point> points;
    private final int squareLength;

    public Board(List<Point> points) {
        this.points = points;
        this.squareLength = (int) Math.sqrt(points.size());
    }

    public List<Point> getPoints() {
        return points;
    }

    public int getSquareLength() {
        return squareLength;
    }
}
