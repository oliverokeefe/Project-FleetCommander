import { Territory } from "../../../shared/src/classes/GameBoard.js";
import { Ship } from "./Ships.js";



/*
 * 
 * Keep track of player resources (ships, points)
 * 
 * SENDS turn updates to server
 * 
 */


export class PlayerModel {

    public name: string;
    public score: number;
    public territory: Territory;
    public ships: Ship[];

    public scoreDisplay: HTMLDivElement;


    constructor(name: string) {
        this.name = name;
        this.score = 0;
        this.territory = undefined;
        this.ships = [];
    }




    public ready(): void {
        //singal player to the server the player is ready
        // This may include submiting any moves that have been made
        return;
    }


    public setUpSocket(socket: SocketIOClient.Socket): void {
        // adds the handlers to the socket for the events that occur during the game
        // the handlers will be functions of this GameData class.
        return;
    }

    public clearSocket(socket: SocketIOClient.Socket): void {
        // Remove all event handlers that were added in the setUpSocket function
        return;
    }

}



