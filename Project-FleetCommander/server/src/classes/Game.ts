import { Player } from "./Player";
import { Board } from "../../../shared/src/classes/GameBoard";

/**
 * Send to cliet to update game
 * 
 */
export class GameDelta {


}

export class Game {

    public name: string;
    public playerCount: number;
    public players: { [player: string]: Player }
    //public players: {
    //    Player1: Player,
    //    Player2: Player,
    //    Player3: Player,
    //    Player4: Player
    //}
    public chatLog: string[];
    public board: Board;

    constructor(name: string) {
        this.name = name;
        this.playerCount = 0;
        //this.players = {};
        this.players = {
            Player1: undefined,
            Player2: undefined,
            Player3: undefined,
            Player4: undefined
        }
        this.chatLog = [];
        this.board = new Board();
    }

    public start(): void {
        //start the game
        /*
        Generate game board
            -ships will have their player's ID on them
                -Use this ID to verify all moves
        
        Start pawn phase
            -always verify player moves with the current phase
        
        Send client the phase, game object data delta (a.k.a ship location/status), any other data for rendering
        */

        this.board = new Board();


        return;
    }

    public update(): void {

        return;
    }

    public addPlayer(id: string, name?: string): boolean {
        let success: boolean = false;
        if (this.players.hasOwnProperty(id) && !this.players[id]) {
            this.players[id] = new Player(id, name);
            this.playerCount++;
            this.board.territories.forEach((territory) => {
                if (!territory.player || !this.players[id].territory) {
                    territory.player = this.players[id].id;
                    this.players[id].territory = territory;
                }
            });
            success = true;
        }
        return success;
    }

    public tryAddPlayer(playerName?: string): string {
        let success: boolean = false;
        let firstAvailableId: string = this.getFirstAvailablePlayerSlot();
        playerName = (playerName) ? playerName : firstAvailableId;

        if (firstAvailableId) {
            success = this.addPlayer(firstAvailableId, playerName);
        }

        return (success) ? firstAvailableId : "";
    }

    /**
     * TODO
     */
    public addSpectator(): boolean {

        //really just need to increment a counter
        //Spectators have no need for a data model

        return false;
    }

    public removePlayer(playerId: string): boolean {
        let success: boolean = false;
        if (this.players[playerId]) {
            this.board.territories.forEach((territory) => {
                if (territory.player === this.players[playerId].id) {
                    territory.player = "";
                    this.players[playerId].territory = undefined;
                }
            });
            this.players[playerId] = undefined;
            this.playerCount--;
            success = true;
        }
        return success;
    }

    /**
     * TODO
     */
    public removeSpectator(): boolean {

        //just decrement the spectator counter

        return false
    }

    public getFirstAvailablePlayerSlot(): string {
        let ids = Object.keys(this.players);
        let firstAvailable: string = undefined;
        ids.forEach((id) => {
            if (!this.players[id]) {
                firstAvailable = (firstAvailable) ? firstAvailable : id;
            }
        });
        return firstAvailable;
    }

    public readyPlayer(playerId): void {
        this.players[playerId].setReady(true);
        return;
    }

    public allPlayersReady(): boolean {
        let ids = Object.keys(this.players);
        let allReady: boolean = true;
        ids.forEach((id) => {
            if (!this.players[id].ready) {
                allReady = false;
            }
        });
        return allReady;
    }

}

export class GameList {

    public games: { [game: string]: Game };
    public total: number;

    constructor() {
        this.games = {};
        this.total = 0;
    }


    public createGame(game: string): void {
        if (!this.games[game]) {
            this.games[game] = new Game(game);
            this.total++;
        }
        return;
    }

    public deleteGame(game: string): void {
        if (this.games[game]) {
            delete this.games[game];
            this.total--;
        }
        return;
    }

    public addPlayerToGame(game: string, playerId: string): void {
        if (this.games[game]) {
            this.games[game].addPlayer(playerId);
        }
        return;
    }

    public readyPlayerInGame(game: string, playerId: string): void {
        if (this.games[game]) {
            this.games[game].readyPlayer(playerId);
        }
        return;
    }

    public tryAddPlayerToGame(game: string, playerName?: string): string {
        let playerId: string = "";
        if (this.games[game]) {
            playerId = this.games[game].tryAddPlayer(playerName);
        }
        return playerId;
    }

    public startGame(game: string): void {
        if(this.games[game]){
            this.games[game].start();
        }
        return;
    }

    /**
     * TODO
     */
    public addSpectatorToGame(game: string): boolean {
        let success: boolean = false;
        if (this.games[game]) {
            success = this.games[game].addSpectator();
        }
        return success;
    }

    public removePlayerFromGame(game: string, player: string): void {
        if (this.games[game]) {
            this.games[game].removePlayer(player);
            if (this.games[game].playerCount === 0) {
                this.deleteGame(game);
            }
        }
        return;
    }

    /**
     * TODO
     */
    public removeSpectatorFromGame(game: string): boolean {
        let success: boolean = false;
        if (this.games[game]) {
            success = this.games[game].removeSpectator();
        }
        return success;
    }

    public gameExists(game: string): boolean {
        return (this.games[game]) ? true : false;
    }

    public deleteGameIfEmpty(game: string): void {
        if (this.games[game] && this.games[game].playerCount < 1) {
            this.deleteGame(game);
        }
    }

    public playerInGame(game, player): boolean {
        return (this.games[game] && this.games[game].players[player]) ? true : false;
    }

}

