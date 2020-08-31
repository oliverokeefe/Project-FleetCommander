
import type { coordinate } from '../../../shared/src/types/types';
import { Board, Tile } from './GameBoard.js';


//***** Client ships

/*
 * Client side ship data
 * 
 * Handles ship display,
 *  ship movement,
 *  click events on the ships (show ships that can move this turn, show valid moves)
 * 
 * ignore building ships for now
 */


export abstract class Ship {

    abstract readonly shipClass: string;


    public id: number;
    public position: Tile;
    public shipDisplay: HTMLDivElement;

    constructor(id: number) {
        this.id = id;
        this.shipDisplay = undefined;
    }


    public move(tile: Tile): Tile {
        if (this.validMove(tile.coordinate)) {
            this.position = tile;
        }

        return this.position;
    }

    public validMove(coordinate: coordinate): boolean {
        return Board.validCoordinate(coordinate) && this.shipCanReach(coordinate);
    }

    public shipCanReach(coordinate: coordinate): boolean {
        if ((this.position.coordinate[0] - 1 <= coordinate[0] && coordinate[0] <= this.position.coordinate[0] + 1) &&
            (this.position.coordinate[1] - 1 <= coordinate[1] && coordinate[1] <= this.position.coordinate[1] + 1)) {
            return true;
        } else {
            return false;
        }
    }

}



export class Pawn extends Ship {

    readonly shipClass: string

    constructor(id: number) {
        super(id);
        this.shipClass = "pawn";
    }


}

export class Knight extends Ship {

    readonly shipClass;

    constructor(id: number) {
        super(id);
        this.shipClass = "knight";
    }

}

export class Command extends Ship {

    readonly shipClass: string;

    constructor(id: number) {
        super(id);
        this.shipClass = "command";
    }

}

export class Flagship extends Ship {

    readonly shipClass;
        
    constructor(id: number) {
        super(id);
        this.shipClass = "flagship";
    }

}




