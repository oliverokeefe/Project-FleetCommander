
import { coordinate } from '../../../shared/src/types/types'


export abstract class Ship {

    abstract readonly shipClass: string;


    public id: number;
    public position: coordinate

    constructor(id: number) {
        this.id = id;
    }


    public move(coordinate: coordinate): coordinate {
        //verify move
        //update position
        //return the ships final position (if the move was invalid this will return the starting position)
        return undefined;
    }

    public validateMove(coordinate: coordinate): boolean {
        //verify the coordinate is on the grid
        //verify the ship can reach the coordinate
        return undefined;
    }

}



export class Pawn extends Ship {

    readonly shipClass: string

    constructor(id: number) {
        super(id);
        this.shipClass = "pawn";
    }


}





