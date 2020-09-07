import { socket } from './MainModel.js';
import { Chat } from './Chat.js';
export class Lobby {
    constructor() {
        this.displayElement = document.getElementById("Lobby");
        this.GameNameElement = document.getElementById("GameName");
        this.PlayerInputElement = document.getElementById("PlayerInput");
        this.ReadyBtnElement = document.getElementById("ReadyBtn");
        this.Chat = new Chat();
        this.setUpSocket();
        this.addHandlersToElements();
    }
    setUpSocket() {
        socket.on('joinLobby', (game) => { this.joinLobby(game); });
        return;
    }
    addHandlersToElements() {
        this.ReadyBtnElement.addEventListener("click", () => { this.readyBtnHandler(); });
        return;
    }
    joinLobby(game) {
        this.displayElement.classList.remove("nodisp");
        return;
    }
    readyBtnHandler() {
        socket.emit('ready');
        return;
    }
}
//# sourceMappingURL=Lobby.js.map