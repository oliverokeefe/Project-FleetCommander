import { Territory } from "./GameBoard";
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

    public setTerritory(territory: Territory): void {

        if(territory){
            this.territory = territory;
            this.fleet = new Fleet(this.territory);
        } else {
            this.territory = undefined;
        }

        return;
    }

    public clear(): void {
        this.fleet.clear();
        this.territory = undefined;
        this.score = 0;
        this.ready = false;
        return;
    }

}



