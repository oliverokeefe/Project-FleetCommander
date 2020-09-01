import { Chat } from './Chat.js';
export class Lobby {
    constructor(socket) {
        this.socket = socket;
        this.displayElement = document.getElementById("Lobby");
        this.GameNameElement = document.getElementById("GameName");
        this.PlayerInputElement = document.getElementById("PlayerInput");
        this.ReadyBtnElement = document.getElementById("ReadyBtn");
        this.Chat = new Chat(socket);
        this.setUpSocket();
        this.addHandlersToElements();
    }
    setUpSocket() {
        this.socket.on('joinLobby', (game) => { this.joinLobby(game); });
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
        this.socket.emit('ready');
        return;
    }
}
//# sourceMappingURL=Lobby.js.map