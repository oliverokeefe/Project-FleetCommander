import { ConfigSection } from "./ConfigSection.js";
import { Lobby } from "./Lobby.js";
import { Game as GameModel } from "./Game.js";
export let socket;
export let ConfigSectionModel;
export let LobbyModel;
export let Game;
export function init() {
    socket = io();
    ConfigSectionModel = new ConfigSection();
    LobbyModel = new Lobby();
    Game = new GameModel();
}
/**
 * Data Model for the application
 export class MainModel {
     
     public socket: SocketIOClient.Socket;
     public ConfigSectionModel: ConfigSection;
     public LobbyModel: Lobby;
     public Game: Game;
     
     
     constructor() {
         
         this.setUpSocket();
         
         this.ConfigSectionModel = new ConfigSection(this.socket);
         this.LobbyModel = new Lobby(this.socket);
         this.Game = new Game(this.socket);
         
        }
        
        private setUpSocket(): void {
            this.socket = io();
            return;
        }
        
    }
    */
//# sourceMappingURL=MainModel.js.map