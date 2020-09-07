import { socket } from './MainModel.js';
import { Chat } from './Chat.js';

export class Lobby {

    public displayElement: HTMLDivElement
    public GameNameElement: HTMLDivElement;
    public PlayerInputElement: HTMLInputElement;
    public ReadyBtnElement: HTMLButtonElement;
    public Chat: Chat;

    constructor() {
        this.displayElement = document.getElementById("Lobby") as HTMLDivElement;
        this.GameNameElement = document.getElementById("GameName") as HTMLDivElement;
        this.PlayerInputElement = document.getElementById("PlayerInput") as HTMLInputElement;
        this.ReadyBtnElement = document.getElementById("ReadyBtn") as HTMLButtonElement;
        this.Chat = new Chat();

        this.setUpSocket();
        this.addHandlersToElements();
    }

    private setUpSocket(): void {
        socket.on('joinLobby', (game: string) => { this.joinLobby(game) });
        return;
    }

    private addHandlersToElements(): void {
        this.ReadyBtnElement.addEventListener("click", () => { this.readyBtnHandler() });
        return;
    }

    private joinLobby(game: string): void {
        this.displayElement.classList.remove("nodisp");
        return;
    }

    private readyBtnHandler(): void {
        socket.emit('ready');
        return;
    }

}

