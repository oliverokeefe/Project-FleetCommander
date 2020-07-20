import { Territory } from "../../../shared/src/classes/GameBoard";
import { Ship } from "./Ships";



export class Player {

    public name: string;
    public score: number;
    public territory: Territory;
    public ships: Ship[];


    constructor(name: string) {
        this.name = name;
        this.score = 0;
        this.territory = undefined;
        this.ships = [];
    }


}



