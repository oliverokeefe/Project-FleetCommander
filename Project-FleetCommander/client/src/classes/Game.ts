

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
        //Set the players initial scores
        
        //Set the initial move phase
        
        //Create **and spawn** the ships listed
        data.ships.forEach((shipData: Delta.ShipData) => {
            let ship: Ship.Pawn | Ship.Knight | Ship.Command | Ship.Flagship = undefined;
            switch(shipData.shipClass){
                case(Ship.Ship.SHIPCLASSES.PAWN): {
                    ship = new Ship.Pawn(
                        shipData.shipId,
                        shipData.playerId,
                        this.Board.tiles[shipData.startLocation[0]][shipData.startLocation[1]]
                    );
                    break;
                }
                case(Ship.Ship.SHIPCLASSES.KNIGHT): {
                    ship = new Ship.Knight(
                        shipData.shipId,
                        shipData.playerId,
                        this.Board.tiles[shipData.startLocation[0]][shipData.startLocation[1]]
                    );
                    break;
                }
                case(Ship.Ship.SHIPCLASSES.COMMAND): {
                    ship = new Ship.Command(
                        shipData.shipId,
                        shipData.playerId,
                        this.Board.tiles[shipData.startLocation[0]][shipData.startLocation[1]]
                    );
                    break;
                }
                case(Ship.Ship.SHIPCLASSES.FLAGSHIP): {
                    ship = new Ship.Flagship(
                        shipData.shipId,
                        shipData.playerId,
                        this.Board.tiles[shipData.startLocation[0]][shipData.startLocation[1]]
                    );
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

    public update(data: Delta.ToClientDelta): void {
        return;
    }
    
    public clearGame(): void {
        return;
    }
}
