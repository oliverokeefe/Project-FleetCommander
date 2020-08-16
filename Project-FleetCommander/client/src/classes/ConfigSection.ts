
export class ConfigSection {

    public socket: SocketIOClient.Socket;

    public displayElememt: HTMLDivElement;
    public GameInputElement: HTMLInputElement;
    public JoinBtnElement: HTMLButtonElement;

    constructor(socket: SocketIOClient.Socket) {
        this.socket = socket;
        this.displayElememt = document.getElementById("Config") as HTMLDivElement;
        this.GameInputElement = document.getElementById("GameInput") as HTMLInputElement;
        this.JoinBtnElement = document.getElementById("JoinBtn") as HTMLButtonElement;

        this.configSocket();
        this.addHandlersToElements();
    }

    private configSocket(): void {

        return;
    }

    private addHandlersToElements(): void {
        this.JoinBtnElement.addEventListener("click", () => { this.joinBtnHandler() });

        return;
    }

    private joinBtnHandler(): void {
        let game = this.GameInputElement.value.trim();
        if (game) {
            this.socket.emit('leaveGame');
            this.socket.emit('joinLobby', game);
        }
        console.log("join lobby button clicked!");
        return;
    }

}

