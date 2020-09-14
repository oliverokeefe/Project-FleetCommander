
import { socket, Game } from './MainModel.js';
import type { coordinate } from '../../../shared/src/types/types';
import { Board, Tile } from './GameBoard.js';
import * as Delta from '../../../shared/src/classes/GameDelta.js';

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

export abstract class Ship {

    static readonly SHIPCLASSES = {
        PAWN: "pawn",
        KNIGHT: "knight",
        COMMAND: "command",
        FLAGSHIP: "flagship"
    }

    readonly shipClass: string;
    readonly globalId: string;


    public id: string;
    public playerId: string;
    public displayElement: HTMLDivElement;
    public position: Tile;
    public spawn: Tile;
    public supply: number;
    public shadow: Shadow;
    public moveDelta: Delta.MoveDelta;

    constructor(id: string, player: string, spawnPosition: Tile, shipClass: string) {
        this.id = id;
        this.playerId = player;
        this.displayElement = undefined;
        this.position = undefined;
        this.spawn = spawnPosition;
        this.supply = 0;
        this.moveDelta = undefined;
        this.shadow = new Shadow(this);

        this.shipClass = shipClass;
        this.globalId = Ship.globalId(this.playerId, this.shipClass, this.id);
        this.initShip();
    }

    public static globalId(playerId: string, shipClass: string, shipId: string): string {
        return `${playerId}:${shipClass}:${shipId}`;
    }

    public initShip(): void {
        this.createDisplay();
        this.addEventHandlers();
        this.spawnShip();
        return;
    }

    public createDisplay(): void {
        this.displayElement = document.createElement('div');
        this.displayElement.classList.add(this.playerId, "ship", this.shipClass);
        return;
    }

    public addEventHandlers(): void {
        this.displayElement.addEventListener('click', (event) => { 
            event.stopPropagation();
            this.selectShip();
        });
        this.displayElement.addEventListener('mouseenter', () => { this.highlightShip() });
        this.displayElement.addEventListener('mouseout', () => { this.removeHighlight() });
        return;
    }

    public highlightShip(): void {
        this.displayElement.classList.add("highlight");
        this.shadow.displayElement.classList.add("highlight");
        Game.ShipInfoDisplay.update(this);
        return;
    }

    public removeHighlight(): void {
        this.displayElement.classList.remove("highlight");
        this.shadow.displayElement.classList.remove("highlight");
        return;
    }

    public selectShip(): void {
        let lastSelectedShip: string = undefined;
        if(Game.selectedShip){
            lastSelectedShip = Game.selectedShip.globalId;
            this.position.stageSelectedShip();
        }
        if(this.playerId === Game.Player.id && this.shipClass === Game.movePhase && this.globalId !== lastSelectedShip){
            this.unstage();
            Game.selectedShip = this;
            if(this.position){
                let battleState = this.position.getBattleState(this.playerId);
                console.log(battleState);
                if(!battleState.hasEnemeyShips) {
                    this.suggestMoves();
                } else if (battleState.shipDiff > -3) {
                    this.suggestBattleMoves();
                } else {
                    //ship cannot move... do nothing??
                }
            }
        }
        return;
    }

    public suggestBattleMoves(): void { Movement.suggestBasicMoves(this) }
    public suggestMoves(): void { Movement.suggestBasicMoves(this) }
    
    public unstage(): void {
        if(this.shadow.position){
            this.shadow.position.removeStagedShip(this);
        }
        this.moveDelta = undefined;
        return;
    }

    public shadowMove(): void {
        return;
    }

    public placeShipOnTile(tile: Tile): void {
        this.removeShipFromBoard();
        tile.ships.get(this.shipClass).set(this.globalId, this);
        this.position = tile;
        tile.displayElement.appendChild(this.displayElement);
        return;
    }

    public removeShipFromBoard(): void {
        if(this.position){
            this.shadow.removeShadowFromBoard();
            this.position.ships.get(this.shipClass).delete(this.globalId);
            this.position.displayElement.removeChild(this.displayElement);
            this.position = undefined
        }
        return;
    }

    public spawnShip(): void {
        this.placeShipOnTile(this.spawn);
        return;
    }

    /**
     * Only use to handle server updates. This will move the ship without any safety checks.
     * @param to coordinate of tile to move to
     */
    public move(to: coordinate): void {
        //need to unstage the ship, clear any previous move data, and move the ship
        this.unstage();
        let target = Game.Board.getTile(to);
        if(target) {
            this.placeShipOnTile(target);
        }
        return;
    }

    public tileHasDifferentShips(target: Tile): boolean {
        let hasOtherShips: boolean = false;
        target.ships.forEach((ships, shipClass) => {
            if(shipClass !== this.shipClass && ships.size > 0){
                hasOtherShips = true;
            }
        });
        return hasOtherShips;
    }
}



export class Pawn extends Ship {

