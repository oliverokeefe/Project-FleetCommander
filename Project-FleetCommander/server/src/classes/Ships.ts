
import { coordinate } from '../../../shared/src/types/types';
import { Board, Tile, Territory } from './GameBoard';
import { Player } from './Player';
import { X_OK } from 'constants';
import { MoveDelta } from '../../../shared/src/classes/GameDelta';


export class ShipList {

    public ships: {[id: number]: Ship};

    constructor() {
        this.ships = {};
    }

    public tryAddShip(ship: Ship): boolean{
        let success: boolean = false;
        if(!this.ships[ship.id]){
            this.ships[ship.id] = ship;
            success = true;
        }
        return success;
    }

    public removeShip(ship: Ship){
        delete this.ships[ship.id];
    }
}

export class Fleet {

    ///--------------------------------------------------
    //These should later be part of a static 'game config' class
    //  the game config classes can then be used to select different game modes/number of players/ maps/ etc...
    readonly MAXPAWNS: number;
    readonly MAXKNIGHTS: number;
    readonly MAXCOMMAND: number;
    readonly MAXFLAGSHIPS: number;
    ///--------------------------------------------------

    static readonly SHIPCLASSES = {
        PAWN: "pawn",
        KNIGHT: "knight",
        COMMAND: "command",
        FLAGSHIP: "flagship"
    }

    public ships: Map<string, Map<string, Ship>>;

    constructor(territory: Territory, board: Board) {
        this.MAXPAWNS = 5;
        this.MAXKNIGHTS = 2;
        this.MAXCOMMAND = 1;
        this.MAXFLAGSHIPS = 1;

        this.ships = new Map<string, Map<string, Ship>>();

        this.ships.set(Fleet.SHIPCLASSES.PAWN, new Map<string, Pawn>());
        this.ships.set(Fleet.SHIPCLASSES.KNIGHT, new Map<string, Knight>());
        this.ships.set(Fleet.SHIPCLASSES.COMMAND, new Map<string, Command>());
        this.ships.set(Fleet.SHIPCLASSES.FLAGSHIP, new Map<string, Flagship>());

        this.spawnShipsIntoTerritory(territory, board);
        return;
    }

    private spawnShipsIntoTerritory(territory: Territory, board: Board): void{
        if(territory.player){
            territory.pawnStart.forEach((spawnTile: Tile, index: number) => {
                let id: string = index+"";
                let pawn: Pawn = new Pawn(id, territory.player, spawnTile)
                this.ships.get(Fleet.SHIPCLASSES.PAWN).set(id, pawn);
                board.ships.set(pawn.globalId, pawn);
            });
            territory.knightStart.forEach((spawnTile: Tile, index: number) => {
                let id: string = index+"";
                let knight: Knight = new Knight(id, territory.player, spawnTile)
                this.ships.get(Fleet.SHIPCLASSES.KNIGHT).set(id, knight);
                board.ships.set(knight.globalId, knight);
            });
            territory.commandStart.forEach((spawnTile: Tile, index: number) => {
                let id: string = index+"";
                let command: Command = new Command(id, territory.player, spawnTile)
                this.ships.get(Fleet.SHIPCLASSES.COMMAND).set(id, command);
                board.ships.set(command.globalId, command);
            });
            territory.flagshipStart.forEach((spawnTile: Tile, index: number) => {
                let id: string = index+"";
                let flagship: Flagship = new Flagship(id, territory.player, spawnTile)
                this.ships.get(Fleet.SHIPCLASSES.FLAGSHIP).set(id, flagship);
                board.ships.set(flagship.globalId, flagship);
            });
        }
        return;
    }

    public clear(): void {

        this.ships.forEach((shipClass) => {
            shipClass.forEach((ship) => {
                ship.destroy();
            });
        });

        return;
    }

}


export abstract class Ship {

    readonly shipClass: string;
    readonly globalId: string;

    public id: string;
    public playerId: string;
    public position: Tile;
    public spawn: Tile;
    public value: number;
    public moveDelta: MoveDelta;
    public moveFinished: boolean;
    public supply: number;

    constructor(id: string, playerId: string, spawn: Tile, shipClass: string) {
        this.id = id;
        this.playerId = playerId;
        this.position = undefined;
        this.spawn = spawn;
        this.moveFinished = false;
        this.moveDelta = undefined;
        this.value = 1;
        this.shipClass = shipClass;
        this.globalId = Ship.globalId(this.playerId, this.shipClass, this.id);
        this.spawnShip();
    }

    static globalId(playerId: string, shipClass: string, shipId: string): string {
        return `${playerId}:${shipClass}:${shipId}`;
    }

    static getPlayerFromGlobalId(globalId: string): string {
        return globalId.split(":")[0];
    }

    private placeShipOnTile(tile: Tile): void {
        this.removeShipFromBoard();
        tile.ships.set(this.globalId, this);
        this.position = tile;
        return;
    }

    private removeShipFromBoard(): void {
        if(this.position){
            this.position.ships.delete(this.globalId);
            this.position = undefined;
        }
        return;
    }


