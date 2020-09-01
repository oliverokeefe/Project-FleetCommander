

import { Scoreboard } from './Scoreboard.js' 
import { Board } from './Gameboard.js';
import { Player } from './Player.js';
import * as Ship from './Ships.js'
import * as Delta from '../../../shared/src/classes/GameDelta.js';

export class Game {

    public socket: SocketIOClient.Socket;
    public displayElement: HTMLDivElement;
    public Scoreboard: Scoreboard;
    public Player: Player;
    public Board: Board;

    constructor(socket: SocketIOClient.Socket) {
        this.socket = socket;
        this.displayElement = document.getElementById("Game") as HTMLDivElement;

        this.Board = new Board(socket);


        this.setUpSocket();
        this.addHanldersToElements();
    }

    private setUpSocket(): void {
        this.socket.on('start', (data: Delta.InitialGameState) => { this.start(data) });
        this.socket.on('update', (data: Delta.ToClientDelta) => { this.update(data) });
        return;
    }

    private clearSocket(): void {
        //Can ignore this for a while if I just clear the game every time one starts/leaves/joins a game
        return;
    }

    private addHanldersToElements(): void {
        return;
    }

    public start(data: Delta.InitialGameState): void {
        //Create an empty board (This will eventually use the board piece of the data sent)
        //Set the players initial scores
        //Set the initial move phase
        //Create **and spawn** the ships listed

        //Reveal all of it (remove any/all nodisp classes)
        this.displayElement.classList.remove("nodisp");
        console.log(data);
        return;
    }

    public update(data: Delta.ToClientDelta): void {
        return;
    }
    
    public clearGame(): void {
        return;
    }
}
