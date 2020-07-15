import { Player } from "./Player";
import { Board } from "./GameBoard";



export class Game {

    public name: string;
    public size: number;
    public players: { [player: string]: Player }
    public board: Board;

    constructor(name: string) {
        this.name = name;
        this.size = 0;
        this.players = {};
        this.board = new Board();
    }

    public addPlayer(player: string): void {
        if (!this.players[player]) {
            this.players[player] = new Player(player);
            this.size++;
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
            this.size--;
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
            if (this.games[game].size === 0) {
                this.deleteGame(game);
            }
        }
        return;
    }

}