    public move(board: Board, from: coordinate, to: coordinate): boolean {
        let moveFinished: boolean = true;
        if(this.position) {
            let canReach: boolean = false;
            let battleState = this.position.getBattleState(this.playerId);
            if(!battleState.hasEnemeyShips) {
                canReach = this.canReach(to);
            } else {
                canReach = this.battleReach(to);
            }
            if(!(this.position.rowcol[0] === to[0] && this.position.rowcol[1] === to[1]) &&
                (board.validCoordinate(to) && battleState.shipDiff > -3 && canReach))
            {
                let target: Tile = this.step(board, from, to);
                if(target){
                    this.placeShipOnTile(target);
                    this.updateDelta(from);
                    if(this.position.rowcol[0] !== to[0] || this.position.rowcol[1] !== to[1]) {
                        moveFinished = false;
                    }
                }
            }
        }
        return moveFinished;
    }

    private updateDelta(from: coordinate): void {
        if(!this.moveDelta){
            this.moveDelta = {
                ship: {
                    playerId: this.playerId,
                    shipClass: this.shipClass,
                    shipId: this.id,
                    position: from
                },
                to: this.position.rowcol
            };
        } else {
            this.moveDelta.to = this.position.rowcol;
        }
        return;
    }

    protected step(board: Board, from: coordinate, to: coordinate): Tile { return Movement.step(board, to) }
    protected canReach(to: coordinate): boolean { return Movement.canReach(this, to) }
    protected battleStep(board: Board, from: coordinate, to: coordinate): Tile { return Movement.step(board, to) }
    protected battleReach(to: coordinate): boolean { return Movement.canReach(this, to) }

    public spawnShip(): void {
        this.placeShipOnTile(this.spawn);
        return;
    }

    public destroy(player?: Player): void {
        if(player){
            player.score += this.value;
        }
        this.removeShipFromBoard();
        return;
    }

    /**
     * TODO
     */
    public tryCollectResource(): void {
        return;
    }

}



export class Pawn extends Ship {

    readonly shipClass: string
    readonly globalId: string;

    constructor(id: string, player: string, spawn: Tile) {
        super(id, player, spawn, Fleet.SHIPCLASSES.PAWN);
    }


}

export class Knight extends Ship {

    readonly shipClass: string;
    readonly globalId: string;

    constructor(id: string, player: string, spawn: Tile) {
        super(id, player, spawn, Fleet.SHIPCLASSES.KNIGHT);
        this.value = 2;
    }

    protected canReach(to: coordinate): boolean { return Movement.knightCanReach(this, to) }

}

export class Command extends Ship {

    readonly shipClass: string;
    readonly globalId: string;

    constructor(id: string, player: string, spawn: Tile) {
        super(id, player, spawn, Fleet.SHIPCLASSES.COMMAND);
        this.value = 3;
    }

    protected step(board: Board, from: coordinate, to: coordinate): Tile { return Movement.queenStep(this, board, from, to) }
    protected canReach(to: coordinate): boolean { return Movement.queenCanReach(this, to) }
}

export class Flagship extends Ship {

    readonly shipClass: string;
    readonly globalId: string;

    constructor(id: string, player: string, spawn: Tile) {
        super(id, player, spawn, Fleet.SHIPCLASSES.FLAGSHIP);
        this.value = 5;
    }

    protected step(board: Board, from: coordinate, to: coordinate): Tile { return Movement.queenStep(this, board, from, to) }
    protected canReach(to: coordinate): boolean { return Movement.queenCanReach(this, to) }
}



export class Movement {

    static step(board: Board, to: coordinate): Tile {
        let target: Tile = board.getTile(to);
        return target;
    }

    static queenStep(ship: Ship, board: Board, from: coordinate, to: coordinate): Tile {
        let target: Tile = undefined;
        let vector: [number, number] = [to[0]-from[0], to[1]-from[1]];
        if(vector[0] === 0 && vector[1] === 0){
            return target;
        }
        let magnitude: number = (vector[0] !== 0) ? Math.abs(vector[0]) : Math.abs(vector[1]);
        let normalVector: [number, number] = [vector[0]/magnitude, vector[1]/magnitude];
        let targetCoord: coordinate = [ship.position.rowcol[0]+normalVector[0], ship.position.rowcol[1]+normalVector[1]];
        if((ship.position.rowcol[0] === from[0] && ship.position.rowcol[1] === from[1]) ||
           (ship.position.ships.size === 1)) 
        {
            target = Movement.step(board, targetCoord);
        }
        return target;
    }



    static canReach(ship: Ship, to: coordinate): boolean {
        let vector: [number, number] = [to[0]-ship.position.rowcol[0], to[1]-ship.position.rowcol[1]];
        return ((-1 <= vector[0] && vector[0] <= 1) && (-1 <= vector[1] && vector[1] <= 1));
    }

    static knightCanReach(ship: Ship, to: coordinate): boolean {
        let vector: [number, number] = [to[0]-ship.position.rowcol[0], to[1]-ship.position.rowcol[1]];
        let knightCanReach: boolean = ((-2 === vector[0] || vector[0] === 2) && (-1 === vector[1] || vector[1] === 1)) ||
        ((-1 === vector[0] || vector[0] === 1) && (-2 === vector[1] || vector[1] === 2));
        return knightCanReach || Movement.canReach(ship, to);
    }

    static queenCanReach(ship: Ship, to: coordinate): boolean {
        let vector: [number, number] = [to[0]-ship.position.rowcol[0], to[1]-ship.position.rowcol[1]];
        return ((vector[0] === 0 || vector[1] === 0) ||
                (vector[0] === vector[1]) ||
                (vector[0] === -vector[1])
               );
    }

}




