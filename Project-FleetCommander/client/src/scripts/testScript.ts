
import { coordinate, board } from "../../../shared/src/types/types";
import { Tile } from "../../../shared/src/classes/GameBoard";


let gameBoardDiv: HTMLDivElement = undefined;
let gameBoard = [];


function populateGameBoard() {

    for (let row = 0; row < 11; row++) {
        gameBoardDiv.appendChild(createRow(row));
    }

    gameBoardDiv.classList.remove("nodisp");

    return;
}

function createRow(row: number): HTMLDivElement {

    let rowDiv: HTMLDivElement = document.createElement("div") as HTMLDivElement;
    let oddeven = (row % 2 === 0) ? "even" : "odd";
    rowDiv.classList.add("row", `r${row}`, oddeven);

    for (let col = 0; col < 11; col++) {
        rowDiv.appendChild(createTile([row,col]));
    }

    return rowDiv;
}

function createTile(coordinate: coordinate): HTMLDivElement {

    let tile: HTMLDivElement = document.createElement("div") as HTMLDivElement;
    let oddeven = (coordinate[1] % 2 === 0) ? "even" : "odd";
    tile.classList.add("tile", `c${coordinate[1]}`, oddeven);
    tile.id = `${coordinate[0]}${coordinate[1]}`;

    return tile;
}


function populateDOMElementVariables() {

    gameBoardDiv = document.getElementById("GameBoard") as HTMLDivElement;

    return;
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
    populateGameBoard();
    spawnShips();

    console.log("initialized");
    return;
}

window.onload = function () {
    init();

    return;
};

