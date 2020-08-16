export class ConfigSection {
    constructor(socket) {
        this.socket = socket;
        this.displayElememt = document.getElementById("Config");
        this.GameInputElement = document.getElementById("GameInput");
        this.JoinBtnElement = document.getElementById("JoinBtn");
        this.configSocket();
        this.addHandlersToElements();
    }
    configSocket() {
        return;
    }
    addHandlersToElements() {
        this.JoinBtnElement.addEventListener("click", () => { this.joinBtnHandler(); });
        return;
    }
    joinBtnHandler() {
        let game = this.GameInputElement.value.trim();
        if (game) {
            this.socket.emit('leaveGame');
            this.socket.emit('joinLobby', game);
        }
        console.log("join lobby button clicked!");
        return;
    }
}
//# sourceMappingURL=ConfigSection.js.map