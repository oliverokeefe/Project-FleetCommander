import { Board } from './Gameboard.js';
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
        //Create an empty board (This will eventually use the board piece of the data sent)
        //Set the players initial scores
        //Set the initial move phase
        //Create **and spawn** the ships listed
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