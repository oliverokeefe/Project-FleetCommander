
import type { joinData, game, board, coordinate } from '../../../shared/src/types/types';
import { Board, Territory, Tile } from '../../../shared/src/classes/GameBoard.js';

let socket: SocketIOClient.Socket = undefined;

let Game: string = "";
let Player: string = "";

let gameBoardDiv: HTMLDivElement = undefined;
let gameBoardDisplay: HTMLDivElement[][] = [];
let gameBoard: board = [];


let gameNameDisplay: HTMLDivElement = undefined;
let playerNameDisplay: HTMLDivElement = undefined;


let gameInput: HTMLInputElement = undefined;
let playerInput: HTMLInputElement = undefined;
let joinBtn: HTMLButtonElement = undefined;


let chatLogDisplay: HTMLDivElement = undefined;
let chatInput: HTMLInputElement = undefined;


function clearGame(): void {
    gameNameDisplay.innerText = "";
    playerNameDisplay.innerText = "";
    clearChatLog();
    return;
}

function clearChatLog(): void {
    chatLogDisplay.innerHTML = "";
    let chatLogTop: HTMLDivElement = document.createElement('div');
    chatLogTop.id = "ChatLogTop";
    chatLogDisplay.appendChild(chatLogTop);
    return;
}

function leaveGame(): void {
    socket.emit('leaveGame');
    return;
}

function displayMessage(message: string): void {
    let messageDiv: HTMLDivElement = document.createElement("div");
    messageDiv.innerText = message;
    chatLogDisplay.appendChild(messageDiv);
}

function updateChat(chatLog: string[]): void {
    chatLog.forEach((message) => {
        displayMessage(message);
    });

    chatLogDisplay.scrollTop = chatLogDisplay.scrollHeight;
    return;
}

function updateGameInfo(game: string): void {
    gameNameDisplay.innerText = game;
}

function updatePlayerInfo(player: string): void {
    playerNameDisplay.innerText = player;
}

function getMessage(message: string): void {

    displayMessage(message);
    chatLogDisplay.scrollTop = chatLogDisplay.scrollHeight;

    return;
}

function joinGame(game: string, player: string, chatlog: string[], board: board): void {
    clearGame();
    updateChat(chatlog);
    updateGameInfo(game);
    updatePlayerInfo(player);
    updateBoard(board);
    return;
}

function sendMessage(message: string): void {
    socket.emit('chat', message);
    return;
}

function chatInputHandler(event: KeyboardEvent): void {
    if (event.key === "Enter") {
        sendMessage(chatInput.value);
        chatInput.value = "";
    }
    return;
}

function joinBtnHandler(): void {
    let joinData: joinData = {
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

function updateBoard(board: board): void {

    gameBoard = board;

    gameBoard.forEach((tiles: Tile[], row) => {
        tiles.forEach((tile: Tile, col) => {

            //tile has the info to display
            //gameBoardDisplay[row][col] is where to display the information


        });
    });

    //loop through gameBoard and render each tile
        //Add ships or remove ships as necessary

    return;
}






function populateDOMElementVariables() {
    gameNameDisplay = document.getElementById("GameName") as HTMLDivElement;
    playerNameDisplay = document.getElementById("PlayerName") as HTMLDivElement;


    chatLogDisplay = document.getElementById("ChatLog") as HTMLDivElement;
    chatInput = document.getElementById("ChatInput") as HTMLInputElement;


    gameInput = document.getElementById("GameInput") as HTMLInputElement;
    playerInput = document.getElementById("PlayerInput") as HTMLInputElement;
    joinBtn = document.getElementById("JoinBtn") as HTMLButtonElement;

    gameBoardDiv = document.getElementById("GameBoard") as HTMLDivElement;

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

function createBlankBoard(): void {

    for (let row = 0; row < 11; row++) {
        gameBoardDiv.appendChild(createRow(row));
    }

    gameBoardDiv.classList.remove("nodisp");

    console.log(gameBoard);
    console.log(gameBoardDisplay);

    return;
}

function createRow(row: number): HTMLDivElement {

    let rowDiv: HTMLDivElement = document.createElement("div") as HTMLDivElement;
    let oddeven = (row % 2 === 0) ? "even" : "odd";
    rowDiv.classList.add("row", `r${row}`, oddeven);

    gameBoard.push([]);
    gameBoardDisplay.push([]);

    for (let col = 0; col < 11; col++) {
        rowDiv.appendChild(createTile(row, col));
    }

    return rowDiv;
}

function createTile(row: number, col: number): HTMLDivElement {

    let tile: HTMLDivElement = document.createElement("div") as HTMLDivElement;
    let oddeven = (col % 2 === 0) ? "even" : "odd";
    tile.classList.add("tile", `c${col}`, oddeven);
    tile.id = `r${row}c${col}`;

    gameBoard[row].push(new Tile([row,col]));
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

function init() {

    populateDOMElementVariables();
    addHandlers();
    setUpSocket();

    createBlankBoard();
    //populateGameBoard();
    //spawnShips();


    console.log("initialized");
    return;
}

window.onload = function () {
    init();

    return;
};






