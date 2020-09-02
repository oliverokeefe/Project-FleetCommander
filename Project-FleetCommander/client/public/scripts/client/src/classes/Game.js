import { Board } from './Gameboard.js';
import * as Ship from './Ships.js';
export class Game {
    constructor(socket) {
        this.socket = socket;
        this.displayElement = document.getElementById("Game");
        this.Board = new Board(socket);
        this.setUpSocket();
        this.addHanldersToElements();
    }
    setUpSocket() {
        this.socket.on('start', (data) => { this.start(data); });
        this.socket.on('update', (data) => { this.update(data); });
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
        //Set the players initial scores
        //Set the initial move phase
        //Create **and spawn** the ships listed
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
        });
        //Reveal all of it (remove any/all nodisp classes)
        this.displayElement.classList.remove("nodisp");
        console.log(data);
        return;
    }
    update(data) {
        return;
    }
    clearGame() {
        return;
    }
}
//# sourceMappingURL=Game.js.map