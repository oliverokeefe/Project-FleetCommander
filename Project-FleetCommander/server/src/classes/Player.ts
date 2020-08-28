import { Territory } from "../../../shared/src/classes/GameBoard";
import { Fleet, Ship } from "./Ships";



export class Player {

    readonly id: string;
    public name: string;
    public score: number;
    public territory: Territory;
    public fleet: Fleet;
    public ready: boolean;


    constructor(id?: string, name?: string) {
        this.id = (id) ? id : "spectator";
        this.name = (name) ? name: this.id;
        this.score = 0;
        this.territory = undefined;
        this.ready = false;
    }

    public setReady(readyState: boolean): void {
        this.ready = readyState;
        return;
    }

}



