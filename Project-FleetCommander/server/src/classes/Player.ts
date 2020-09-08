import { Territory, Board } from "./GameBoard";
import { Fleet, Ship } from "./Ships";
import { DestroyedDelta, ToClientDelta, FromClientDelta } from "../../../shared/src/classes/GameDelta";
import { coordinate } from "../../../shared/src/types/types";



export class Player {

    readonly id: string;
    public name: string;
    public score: number;
    public territory: Territory;
    public fleet: Fleet;
    public connected: boolean;
    public ready: boolean;
    public actions: FromClientDelta;
    public shipsMoved: Map<string, Ship>;
    public updateData: ToClientDelta;

    constructor(id: string, territory: Territory, board: Board, name?: string) {
        this.id = id;
        this.name = (name) ? name: this.id;
        this.score = 5;
        this.setTerritory(territory, board);
        this.connected = false;
        this.ready = false;
        this.actions = undefined;
        this.shipsMoved = undefined;
        this.updateData = undefined;
    }

    public setReady(readyState: boolean): void {
        this.ready = readyState;
        return;
    }

    public setTerritory(territory: Territory, board: Board): void {

        if(territory){
            this.territory = territory;
            this.territory.player = this.id;
            this.fleet = new Fleet(this.territory, board);
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

    public incrementalUpdate(board: Board, movePhase: string){

        if(this.actions) {
            if(!this.shipsMoved){
                this.shipsMoved = new Map<string, Ship>();
            }
            let movesFinished: boolean = true;
            this.actions.moveAttempts.forEach((move) => {
                if(move.playerId === this.id && move.shipClass === movePhase){
                    let moveFinished = this.fleet.ships.get(move.shipClass).get(move.shipId).move(board, move.from, move.to);
                    if(moveFinished){
                        if(!this.shipsMoved.has(Ship.globalId(move.playerId, move.shipClass, move.shipId))) {
                            this.shipsMoved.set(
                                Ship.globalId(move.playerId, move.shipClass, move.shipId),
                                this.fleet.ships.get(move.shipClass).get(move.shipId)
                            );
                        }
                    } else {
                        movesFinished = false;
                    }
                }
            });
            if(movesFinished && !this.updateData){
                this.updateData = {
                    spawns: [],
                    moves: [],
                    destroyed: [],
                    scores: [],
                    movePhase: ""
                };
                this.shipsMoved.forEach((ship) => {
                    if(ship.moveDelta) {
                        this.updateData.moves.push(ship.moveDelta);
                        ship.moveDelta = undefined;
                    }
                });
                //BC's
                //points
                //spawn
                this.actions = undefined;
                this.shipsMoved = undefined;
            }
        }
        return;
    }

}



