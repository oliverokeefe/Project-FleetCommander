import { PlayerControl } from '../classes/devPlayerControl.js';
import { Action } from '../../../shared/src/classes/Actions.js';
import { PriorityQueue } from '../classes/PriorityQueue.js';
let PlayerAmtElement = undefined;
let CreatePlayersBtn = undefined;
let PlayersContainer = undefined;
let GOBtn = undefined;
let ActionLogContainer = undefined;
let playerControls = [];
let actions = new PriorityQueue(Action.comparator);
function clearData() {
    playerControls = [];
    PlayersContainer.innerHTML = "";
}
function CreatePlayersBtnClickHandler() {
    clearData();
    let allPlayerIds = [];
    for (let i = 0; i < +PlayerAmtElement.value; i++) {
        allPlayerIds.push(i + "");
    }
    let container = document.createElement('div');
    container.classList.add("PlayersContainerCore");
    allPlayerIds.forEach(function (playerId) {
        let playerDiv = document.createElement('div');
        playerDiv.classList.add("PlayerControlContainer");
        playerControls.push(new PlayerControl(playerDiv, playerId, allPlayerIds));
        container.appendChild(playerDiv);
    });
    PlayersContainer.appendChild(container);
}
function GOBtnClickHandler() {
    if (playerControls.length < 1) {
        return;
    }
    displayLog(resolveActions());
}
function displayLog(log) {
    ActionLogContainer.innerHTML = log;
}
function resolveActions() {
    let log = "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++<br/>";
    playerControls.forEach((playerControl) => {
        playerControl.player.setTarget(playerControls[playerControl.player.targetId].player);
        let action = playerControl.player.setAction();
        if (action) {
            actions.push(action);
        }
    });
    while (!actions.isEmpty()) {
        let action = actions.pop();
        if (action) {
            log += `${resolveAction(action)}++++<br/>`;
        }
    }
    log += "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++<br/>";
    return log;
}
function resolveAction(action) {
    let log = "";
    log += action.resolve();
    updatePlayerControls();
    return log;
}
function updatePlayerControls() {
    playerControls.forEach(function (playerControl) {
        playerControl.updateControlWithPlayerData();
    });
}
function populateDOMElementVariables() {
    PlayerAmtElement = document.getElementById("PlayerAmt");
    PlayersContainer = document.getElementById("Players");
    ActionLogContainer = document.getElementById("ActionLog");
    CreatePlayersBtn = document.getElementById("CreatePlayers");
    GOBtn = document.getElementById("GO");
    addHandlers();
    return;
}
function addHandlers() {
    CreatePlayersBtn.addEventListener("click", CreatePlayersBtnClickHandler);
    GOBtn.addEventListener("click", GOBtnClickHandler);
    return;
}
function init() {
    populateDOMElementVariables();
    return;
}
window.onload = function () {
    init();
    return;
};
//# sourceMappingURL=devScript.js.map