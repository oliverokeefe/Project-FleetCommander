import { ConfigSection } from "./ConfigSection.js";
import { Lobby } from "./Lobby.js";
import { GameModel } from "./GameModel.js";


/**
 * Data Model for the application
 */
export class MainModel {

    public socket: SocketIOClient.Socket;
    public ConfigSectionModel: ConfigSection;
    public LobbyModel: Lobby;
    public GameModel: GameModel;


    constructor() {
        
        this.setUpSocket();

        this.ConfigSectionModel = new ConfigSection(this.socket);
        this.LobbyModel = new Lobby(this.socket);
        //this.GameModel = new GameModel();


    }

    private setUpSocket(): void {
        this.socket = io();
        return;
    }

}

