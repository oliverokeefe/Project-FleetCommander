import { Player } from "./Player";
import { Board } from "./GameBoard";
import * as Delta from '../../../shared/src/classes/GameDelta';
import { Ship } from "./Ships";

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

    /**
     * Still needs error checking.... Like the rest of the code..
     * 
     */
    public start(): Delta.InitialGameState {

        let startGameData: Delta.InitialGameState = {
            ships: [],
            scores: [],
            movePhase: "",
            board: "" //Currently unimplemented
        };

        startGameData.ships = this.initialShips();
        startGameData.scores = this.initialScores();
        startGameData.movePhase = this.initialMovePhase();


        return startGameData;
    }

    private initialShips(): Delta.ShipData[] {
        let initialShips: Delta.ShipData[] = [];
        //At some point I need like a static game config class that has the playerId's, shipClasses, and shipId's
        //Then the const static data could be used here instead of constantly doing Object.keys()
        Object.keys(this.players).forEach((playerId) => {
            Object.keys(this.players[playerId].fleet.ships).forEach((shipClass) => {
                Object.keys(this.players[playerId].fleet.ships[shipClass]).forEach((shipId) => {
                    initialShips.push({
                        playerId: playerId,
                        shipId: shipId,
                        shipClass: shipClass,
                        startLocation: (this.players[playerId].fleet.ships[shipClass][shipId] as Ship).position.coordinate
                    });
                });
            });
        });

        return initialShips;
    }

    private initialScores(): Delta.ScoreDelta[] {
        let initialScores: Delta.ScoreDelta[] = [];
        Object.keys(this.players).forEach((playerId: string) => {
            initialScores.push({
                playerId: playerId,
                score: 0
            });
        });
        return initialScores;
    }

    private initialMovePhase(): string {
        return "pawn";
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
                    this.players[id].setTerritory(territory);
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
                    this.players[playerId].clear();
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
            if (this.players[id] && !this.players[id].ready) {
                allReady = false;
            } else if(!this.players[id]) {
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

    public startGame(game: string): Delta.InitialGameState {
        let startGameData: Delta.InitialGameState = undefined;
        if(this.games[game]){
            startGameData = this.games[game].start();
        }
        return startGameData;
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

