let socket = undefined;
let chatLog = undefined;
let chatInput = undefined;
function getMessage(message) {
    let messageDiv = document.createElement("div");
    messageDiv.innerText = message;
    chatLog.appendChild(messageDiv);
    chatLog.scrollTop = chatLog.scrollHeight;
    return;
}
function sendMessage(message) {
    socket.emit('chat', message);
    return;
}
function populateDOMElementVariables() {
    chatLog = document.getElementById("ChatLog");
    chatInput = document.getElementById("ChatInput");
    return;
}
function addHandlers() {
    chatInput.addEventListener("keydown", (event) => {
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
//# sourceMappingURL=main.js.map