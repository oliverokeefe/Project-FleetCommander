
//Make sure the page has a socket.io script this tag before this
//<script src="/socket.io/socket.io.js" > </script>

import { testPlayer } from '../../../shared/src/classes/testPlayer.js';
import { testAction } from '../../../shared/src/classes/testAction.js';
import { PriorityQueue } from '../classes/PriorityQueue.js';

let socket: SocketIOClient.Socket = undefined;

let players: testPlayer[] = [];

let enterBtn: HTMLButtonElement;
let output: HTMLDivElement;


function outputMsg(msg: string) {

    output.innerHTML = msg;
}

function testHandler() {

}

function enterBtnClickHandler() {

    let actionList: PriorityQueue = new PriorityQueue(testAction.comparator);

    console.log(JSON.parse(JSON.stringify(actionList)))
    players.forEach(function (player, index) {
        actionList.push(player.getSelectedAction());
    });
    console.log(JSON.parse(JSON.stringify(actionList)))

    let actionLog: string = "";
    while (!actionList.isEmpty()) {

        let curAction: testAction = actionList.pop();
        console.log(curAction);
        actionLog += curAction.owner + ": " + curAction.action + "<br/>";
    }


    socket.emit('EnterBtnClicked', actionLog);
}

function createPlayers() {

    players.push(new testPlayer(document.getElementById("Player1") as HTMLDivElement, "Player1"));
    players.push(new testPlayer(document.getElementById("Player2") as HTMLDivElement, "Player2"));
    players.push(new testPlayer(document.getElementById("Player3") as HTMLDivElement, "Player3"));
    players.push(new testPlayer(document.getElementById("Player4") as HTMLDivElement, "Player4"));
    players.push(new testPlayer(document.getElementById("Player5") as HTMLDivElement, "Player5"));
    players.push(new testPlayer(document.getElementById("Player6") as HTMLDivElement, "Player6"));

    return;
}

function setUpEnterBtn() {

    enterBtn = document.getElementById("EnterBtn") as HTMLButtonElement;
    output = document.getElementById("Output") as HTMLDivElement;

    enterBtn.addEventListener("click", enterBtnClickHandler);

    return;
}

function setUpSocket() {
    socket = io();
    socket.on('Output', outputMsg);

}

function init() {
    createPlayers();
    setUpEnterBtn();
    setUpSocket();

    return;
}

window.onload = function () {
    init();

    return;
};


