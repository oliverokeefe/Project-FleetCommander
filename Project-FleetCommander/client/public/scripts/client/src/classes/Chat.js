import { socket } from './MainModel.js';
export class Chat {
    constructor() {
        this.displayElement = document.getElementById("Chat");
        this.ChatLogElement = document.getElementById("ChatLog");
        this.ChatLogTopElement = document.getElementById("ChatLogTop");
        this.ChatInputElement = document.getElementById("ChatInput");
        this.ChatInputElement.addEventListener("keydown", (event) => { this.chatInputHandler(event); });
        this.setUpSocket();
    }
    setUpSocket() {
        socket.on('updateChat', (chatLog) => { this.updateChat(chatLog); });
        socket.on('chat', (message) => { this.displayMessage(message); });
        return;
    }
    clearChatLog() {
        this.ChatLogElement.innerHTML = "";
        this.ChatLogTopElement = document.createElement('div');
        this.ChatLogTopElement.id = "ChatLogTop";
        this.ChatLogElement.appendChild(this.ChatLogTopElement);
        return;
    }
    updateChat(chatLog) {
        this.clearChatLog();
        chatLog.forEach((message) => {
            this.displayMessage(message);
        });
        this.ChatLogElement.scrollTop = this.ChatLogElement.scrollHeight;
        return;
    }
    displayMessage(message) {
        let messageDiv = document.createElement("div");
        messageDiv.innerText = message;
        this.ChatLogElement.appendChild(messageDiv);
        this.ChatLogElement.scrollTop = this.ChatLogElement.scrollHeight;
        return;
    }
    sendMessage(message) {
        socket.emit('chat', message);
        return;
    }
    chatInputHandler(event) {
        if (event.key === "Enter") {
            this.sendMessage(this.ChatInputElement.value);
            this.ChatInputElement.value = "";
        }
        return;
    }
}
//# sourceMappingURL=Chat.js.map