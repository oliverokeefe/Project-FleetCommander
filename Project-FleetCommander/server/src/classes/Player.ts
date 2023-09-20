import { Territory, Board } from "./GameBoard.js";
import { Fleet, Ship } from "./Ships.js";
import { SupplyDelta, ToClientDelta, FromClientDelta, MoveDelta } from "../../../shared/src/classes/GameDelta.js";
import { coordinate } from "../../../shared/src/types/types.js";



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
            let movesFinished: boolean = this.updatePositions(board, movePhase);
            if(movesFinished && !this.updateData){
                this.finalUpdate();
            }
        }
        return;
    }

    private finalUpdate(): void {
        this.updateData = {
            spawns: [],
            moves: [],
            supply: [],
            scores: [],
            movePhase: ""
        };
        this.shipsMoved.forEach((ship) => {
            if(ship.moveDelta) {
                this.updateData.moves.push(ship.moveDelta);
                ship.moveDelta = undefined;
            }
        });
        //Fleet Supply for move phase ships
        this.updateSupply();
        //Score
        this.updateScore();
        //spawns
        this.spawnShips();
        this.actions = undefined;
        this.shipsMoved = undefined;
        return;
    }

    private updatePositions(board: Board, movePhase: string): boolean {
        if(!this.shipsMoved){
            this.shipsMoved = new Map<string, Ship>();
        }
        let movesFinished: boolean = true;
        this.actions.moveAttempts.forEach((move) => {
            if(move.ship.playerId === this.id && move.ship.shipClass === movePhase){
                let moveFinished = this.handleMove(move, board);
                if(!moveFinished) {
                    movesFinished = false;
                }
            }
        });
        return movesFinished;
    }

    private handleMove(move: MoveDelta, board: Board): boolean {
        let moveFinished = this.fleet.ships.get(move.ship.shipClass).get(move.ship.shipId).move(board, move.ship.position, move.to);
        if(moveFinished){
            if(!this.shipsMoved.has(Ship.globalId(move.ship.playerId, move.ship.shipClass, move.ship.shipId))) {
                this.shipsMoved.set(
                    Ship.globalId(move.ship.playerId, move.ship.shipClass, move.ship.shipId),
                    this.fleet.ships.get(move.ship.shipClass).get(move.ship.shipId)
                );
            }
        }
        return moveFinished;
    }

    private updateSupply(): void {
        return;
    }

    private updateScore(): void {
        return;
    }

    private spawnShips(): void {
        return;
    }

    private handleSpawn(): void {
        return;
    }


}