    constructor(id: string, player: string, spawnPosition: Tile) {
        super(id, player, spawnPosition, Ship.SHIPCLASSES.PAWN);
    }
}

export class Knight extends Ship {

    constructor(id: string, player: string, spawnPosition: Tile) {
        super(id, player, spawnPosition, Ship.SHIPCLASSES.KNIGHT);
    }

    public suggestMoves(): void { Movement.suggestKnightMoves(this) }
}

export class Command extends Ship {

    constructor(id: string, player: string, spawnPosition: Tile) {
        super(id, player, spawnPosition, Ship.SHIPCLASSES.COMMAND);
    }

    public suggestMoves(): void { Movement.suggestQueenMoves(this) }
}

export class Flagship extends Ship {

    constructor(id: string, player: string, spawnPosition: Tile) {
        super(id, player, spawnPosition, Ship.SHIPCLASSES.FLAGSHIP);
    }
    
    public suggestMoves(): void { Movement.suggestQueenMoves(this) }
}




export class Shadow {

    readonly shipClass;
    public displayElement: HTMLDivElement;
    public owner: Ship;
    public position: Tile;

    constructor(owner: Ship) {
        this.displayElement = undefined;
        this.owner = owner;
        this.position = undefined;
        this.shipClass = "shadow";
        this.createDisplay();
        this.addEventHandlers();
    }

    public createDisplay(): void {
        this.displayElement = document.createElement('div');
        this.displayElement.classList.add(this.owner.playerId, "ship", this.shipClass);
        return;
    }

    public addEventHandlers(): void {
        this.displayElement.addEventListener('click', (event) => { 
            event.stopPropagation();
            this.cancelMove();
        });
        this.displayElement.addEventListener('mouseenter', () => { this.highlightShip() });
        this.displayElement.addEventListener('mouseout', () => { this.removeHighlight() });
        return;
    }

    public highlightShip(): void {
        this.displayElement.classList.add("highlight");
        this.owner.displayElement.classList.add("highlight");
        Game.ShipInfoDisplay.update(this.owner);
        return;
    }

    public removeHighlight(): void {
        this.displayElement.classList.remove("highlight");
        this.owner.displayElement.classList.remove("highlight");
        return;
    }

    public cancelMove(): void {
        this.owner.unstage();
        this.removeHighlight();
        return;
    }


    public placeShadowOnTile(tile: Tile): void {
        this.removeShadowFromBoard();
        this.position = tile;
        tile.displayElement.appendChild(this.displayElement);
        return;
    }

    public removeShadowFromBoard(): void {
        if(this.position){
            this.position.displayElement.removeChild(this.displayElement);
            this.position = undefined
        }
        return;
    }
}


export class Movement {

    static suggestBasicMoves(ship: Ship): void {
        if(ship.position){
            for(let rowMod = -1; rowMod <= 1; rowMod++){
                for(let colMod = -1; colMod <= 1; colMod++){
                    if(!(rowMod === 0 && colMod === 0)){
                        let curCoord: coordinate = [
                            ship.position.rowcol[0]+rowMod,
                            ship.position.rowcol[1]+colMod
                        ];
                        if(Game.Board.validCoordinate(curCoord)){
                            Game.Board.suggestTile(Game.Board.tiles[curCoord[0]][curCoord[1]]);
                        }
                    }
                }
            }
        }
        return;
    }

    static suggestKnightMoves(ship: Ship): void {
        if(ship.position){
            let range: coordinate[] = [
                [-2,-1],
                [-2,1],
                [-1,-2],
                [-1,2],
                [1,-2],
                [1,2],
                [2,-1],
                [2,1],
            ];
            range.forEach((mod: coordinate) => {
                let curCoord: coordinate = [
                    ship.position.rowcol[0]+mod[0],
                    ship.position.rowcol[1]+mod[1]
                ];
                if(Game.Board.validCoordinate(curCoord)){
                    Game.Board.suggestTile(Game.Board.tiles[curCoord[0]][curCoord[1]]);
                }

            });
            Movement.suggestBasicMoves(ship);
        }
        return;
    }

    static suggestQueenMoves(ship: Ship): void {
        if(ship.position){
            let directions: [number, number][] = [
                [-1,0],
                [-1,1],
                [0,1],
                [1,1],
                [1,0],
                [1,-1],
                [0,-1],
                [-1,-1]
            ];
            directions.forEach((vector: coordinate) => {
                let blocked: boolean = false;
                for(let mag=1; mag<=11; mag++){
                    let curCoord: coordinate = [
                        ship.position.rowcol[0]+vector[0]*mag,
                        ship.position.rowcol[1]+vector[1]*mag
                    ];
                    let target: Tile = Game.Board.getTile(curCoord);
                    if(target && !blocked) {
                        Game.Board.suggestTile(target);
                        blocked = ship.tileHasDifferentShips(target);
                    }
                }
            });
        }
        return;
    }
}


