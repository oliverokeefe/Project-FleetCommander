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
    public board: Board;
    public playerCount: number;
    public playerIds: string[];
    public players: Map<string, Player>;
    public chatLog: string[];

    constructor(name: string) {
        this.name = name;
        this.board = new Board();
        this.playerCount = 0;
        this.playerIds = [
            "Player1",
            "Player2",
            "Player3",
            "Player4"
        ];
        this.initPlayers();
        this.chatLog = [];
    }
    
    private initPlayers(): void {
        this.players = new Map<string, Player>();
        this.playerIds.forEach((id) => {
            this.players.set(id, new Player(id, this.board.territories.get(id)));
        });
        return;
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
        this.playerIds.forEach((playerId) => {
            Object.keys(this.players.get(playerId).fleet.ships).forEach((shipClass) => {
                Object.keys(this.players.get(playerId).fleet.ships[shipClass]).forEach((shipId) => {
                    initialShips.push({
                        playerId: playerId,
                        shipId: shipId,
                        shipClass: shipClass,
                        startLocation: (this.players.get(playerId).fleet.ships[shipClass][shipId] as Ship).position.coordinate
                    });
                });
            });
        });

        return initialShips;
    }

    private initialScores(): Delta.ScoreDelta[] {
        let initialScores: Delta.ScoreDelta[] = [];
        this.playerIds.forEach((playerId: string) => {
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

    public update(): Delta.ToClientDelta {
        let data: Delta.ToClientDelta = {
            spawns: [],
            moves: [],
            destroyed: [],
            scores: [],
            movePhase: ""
        };

        for(let i=0; i<11; i++) {
            this.playerIds.forEach((id) => {
                if(this.players.has(id)) {
                    this.players.get(id).incrementalUpdate();
                }
            });
        }

        this.playerIds.forEach((id) => {
            if(this.players.has(id)) {
                data.spawns = data.spawns.concat(this.players.get(id).updateData.spawns);
                data.moves = data.moves.concat(this.players.get(id).updateData.moves);
                data.destroyed = data.destroyed.concat(this.players.get(id).updateData.destroyed);
                data.scores = data.scores.concat(this.players.get(id).updateData.scores);
                data.movePhase = this.nextMovePhase();
            }
        });

        //-----This should be a useless call now...
        this.clearAllPlayerActions();
        //----

        return data;
    }

    private nextMovePhase(): string {
        //move the move phase forward and return the new phase;
        return;
    }

    private addPlayer(id: string, name?: string): void {
        this.players.get(id).connected = true;
        this.players.get(id).name = (name) ? name : id;
        this.playerCount++;
        return;
    }

    public tryAddPlayer(playerName?: string): string {
        let firstAvailableId: string = this.getFirstAvailablePlayerSlot();
        playerName = (playerName) ? playerName : firstAvailableId;

        if (firstAvailableId) {
            this.addPlayer(firstAvailableId, playerName);
        }

        return (firstAvailableId) ? firstAvailableId : "";
    }

    /**
     * TODO
     */
    public addSpectator(): boolean {

        //really just need to increment a counter
        //Spectators have no need for a data model

        return false;
    }

    public removePlayer(id: string): void {
        if (this.players.has(id)) {
            this.players.get(id).connected = false;
            this.playerCount--;
        }
        return;
    }

    /**
     * TODO
     */
    public removeSpectator(): boolean {

        //just decrement the spectator counter

        return false
    }

    public getFirstAvailablePlayerSlot(): string {
        let firstAvailable: string = undefined;
        this.playerIds.forEach((id) => {
            if (this.players.has(id)) {
                if(!this.players.get(id).connected) {
                    firstAvailable = (firstAvailable) ? firstAvailable : id;
                }
            }
        });
        return firstAvailable;
    }

    public readyPlayer(id): void {
        if(this.players.has(id)){
            this.players.get(id).setReady(true);
        }
        return;
    }

    public allPlayersReady(): boolean {
        let allReady: boolean = true;
        this.playerIds.forEach((id) => {
            if (this.players.has(id) && !this.players.get(id).ready) {
                allReady = false;
            } else if(!this.players.has(id)) {
                allReady = false;
            }
        });
        return allReady;
    }

    public submitPlayerActions(id: string, data: Delta.FromClientDelta): void {
        if(this.players.has(id) && !this.players.get(id).actions){
            this.players.get(id).actions = data;
        }
        return;
    }

    public allPlayerActionsSubmitted(): boolean {
        let allSubmitted: boolean = true;
        this.playerIds.forEach((id) => {
            if (this.players.has(id) && !this.players.get(id).actions) {
                allSubmitted = false;
            } else if(!this.players.has(id)) {
                allSubmitted = false;
            }
        });

        return allSubmitted;
    }

    private clearAllPlayerActions(): void {
        this.playerIds.forEach((id) => {
            if (this.players.has(id)) {
                this.players.get(id).actions = undefined;
            }
        });
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

    public playerInGame(game, id): boolean {
        return (this.games[game] && this.games[game].players.has(id) && this.games[game].players.get(id).connected) ? true : false;
    }

}

