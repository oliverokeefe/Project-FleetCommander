import { PlayerData } from "./PlayerData";
import { Board } from "../../../shared/src/classes/GameBoard";



export class GameData {

    public name: string;
    public players: { [player: string]: PlayerData }
    public chatLog: string[];
    public board: Board;

    constructor(name: string) {
        this.name = name;
        this.players = {};
        this.chatLog = [];
        this.board = new Board();
    }

}

