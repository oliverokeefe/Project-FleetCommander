import { text } from "express";

export class Chat {

    public socket: SocketIOClient.Socket;

    public displayElement: HTMLDivElement;
    public ChatLogElement: HTMLDivElement;
    public ChatLogTopElement: HTMLDivElement;
    public ChatInputElement: HTMLInputElement;

    constructor(socket: SocketIOClient.Socket) {
        this.socket = socket;
        this.displayElement = document.getElementById("Chat") as HTMLDivElement;
        this.ChatLogElement = document.getElementById("ChatLog") as HTMLDivElement;
        this.ChatLogTopElement = document.getElementById("ChatLogTop") as HTMLDivElement;
        this.ChatInputElement = document.getElementById("ChatInput") as HTMLInputElement;

        this.ChatInputElement.addEventListener("keydown", (event: KeyboardEvent) => { this.chatInputHandler(event) });

        this.setUpSocket();
    }

    public setUpSocket(): void {

        this.socket.on('updateChat', (chatLog: string[]) => { this.updateChat(chatLog) });
        this.socket.on('chat', (message: string) => { this.displayMessage(message) });

        return;
    }

    private clearChatLog(): void {
        this.ChatLogElement.innerHTML = "";
        this.ChatLogTopElement = document.createElement('div');
        this.ChatLogTopElement.id = "ChatLogTop";
        this.ChatLogElement.appendChild(this.ChatLogTopElement);
        return;
    }

    private updateChat(chatLog: string[]): void {
        this.clearChatLog();
        chatLog.forEach((message) => {
            this.displayMessage(message);
        });
        this.ChatLogElement.scrollTop = this.ChatLogElement.scrollHeight;
        return;
    }

    private displayMessage(message: string): void {
        let messageDiv: HTMLDivElement = document.createElement("div");
        messageDiv.innerText = message;
        this.ChatLogElement.appendChild(messageDiv);
        this.ChatLogElement.scrollTop = this.ChatLogElement.scrollHeight;
        return;
    }

    private sendMessage(message: string): void {
        this.socket.emit('chat', message);
        return;
    }

    private chatInputHandler(event: KeyboardEvent): void {
        if (event.key === "Enter") {
            this.sendMessage(this.ChatInputElement.value);
            this.ChatInputElement.value = "";
        }
        return;
    }
}

