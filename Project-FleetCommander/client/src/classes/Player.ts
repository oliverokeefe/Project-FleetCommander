import * as Ship from "./Ships.js";


import { socket, Game } from './MainModel.js';
import { coordinate } from "../../../shared/src/types/types.js";

/*
 * 
 * Keep track of player resources (ships, points)
 * 
 * SENDS turn updates to server
 * 
 */


export class Player {

    public id: string;
    public name: string;
    public score: number;
    // public ships: Map<string, Ship.Ship>;
    public ships: Map<string, Map<string, Ship.Ship>>;

    public scoreDisplay: HTMLDivElement;


    constructor(id: string, name?: string) {
        this.id = id;
        this.name = (name) ? name : undefined;
        this.score = 0;
        this.ships = new Map<string, Map<string, Ship.Ship>>();

        this.ships.set(Ship.Ship.SHIPCLASSES.PAWN, new Map<string, Ship.Pawn>());
        this.ships.set(Ship.Ship.SHIPCLASSES.KNIGHT, new Map<string, Ship.Knight>());
        this.ships.set(Ship.Ship.SHIPCLASSES.COMMAND, new Map<string, Ship.Command>());
        this.ships.set(Ship.Ship.SHIPCLASSES.FLAGSHIP, new Map<string, Ship.Flagship>());

        this.setUpSocket();
    }

    private setUpSocket(): void {
        return;
    }

    public clearSocket(): void {
        return;
    }

    public ready(): void {
        return;
    }

    public hasShipAt(rowcol: coordinate): boolean {
        let hasShipAtRowCol: boolean = false;
        this.ships.forEach((shipClass) => {
            shipClass.forEach((ship) => {
                if(ship.position &&
                    ship.position.rowcol[0] === rowcol[0] &&
                    ship.position.rowcol[1] === rowcol[1]) {
                        hasShipAtRowCol = true;
                }
            });
        });
        return hasShipAtRowCol;
    }
}



