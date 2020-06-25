
import type { stats, statKey } from '../../../shared/src/types/types';

let socket: SocketIOClient.Socket = undefined;

let chatLog: HTMLDivElement = undefined;
let chatInput: HTMLInputElement = undefined;

function getMessage(message: string): void {

    let messageDiv: HTMLDivElement = document.createElement("div");
    messageDiv.innerText = message;
    chatLog.appendChild(messageDiv);
    chatLog.scrollTop = chatLog.scrollHeight;

    return;
}

function sendMessage(message: string): void {
    socket.emit('chat', message);
    return;
}




function populateDOMElementVariables() {
    chatLog = document.getElementById("ChatLog") as HTMLDivElement;
    chatInput = document.getElementById("ChatInput") as HTMLInputElement;
    return;
}

function addHandlers() {

    chatInput.addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.key === "Enter") {
            console.log("It worked??!!!??!!");
            sendMessage(chatInput.value);
            chatInput.value = "";
        }
    });
    //button.addEventListener("click", buttonHandler);

    return;
}

function setUpSocket() {
    socket = io();
    socket.on('chat', getMessage);
    return;
}

function init() {

    populateDOMElementVariables();
    addHandlers();
    setUpSocket();

    console.log("initialized");
    return;
}

window.onload = function () {
    init();

    return;
};






