package app.service;

import app.models.Board;

public class BoardFactory {
    public Board buildBoard(){
        return new Board(null);
    }
}
