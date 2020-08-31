export class Tile {
    constructor(coordinate) {
        this.coordinate = coordinate;
        return;
    }
}
export class Board {
    constructor() {
        return;
    }
    static validCoordinate(coordinate) {
        //Check if the coordinate exists on the game board
        return (coordinate[0] >= 0 && coordinate[1] >= 0 && coordinate[0] < 11 && coordinate[1] < 11);
    }
}
//# sourceMappingURL=GameBoard.js.map