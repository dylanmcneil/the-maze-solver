package app.models;

public class Point {
    private int x;
    private int y;
    private boolean isWall;
    private boolean isStart;
    private boolean isFinish;

    public Point(int x, int y, boolean isWall) {
        this.x = x;
        this.y = y;
        this.isWall = isWall;
    }

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }

    public boolean isWall() {
        return isWall;
    }

    public void setWall(boolean wall) {
        isWall = wall;
    }

    public boolean isStart() {
        return isStart;
    }

    public void setStart(boolean start) {
        isStart = start;
    }

    public boolean isFinish() {
        return isFinish;
    }

    public void setFinish(boolean finish) {
        isFinish = finish;
    }
}
