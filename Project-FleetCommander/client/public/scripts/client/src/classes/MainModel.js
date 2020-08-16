import { ConfigSection } from "./ConfigSection.js";
import { Lobby } from "./Lobby.js";
/**
 * Data Model for the application
 */
export class MainModel {
    constructor() {
        this.setUpSocket();
        this.ConfigSectionModel = new ConfigSection(this.socket);
        this.LobbyModel = new Lobby(this.socket);
        //this.GameModel = new GameModel();
    }
    setUpSocket() {
        this.socket = io();
        return;
    }
}
//# sourceMappingURL=MainModel.js.map