import { PlayerModel } from "./PlayerModel.js";
import { Board } from "./GameBoard.js";


/*
 * Keep track of Game
 * 
 * nice methods for connecting to, setting up and cleaning up game
 * 
 * RECEIVES turn updates from server
 * 
 */

export class GameModel {

    public name: string;
    public display: HTMLDivElement;
    //public players: { [player: string]: PlayerData }
    public player: PlayerModel;
    public chatLog: string[];
    public board: Board;

    //DisplayDivs
        //Game
            //Board
            //Hud (points, build menu, turn counter, etc...)
            //Chat
    //****
    //Need to generate these, as well as have the handlers to keep them updated.
    //(maybe make them each their own 'control' subclass with an abstract 'control' class)
    //****


    constructor(gameDiv: HTMLDivElement) {
        this.name = "";
        this.player = undefined;
        this.chatLog = [];
        this.board = new Board();

        this.display = gameDiv;
    }

    /**
     * 
     * @param data data for connecting to a game, probably just game name (and or pswd)
     */
    public connect(data: any): void {
        // Set up inital connection with server
        // Puts player in game lobby?
        return;
    }

    public ready(): void {
        // handler for the ready button in lobby?, signaling the player is ready to start
        return;
    }

    public start(): void {
        // Called once all players are connected and prepared to play the game
        // Resets all inital states and round counters etc...
        return;
    }

    public update(data: any): void {
        // call to update the game with data
        // should end up being the handler for game updates
        return;
    }

    public clearGame(): void {
        // Remove and delete HTML elements from document. Clean up any other data
        // maybe send message to server to clean it up as well
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

