import { socket } from './MainModel.js';
export class ConfigSection {
    constructor() {
        this.displayElememt = document.getElementById("Config");
        this.GameInputElement = document.getElementById("GameInput");
        this.JoinBtnElement = document.getElementById("JoinBtn");
        this.setUpSocket();
        this.addHandlersToElements();
    }
    setUpSocket() {
        return;
    }
    addHandlersToElements() {
        this.JoinBtnElement.addEventListener("click", () => { this.joinBtnHandler(); });
        return;
    }
    joinBtnHandler() {
        let game = this.GameInputElement.value.trim();
        if (game && socket) {
            socket.emit('leaveGame');
            socket.emit('joinLobby', game);
        }
        console.log("join lobby button clicked!");
        return;
    }
}
//# sourceMappingURL=ConfigSection.js.map