import { socket } from './MainModel.js';


export class ConfigSection {

    public displayElememt: HTMLDivElement;
    public GameInputElement: HTMLInputElement;
    public JoinBtnElement: HTMLButtonElement;

    constructor() {
        this.displayElememt = document.getElementById("Config") as HTMLDivElement;
        this.GameInputElement = document.getElementById("GameInput") as HTMLInputElement;
        this.JoinBtnElement = document.getElementById("JoinBtn") as HTMLButtonElement;

        this.setUpSocket();
        this.addHandlersToElements();
    }

    private setUpSocket(): void {
        return;
    }

    private addHandlersToElements(): void {
        this.JoinBtnElement.addEventListener("click", () => { this.joinBtnHandler() });
        return;
    }

    private joinBtnHandler(): void {
        let game = this.GameInputElement.value.trim();
        if (game && socket) {
            socket.emit('leaveGame');
            socket.emit('joinLobby', game);
        }
        console.log("join lobby button clicked!");
        return;
    }

}

