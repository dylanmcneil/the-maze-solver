package app.models;

import java.util.List;

public class Board {
    private List<Point> points;

    public Board(List<Point> points) {
        this.points = points;
    }

    public List<Point> getPoints() {
        return points;
    }

    public void setPoints(List<Point> points) {
        this.points = points;
    }
}
