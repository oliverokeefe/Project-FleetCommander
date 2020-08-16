import { Chat } from './Chat.js';

export class Lobby {

    public socket: SocketIOClient.Socket;
    public displayElement: HTMLDivElement
    public GameNameElement: HTMLDivElement;
    public PlayerInputElement: HTMLInputElement;
    public ReadyBtnElement: HTMLButtonElement;
    public Chat: Chat;

    constructor(socket: SocketIOClient.Socket) {
        this.socket = socket;

        this.displayElement = document.getElementById("Lobby") as HTMLDivElement;
        this.GameNameElement = document.getElementById("GameName") as HTMLDivElement;
        this.PlayerInputElement = document.getElementById("PlayerInput") as HTMLInputElement;
        this.ReadyBtnElement = document.getElementById("ReadyBtn") as HTMLButtonElement;
        this.Chat = new Chat(socket);

        this.ReadyBtnElement.addEventListener("click", () => { this.readyBtnHandler() });

        this.setUpSocket();
    }

    private setUpSocket(): void {
        this.socket.on('joinLobby', (game: string) => { this.joinLobby(game) });
        return;
    }

    private joinLobby(game: string): void {
        this.displayElement.classList.remove("nodisp");
        return;
    }

    private readyBtnHandler(): void {
        this.socket.emit('ready');
        return;
    }

}

