import { socket } from './MainModel.js';
import { Scoreboard } from './Scoreboard.js';
import { ShipInfo } from './ShipInfo.js';
import { Board } from './Gameboard.js';
import { Player } from './Player.js';
import * as Ship from './Ships.js';
export class Game {
    constructor() {
        this.displayElement = document.getElementById("Game");
        this.Player = undefined;
        this.Scoreboard = new Scoreboard();
        this.ShipInfoDisplay = new ShipInfo();
        this.Board = new Board();
        this.movePhase = undefined;
        this.selectedShip = undefined;
        this.setUpSocket();
        this.addHanldersToElements();
    }
    setUpSocket() {
        socket.on('createPlayer', (id) => { this.Player = new Player(id); });
        socket.on('start', (data) => { this.start(data); });
        socket.on('update', (data) => { this.update(data); });
        return;
    }
    clearSocket() {
        //Can ignore this for a while if I just clear the game every time one starts/leaves/joins a game
        return;
    }
    addHanldersToElements() {
        return;
    }
    start(data) {
        if (this.Player && this.Scoreboard) {
            this.Scoreboard.start(data.scores, data.movePhase);
            data.ships.forEach((shipData) => {
                let ship = undefined;
                switch (shipData.shipClass) {
                    case (Ship.Ship.SHIPCLASSES.PAWN): {
                        ship = new Ship.Pawn(shipData.shipId, shipData.playerId, this.Board.tiles[shipData.startLocation[0]][shipData.startLocation[1]]);
                        break;
                    }
                    case (Ship.Ship.SHIPCLASSES.KNIGHT): {
                        ship = new Ship.Knight(shipData.shipId, shipData.playerId, this.Board.tiles[shipData.startLocation[0]][shipData.startLocation[1]]);
                        break;
                    }
                    case (Ship.Ship.SHIPCLASSES.COMMAND): {
                        ship = new Ship.Command(shipData.shipId, shipData.playerId, this.Board.tiles[shipData.startLocation[0]][shipData.startLocation[1]]);
                        break;
                    }
                    case (Ship.Ship.SHIPCLASSES.FLAGSHIP): {
                        ship = new Ship.Flagship(shipData.shipId, shipData.playerId, this.Board.tiles[shipData.startLocation[0]][shipData.startLocation[1]]);
                        break;
                    }
                }
                this.Board.ships.set(ship.globalId, ship);
                if (this.Player.id === ship.playerId) {
                    this.Player.ships.get(ship.shipClass).set(ship.id, ship);
                }
            });
            this.displayElement.classList.remove("nodisp");
        }
        return;
    }
    update(data) {
        this.Scoreboard.SubmitMoveBtn.disabled = false;
        return;
    }
    clearGame() {
        return;
    }
    deselectShip() {
        this.selectedShip = undefined;
        this.Board.clearSuggestions();
        return;
    }
    buildUpdateDelta() {
        let data = {
            spawnAttempts: this.getSpawns(),
            moveAttempts: this.getMoves()
        };
        return data;
    }
    /**
     * TODO.... Currently cannot rebuild ships anyway
     */
    getSpawns() {
        return [];
    }
    getMoves() {
        let moves = [];
        this.Player.ships.get(this.movePhase).forEach((ship) => {
            if (ship.moveDelta) {
                moves.push(ship.moveDelta);
            }
        });
        return moves;
    }
}
//# sourceMappingURL=Game.js.map