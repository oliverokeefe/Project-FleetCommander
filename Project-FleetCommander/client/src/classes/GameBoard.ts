import { coordinate } from "../../../shared/src/types/types";








export class Tile {
    public coordinate: coordinate

    constructor(coordinate: coordinate) {
        this.coordinate = coordinate;
        return;
    }
}

export class Board {


    constructor() {
        return;
    }

    public static validCoordinate(coordinate: coordinate): boolean {
        //Check if the coordinate exists on the game board

        return (coordinate[0] >= 0 && coordinate[1] >= 0 && coordinate[0] < 11 && coordinate[1] < 11);
    }

}




