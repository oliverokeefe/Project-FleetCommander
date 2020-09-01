let socket = undefined;
let gameBoardDiv = undefined;
let gameBoardDisplay = [];
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
    gameNameDisplay.innerText = game;
}
function updatePlayerInfo(player) {
    playerNameDisplay.innerText = player;
}
function getMessage(message) {
    displayMessage(message);
    chatLogDisplay.scrollTop = chatLogDisplay.scrollHeight;
    return;
}
function joinGame(game, player, chatlog) {
    clearGame();
    updateChat(chatlog);
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
function createBlankBoard() {
    for (let row = 0; row < 11; row++) {
        gameBoardDiv.appendChild(createRow(row));
    }
    gameBoardDiv.classList.remove("nodisp");
    console.log(gameBoardDisplay);
    return;
}
function createRow(row) {
    let rowDiv = document.createElement("div");
    let oddeven = (row % 2 === 0) ? "even" : "odd";
    rowDiv.classList.add("row", `r${row}`, oddeven);
    gameBoardDisplay.push([]);
    for (let col = 0; col < 11; col++) {
        rowDiv.appendChild(createTile(row, col));
    }
    return rowDiv;
}
function createTile(row, col) {
    let tile = document.createElement("div");
    let oddeven = (col % 2 === 0) ? "even" : "odd";
    tile.classList.add("tile", `c${col}`, oddeven);
    tile.id = `r${row}c${col}`;
    gameBoardDisplay[row].push(tile);
    return tile;
}
function spawnShips() {
    //Player One
    spawPawns("playerOnePiece", 0, 2, 0, 2);
    spawnKnights("playerOnePiece", [0, 1], [1, 0]);
    spawnShip("playerOnePiece", "command", [1, 1]);
    spawnShip("playerOnePiece", "flagship", [0, 0]);
    //Player Two
    spawPawns("playerTwoPiece", 0, 2, 8, 10);
    spawnKnights("playerTwoPiece", [0, 9], [1, 10]);
    spawnShip("playerTwoPiece", "command", [1, 9]);
    spawnShip("playerTwoPiece", "flagship", [0, 10]);
    //Player Three
    spawPawns("playerThreePiece", 8, 10, 8, 10);
    spawnKnights("playerThreePiece", [9, 10], [10, 9]);
    spawnShip("playerThreePiece", "command", [9, 9]);
    spawnShip("playerThreePiece", "flagship", [10, 10]);
    //Player Four
    spawPawns("playerFourPiece", 8, 10, 0, 2);
    spawnKnights("playerFourPiece", [9, 0], [10, 1]);
    spawnShip("playerFourPiece", "command", [9, 1]);
    spawnShip("playerFourPiece", "flagship", [10, 0]);
    return;
}
function spawPawns(playerPieceClass, rowMin, rowMax, colMin, colMax) {
    switch (playerPieceClass) {
        case ("playerOnePiece"):
            for (let row = rowMin; row <= rowMax; row++) {
                spawnShip(playerPieceClass, "pawn", [row, colMax]);
            }
            for (let col = colMin; col < colMax; col++) {
                spawnShip(playerPieceClass, "pawn", [rowMax, col]);
            }
            break;
        case ("playerTwoPiece"):
            for (let row = rowMin; row <= rowMax; row++) {
                spawnShip(playerPieceClass, "pawn", [row, colMin]);
            }
            for (let col = colMax; col > colMin; col--) {
                spawnShip(playerPieceClass, "pawn", [rowMax, col]);
            }
            break;
        case ("playerThreePiece"):
            for (let row = rowMin; row <= rowMax; row++) {
                spawnShip(playerPieceClass, "pawn", [row, colMin]);
            }
            for (let col = colMax; col > colMin; col--) {
                spawnShip(playerPieceClass, "pawn", [rowMin, col]);
            }
            break;
        case ("playerFourPiece"):
            for (let row = rowMin; row <= rowMax; row++) {
                spawnShip(playerPieceClass, "pawn", [row, colMax]);
            }
            for (let col = colMin; col < colMax; col++) {
                spawnShip(playerPieceClass, "pawn", [rowMin, col]);
            }
            break;
        default:
            break;
    }
    return;
}
function spawnKnights(playerPieceClass, coordinateOne, coordinateTwo) {
    spawnShip(playerPieceClass, "knight", coordinateOne);
    spawnShip(playerPieceClass, "knight", coordinateTwo);
    return;
}
function spawnShip(playerPieceClass, shipClass, coordinate) {
    let ship = document.createElement("div");
    ship.classList.add("ship", shipClass, playerPieceClass);
    ship.innerText = shipClass.charAt(0).toUpperCase();
    document.getElementById(`${coordinate[0]}${coordinate[1]}`).appendChild(ship);
    return;
}
function joinBtnHandler() {
    //let joinData: joinData = {
    //    game: "",
    //    player: ""
    //};
    //if (gameInput && playerInput) {
    //    joinData.game = gameInput.value.trim();
    //    joinData.player = playerInput.value.trim();
    //}
    //if (joinData.game && joinData.player) {
    //    socket.emit('leaveGame');
    //    socket.emit('joinGame', joinData);
    //}
    //else error
    let game = gameInput.value.trim();
    if (game) {
        socket.emit('leaveGame');
        socket.emit('joinLobby', game);
    }
    console.log("join lobby button clicked!");
    return;
}
function joinLobby(game) {
    console.log("Joined Lobby :)");
    alert("Joined Lobby :)");
    return;
}
function populateDOMElementVariables() {
    gameInput = document.getElementById("GameInput");
    joinBtn = document.getElementById("JoinBtn");
    return;
}
function addHandlers() {
    joinBtn.addEventListener("click", joinBtnHandler);
    //chatInput.addEventListener("keydown", chatInputHandler);
    return;
}
function setUpSocket() {
    socket = io();
    socket.on('joinLobby', joinLobby);
    return;
}
function init() {
    populateDOMElementVariables();
    addHandlers();
    setUpSocket();
    //createBlankBoard();
    //populateGameBoard();
    //spawnShips();
    console.log("initialized");
    return;
}
window.onload = function () {
    init();
    return;
};
//# sourceMappingURL=main2.js.map