let socket = undefined;
let Game = "";
let Player = "";
let gameNameDisplay = undefined;
let playerNameDisplay = undefined;
let gameInput = undefined;
let playerInput = undefined;
let joinBtn = undefined;
let chatLogDisplay = undefined;
let chatInput = undefined;
function clearGame() {
    gameNameDisplay.innerText = "";
    playerNameDisplay.innerText = "";
    clearChatLog();
    return;
}
function clearChatLog() {
    chatLogDisplay.innerHTML = "";
    let chatLogTop = document.createElement('div');
    chatLogTop.id = "ChatLogTop";
    chatLogDisplay.appendChild(chatLogTop);
    return;
}
function leaveGame() {
    socket.emit('leaveGame');
    return;
}
function displayMessage(message) {
    let messageDiv = document.createElement("div");
    messageDiv.innerText = message;
    chatLogDisplay.appendChild(messageDiv);
}
function updateChat(chatLog) {
    chatLog.forEach((message) => {
        displayMessage(message);
    });
    chatLogDisplay.scrollTop = chatLogDisplay.scrollHeight;
    return;
}
function updateGameInfo(game) {
    gameNameDisplay.innerText = game.name;
}
function updatePlayerInfo(player) {
    playerNameDisplay.innerText = player;
}
function getMessage(message) {
    displayMessage(message);
    chatLogDisplay.scrollTop = chatLogDisplay.scrollHeight;
    return;
}
function joinGame(game, player) {
    clearGame();
    updateChat(game.chatLog);
    updateGameInfo(game);
    updatePlayerInfo(player);
    return;
}
function sendMessage(message) {
    socket.emit('chat', message);
    return;
}
function chatInputHandler(event) {
    if (event.key === "Enter") {
        sendMessage(chatInput.value);
        chatInput.value = "";
    }
    return;
}
function joinBtnHandler() {
    let joinData = {
        game: "",
        player: ""
    };
    if (gameInput && playerInput) {
        joinData.game = gameInput.value.trim();
        joinData.player = playerInput.value.trim();
    }
    if (joinData.game && joinData.player) {
        socket.emit('leaveGame');
        socket.emit('joinGame', joinData);
    }
    //else error
    return;
}
function populateDOMElementVariables() {
    gameNameDisplay = document.getElementById("GameName");
    playerNameDisplay = document.getElementById("PlayerName");
    chatLogDisplay = document.getElementById("ChatLog");
    chatInput = document.getElementById("ChatInput");
    gameInput = document.getElementById("GameInput");
    playerInput = document.getElementById("PlayerInput");
    joinBtn = document.getElementById("JoinBtn");
    return;
}
function addHandlers() {
    chatInput.addEventListener("keydown", chatInputHandler);
    joinBtn.addEventListener("click", joinBtnHandler);
    return;
}
function setUpSocket() {
    socket = io();
    socket.on('chat', getMessage);
    socket.on('joinGame', joinGame);
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