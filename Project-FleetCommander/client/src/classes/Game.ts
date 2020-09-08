
import { socket } from './MainModel.js';
import { Scoreboard } from './Scoreboard.js' 
import { ShipInfo } from './ShipInfo.js';
import { Board } from './Gameboard.js';
import { Player } from './Player.js';
import * as Ship from './Ships.js'
import * as Delta from '../../../shared/src/classes/GameDelta.js';

export class Game {

    public displayElement: HTMLDivElement;
    public Scoreboard: Scoreboard;
    public ShipInfoDisplay: ShipInfo;
    public Player: Player;
    public Board: Board;
    public movePhase: string;
    public selectedShip: Ship.Ship;

    constructor() {
        this.displayElement = document.getElementById("Game") as HTMLDivElement;
        this.Player = undefined;
        this.Scoreboard = new Scoreboard();
        this.ShipInfoDisplay = new ShipInfo();
        this.Board = new Board();
        this.movePhase = undefined;
        this.selectedShip = undefined;


        this.setUpSocket();
        this.addHanldersToElements();
    }

    private setUpSocket(): void {
        socket.on('createPlayer', (id: string) => { this.Player = new Player(id) });
        socket.on('start', (data: Delta.InitialGameState) => { this.start(data) });
        socket.on('update', (data: Delta.ToClientDelta) => { this.update(data) });
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
        if(this.Player && this.Scoreboard){

            this.Scoreboard.start(data.scores, data.movePhase);
            
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
                if(this.Player.id === ship.playerId){
                    this.Player.ships.get(ship.shipClass).set(ship.id, ship);
                }
            });
            this.displayElement.classList.remove("nodisp");
        }
        return;
    }

    public update(data: Delta.ToClientDelta): void {
        console.log(data);
        //Need to handle
            //movePhase
            this.Scoreboard.setMovePhase(data.movePhase);
            //moves
            data.moves.forEach((move) => {
                let shipGlobalId: string = Ship.Ship.globalId(move.playerId, move.shipClass, move.shipId);
                if(this.Board.ships.has(shipGlobalId)) {
                    this.Board.ships.get(shipGlobalId).move(move.to);
                }
            });
            //detroyed
            //scores
            //spawns

        this.Scoreboard.SubmitMoveBtn.disabled = false;
        return;
    }
    
    public clearGame(): void {
        return;
    }

    public deselectShip(): void {
        this.selectedShip = undefined;
        this.Board.clearSuggestions();
        return;
    }

    public buildUpdateDelta(): Delta.FromClientDelta {
        let data: Delta.FromClientDelta = {
            spawnAttempts: this.getSpawns(),
            moveAttempts: this.getMoves()
        }
        return data;
    }
    
    /**
     * TODO.... Currently cannot rebuild ships anyway
     */
    public getSpawns(): Delta.SpawnDelta[] {
        return [];
    }
    
    public getMoves(): Delta.MoveDelta[] {
        let moves: Delta.MoveDelta[] = [];
        this.Player.ships.get(this.movePhase).forEach((ship: Ship.Ship) => {
            if(ship.moveDelta){
                moves.push(ship.moveDelta);
            }
        });
        return moves;
    }
}
