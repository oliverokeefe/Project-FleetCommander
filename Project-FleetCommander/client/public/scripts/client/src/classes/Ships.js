import { Game } from './MainModel.js';
import { Board } from './GameBoard.js';
export class ShipList {
    constructor() {
        this.ships = {};
    }
    tryAddShip(ship) {
        let success = false;
        if (!this.ships[ship.id]) {
            this.ships[ship.id] = ship;
            success = true;
        }
        return success;
    }
    removeShip(ship) {
        delete this.ships[ship.id];
    }
}
export class Ship {
    constructor(id, player, spawnPosition) {
        this.id = id;
        this.playerId = player;
        this.displayElement = undefined;
        this.position = undefined;
        this.spawn = spawnPosition;
        this.battleCounter = 0;
        this.moveDelta = undefined;
        this.shadow = new Shadow(this);
    }
    static globalId(playerId, shipClass, shipId) {
        return `${playerId}:${shipClass}:${shipId}`;
    }
    initShip() {
        this.createDisplay();
        this.addEventHandlers();
        this.spawnShip();
        return;
    }
    createDisplay() {
        this.displayElement = document.createElement('div');
        this.displayElement.classList.add(this.playerId, "ship", this.shipClass);
        return;
    }
    addEventHandlers() {
        this.displayElement.addEventListener('click', (event) => {
            event.stopPropagation();
            this.selectShip();
        });
        this.displayElement.addEventListener('mouseenter', () => { this.highlightShip(); });
        this.displayElement.addEventListener('mouseout', () => { this.removeHighlight(); });
        return;
    }
    highlightShip() {
        this.displayElement.classList.add("highlight");
        this.shadow.displayElement.classList.add("highlight");
        Game.ShipInfoDisplay.update(this);
        return;
    }
    removeHighlight() {
        this.displayElement.classList.remove("highlight");
        this.shadow.displayElement.classList.remove("highlight");
        return;
    }
    selectShip() {
        let lastSelectedShip = undefined;
        if (Game.selectedShip) {
            lastSelectedShip = Game.selectedShip.globalId;
            this.position.stageSelectedShip();
        }
        if (this.playerId === Game.Player.id && this.shipClass === Game.movePhase && this.globalId !== lastSelectedShip) {
            this.unstage();
            if (this.position) {
                Game.selectedShip = this;
                this.suggestMoves();
            }
        }
        return;
    }
    suggestMoves() {
        if (this.position) {
            for (let rowMod = -1; rowMod <= 1; rowMod++) {
                for (let colMod = -1; colMod <= 1; colMod++) {
                    if (!(rowMod === 0 && colMod === 0)) {
                        let curCoord = [
                            this.position.rowcol[0] + rowMod,
                            this.position.rowcol[1] + colMod
                        ];
                        if (Board.validCoordinate(curCoord)) {
                            Game.Board.suggestTile(Game.Board.tiles[curCoord[0]][curCoord[1]]);
                        }
                    }
                }
            }
        }
        return;
    }
    unstage() {
        if (this.shadow.position) {
            this.shadow.position.removeStagedShip(this);
        }
        this.moveDelta = undefined;
        return;
    }
    shadowMove() {
        return;
    }
    move(tile) {
        if (this.validMove(tile.rowcol)) {
            this.position = tile;
        }
        return this.position;
    }
    validMove(coordinate) {
        return Board.validCoordinate(coordinate) && this.shipCanReach(coordinate);
    }
    shipCanReach(coordinate) {
        ///Somewhere in here should check if ship is being blocked
        if ((this.position.rowcol[0] - 1 <= coordinate[0] && coordinate[0] <= this.position.rowcol[0] + 1) &&
            (this.position.rowcol[1] - 1 <= coordinate[1] && coordinate[1] <= this.position.rowcol[1] + 1)) {
            return true;
        }
        else {
            return false;
        }
    }
    getPossibleMoves() {
        let viableMoves = [];
        if (this.position) {
            for (let rowMod = -1; rowMod <= 1; rowMod++) {
                for (let colMod = -1; colMod <= 1; colMod++) {
                    if (!(rowMod === 0 && colMod === 0)) {
                        let curCoord = [
                            this.position.rowcol[0] + rowMod,
                            this.position.rowcol[1] + colMod
                        ];
                        if (Board.validCoordinate(curCoord)) {
                            viableMoves.push(curCoord);
                        }
                    }
                }
            }
        }
        return viableMoves;
    }
    placeShipOnTile(tile) {
        this.removeShipFromBoard();
        tile.ships.add(this.globalId);
        this.position = tile;
        tile.displayElement.appendChild(this.displayElement);
        return;
    }
    removeShipFromBoard() {
        if (this.position) {
            this.position.ships.delete(this.globalId);
            this.position.displayElement.removeChild(this.displayElement);
            this.position = undefined;
        }
        return;
    }
    spawnShip() {
        this.placeShipOnTile(this.spawn);
        return;
    }
}
Ship.SHIPCLASSES = {
    PAWN: "pawn",
    KNIGHT: "knight",
    COMMAND: "command",
    FLAGSHIP: "flagship"
};
export class Pawn extends Ship {
    constructor(id, player, spawnPosition) {
        super(id, player, spawnPosition);
        this.shipClass = Ship.SHIPCLASSES.PAWN;
        this.globalId = Ship.globalId(this.playerId, this.shipClass, this.id);
        this.initShip();
    }
}
export class Knight extends Ship {
    constructor(id, player, spawnPosition) {
        super(id, player, spawnPosition);
        this.shipClass = Ship.SHIPCLASSES.KNIGHT;
        this.globalId = Ship.globalId(this.playerId, this.shipClass, this.id);
        this.initShip();
    }
    suggestMoves() {
        console.log("Suggest Moves??");
        if (this.position) {
            let range = [
                [-2, -1],
                [-2, 1],
                [-1, -2],
                [-1, 2],
                [1, -2],
                [1, 2],
                [2, -1],
                [2, 1],
            ];
            range.forEach((mod) => {
                let curCoord = [
                    this.position.rowcol[0] + mod[0],
                    this.position.rowcol[1] + mod[1]
                ];
                if (Board.validCoordinate(curCoord)) {
                    Game.Board.suggestTile(Game.Board.tiles[curCoord[0]][curCoord[1]]);
                }
            });
        }
        return;
    }
}
export class Command extends Ship {
    constructor(id, player, spawnPosition) {
        super(id, player, spawnPosition);
        this.shipClass = Ship.SHIPCLASSES.COMMAND;
        this.globalId = Ship.globalId(this.playerId, this.shipClass, this.id);
        this.initShip();
    }
}
export class Flagship extends Ship {
    constructor(id, player, spawnPosition) {
        super(id, player, spawnPosition);
        this.shipClass = Ship.SHIPCLASSES.FLAGSHIP;
        this.globalId = Ship.globalId(this.playerId, this.shipClass, this.id);
        this.initShip();
    }
}
export class Shadow {
    constructor(owner) {
        this.displayElement = undefined;
        this.owner = owner;
        this.position = undefined;
        this.shipClass = "shadow";
        this.createDisplay();
        this.addEventHandlers();
    }
    createDisplay() {
        this.displayElement = document.createElement('div');
        this.displayElement.classList.add(this.owner.playerId, "ship", this.shipClass);
        return;
    }
    addEventHandlers() {
        this.displayElement.addEventListener('click', (event) => {
            event.stopPropagation();
            this.cancelMove();
        });
        this.displayElement.addEventListener('mouseenter', () => { this.highlightShip(); });
        this.displayElement.addEventListener('mouseout', () => { this.removeHighlight(); });
        return;
    }
    highlightShip() {
        this.displayElement.classList.add("highlight");
        this.owner.displayElement.classList.add("highlight");
        Game.ShipInfoDisplay.update(this.owner);
        return;
    }
    removeHighlight() {
        this.displayElement.classList.remove("highlight");
        this.owner.displayElement.classList.remove("highlight");
        return;
    }
    cancelMove() {
        this.owner.unstage();
        this.removeHighlight();
        return;
    }
    placeShadowOnTile(tile) {
        this.removeShadowFromBoard();
        this.position = tile;
        tile.displayElement.appendChild(this.displayElement);
        return;
    }
    removeShadowFromBoard() {
        if (this.position) {
            this.position.displayElement.removeChild(this.displayElement);
            this.position = undefined;
        }
        return;
    }
}
//# sourceMappingURL=Ships.js.map