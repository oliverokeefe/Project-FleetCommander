
import type { joinData, game, board } from '../../../shared/src/types/types';
import { Tile } from '../../../shared/src/classes/GameBoard';

let socket: SocketIOClient.Socket = undefined;

let Game: string = "";
let Player: string = "";

let gameBoardDiv: HTMLDivElement = undefined;
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

function updateGameInfo(game: game): void {
    gameNameDisplay.innerText = game.name;
}

function updatePlayerInfo(player: string): void {
    playerNameDisplay.innerText = player;
}

function getMessage(message: string): void {

    displayMessage(message);
    chatLogDisplay.scrollTop = chatLogDisplay.scrollHeight;

    return;
}

function joinGame(game: game, player: string, board: board): void {
    clearGame();
    updateChat(game.chatLog);
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

    //loop through gameBoard and reander each tile
        //Render:
        //Hide game board element
        //-Create Div for the tile
        //-create any HTML elements necessary for pieces on the tile and add them as children
        //-add the tile element to the board element
        //Unhide game board element

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






