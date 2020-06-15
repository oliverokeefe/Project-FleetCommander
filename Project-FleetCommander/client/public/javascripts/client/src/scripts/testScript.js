//Make sure the page has a socket.io script this tag before this
//<script src="/socket.io/socket.io.js" > </script>
import { testPlayer } from '../../../shared/src/classes/testPlayer.js';
import { testAction } from '../../../shared/src/classes/testAction.js';
import { PriorityQueue } from '../classes/PriorityQueue.js';
let socket = undefined;
let players = [];
let enterBtn;
let output;
function outputMsg(msg) {
    output.innerHTML = msg;
}
function testHandler() {
}
function enterBtnClickHandler() {
    let actionList = new PriorityQueue(testAction.comparator);
    console.log(JSON.parse(JSON.stringify(actionList)));
    players.forEach(function (player, index) {
        actionList.push(player.getSelectedAction());
    });
    console.log(JSON.parse(JSON.stringify(actionList)));
    let actionLog = "";
    while (!actionList.isEmpty()) {
        let curAction = actionList.pop();
        console.log(curAction);
        actionLog += curAction.owner + ": " + curAction.action + "<br/>";
    }
    socket.emit('EnterBtnClicked', actionLog);
}
function createPlayers() {
    players.push(new testPlayer(document.getElementById("Player1"), "Player1"));
    players.push(new testPlayer(document.getElementById("Player2"), "Player2"));
    players.push(new testPlayer(document.getElementById("Player3"), "Player3"));
    players.push(new testPlayer(document.getElementById("Player4"), "Player4"));
    players.push(new testPlayer(document.getElementById("Player5"), "Player5"));
    players.push(new testPlayer(document.getElementById("Player6"), "Player6"));
    return;
}
function setUpEnterBtn() {
    enterBtn = document.getElementById("EnterBtn");
    output = document.getElementById("Output");
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
//# sourceMappingURL=testScript.js.map