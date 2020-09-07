import { Territory } from "./GameBoard";
import { Fleet, Ship } from "./Ships";
import { DestroyedDelta, ToClientDelta, FromClientDelta } from "../../../shared/src/classes/GameDelta";



export class Player {

    readonly id: string;
    public name: string;
    public score: number;
    public territory: Territory;
    public fleet: Fleet;
    public connected: boolean;
    public ready: boolean;
    public actions: FromClientDelta;
    public updateData: ToClientDelta;

    constructor(id: string, territory: Territory, name?: string) {
        this.id = id;
        this.name = (name) ? name: this.id;
        this.score = 0;
        this.setTerritory(territory);
        this.connected = false;
        this.ready = false;
        this.actions = undefined;
        this.updateData = undefined;
    }

    public setReady(readyState: boolean): void {
        this.ready = readyState;
        return;
    }

    public setTerritory(territory: Territory): void {

        if(territory){
            this.territory = territory;
            this.territory.player = this.id;
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

    public incrementalUpdate(){

        //calculate move incremetaly

        //if moves finished
            //Do these
                //BC's
                //points
                //spawn
                //clear the this.actions


        return;
    }

}



