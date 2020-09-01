import { ConfigSection } from "./ConfigSection.js";
import { Lobby } from "./Lobby.js";
import { Game } from "./Game.js";
/**
 * Data Model for the application
 */
export class MainModel {
    constructor() {
        this.setUpSocket();
        this.ConfigSectionModel = new ConfigSection(this.socket);
        this.LobbyModel = new Lobby(this.socket);
        this.Game = new Game(this.socket);
    }
    setUpSocket() {
        this.socket = io();
        return;
    }
}
//# sourceMappingURL=MainModel.js.map