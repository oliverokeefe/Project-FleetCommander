import { Player } from "./Player";
import { Board } from "../../../shared/src/classes/GameBoard";



export class Game {

    public name: string;
    public playerCount: number;
    public players: { [player: string]: Player }
    public chatLog: string[];
    public board: Board;

    constructor(name: string) {
        this.name = name;
        this.playerCount = 0;
        this.players = {};
        this.chatLog = [];
        this.board = new Board();
    }

    public addPlayer(player: string): void {
        if (!this.players[player]) {
            this.players[player] = new Player(player);
            this.playerCount++;
            this.board.territories.forEach((territory) => {
                if (!territory.player && !this.players[player].territory) {
                    territory.player = this.players[player].name;
                    this.players[player].territory = territory;
                }
            });
        }
        return;
    }

    public removePlayer(player: string): void {
        if (this.players[player]) {
            this.board.territories.forEach((territory) => {
                if (territory.player === this.players[player].name) {
                    territory.player = "";
                    this.players[player].territory = undefined;
                }
            });
            delete this.players[player];
            this.playerCount--;
        }
        return;
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

    public addPlayerToGame(game: string, player: string): void {
        if (this.games[game]) {
            this.games[game].addPlayer(player);
        }
        return;
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

