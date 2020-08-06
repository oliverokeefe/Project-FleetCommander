import { Territory } from "../../../shared/src/classes/GameBoard";
import { Ship } from "./Ships";



/*
 * 
 * Keep track of player resources (ships, points)
 * 
 * SENDS turn updates to server
 * 
 */


export class PlayerData {

    public name: string;
    public score: number;
    public territory: Territory;
    public ships: Ship[];

    public scoreDisplay: HTMLDivElement;


    constructor(name: string) {
        this.name = name;
        this.score = 0;
        this.territory = undefined;
        this.ships = [];
    }


}



