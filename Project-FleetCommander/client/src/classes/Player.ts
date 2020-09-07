import * as Ship from "./Ships.js";


import { socket, Game } from './MainModel.js';

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

}



