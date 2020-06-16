import { Action } from '../../../shared/src/classes/Actions.js';
import { Player } from '../../../shared/src/classes/Player.js';
export class PlayerControl {
    constructor(parentElement, id, allPlayerIds) {
        this.playerNameLabel = "Name";
        this.hpLabel = "HP";
        this.sanLabel = "San";
        this.staLabel = "Sta";
        this.strLabel = "Str";
        this.dexLabel = "Dex";
        this.conLabel = "Con";
        this.intLabel = "Int";
        this.wisLabel = "Wis";
        this.chaLabel = "Cha";
        this.actionModLabel = "Modifier";
        this.actionSelectLabel = "Action";
        this.targetSelectLabel = "Target";
        this.parentElement = parentElement;
        this.playerId = id;
        this.allPlayerIds = allPlayerIds;
        this._container = this._createContainerDiv("PlayerControlContainerCore");
        this._populateElements();
        this._addHandlersToElements();
        this._addElementsToContainer();
        this.parentElement.appendChild(this._container);
        this.player = new Player(this.playerId, this.getName(), this.getStats());
        this.initializePlayerData();
        //console.log(JSON.parse(JSON.stringify(this.player)));
        return;
    }
    /*
     * Functions for creating HTML elements that are needed
     */
    _createSelect(name, options) {
        let select = document.createElement('select');
        select.setAttribute('name', name + this.playerId);
        options.forEach((option) => {
            select.appendChild(this._createOption(option));
        });
        return select;
    }
    _createOption(option) {
        let optionElement = document.createElement('option');
        optionElement.setAttribute('value', option);
        optionElement.innerText = option;
        return optionElement;
    }
    _createLabel(forName) {
        let label = document.createElement('label');
        label.setAttribute('for', forName + this.playerId);
        label.innerText = forName;
        return label;
    }
    _createTextInput(name) {
        let textInput = document.createElement('input');
        textInput.setAttribute('type', 'text');
        textInput.setAttribute('name', name + this.playerId);
        return textInput;
    }
    _createNumberInput(name) {
        let numberInput = document.createElement('input');
        numberInput.setAttribute('type', 'number');
        numberInput.setAttribute('name', name + this.playerId);
        return numberInput;
    }
    _createContainerDiv(...classes) {
        let containerDiv = document.createElement('div');
        classes.forEach((className) => {
            containerDiv.classList.add(className);
        });
        return containerDiv;
    }
    /*
     * Eventually I should make it so there is actual client data variables instead of just using the view values...
     *
     * These populate** functions are a good place to add handlers and such
     */
    _populateElements() {
        this._populateNameElement();
        this._populateStatElements();
        this._populateVitalsElements();
        this._populateActionMod();
        this._populateActionElement();
        this._populateTargetElement();
    }
    _populateNameElement() {
        this._playerNameElement = this._createTextInput(this.playerNameLabel);
        this._playerNameElement.value = "Player" + (+this.playerId + 1);
    }
    _populateVitalsElements() {
        this._hpElement = this._createNumberInput(this.hpLabel);
        this._sanElement = this._createNumberInput(this.sanLabel);
        this._staElement = this._createNumberInput(this.staLabel);
        this._hpElement.value = Player.STARTINGVITALS.hp + "";
        this._sanElement.value = Player.STARTINGVITALS.san + "";
        this._staElement.value = Player.STARTINGVITALS.sta + "";
    }
    _populateStatElements() {
        this._strElement = this._createNumberInput(this.strLabel);
        this._dexElement = this._createNumberInput(this.dexLabel);
        this._conElement = this._createNumberInput(this.conLabel);
        this._intElement = this._createNumberInput(this.intLabel);
        this._wisElement = this._createNumberInput(this.wisLabel);
        this._chaElement = this._createNumberInput(this.chaLabel);
        this._strElement.value = Player.DEFAULTSTATS.str + "";
        this._dexElement.value = Player.DEFAULTSTATS.dex + "";
        this._conElement.value = Player.DEFAULTSTATS.con + "";
        this._intElement.value = Player.DEFAULTSTATS.int + "";
        this._wisElement.value = Player.DEFAULTSTATS.wis + "";
        this._chaElement.value = Player.DEFAULTSTATS.cha + "";
    }
    _populateActionMod() {
        this._actionModElement = this._createNumberInput(this.actionModLabel);
        this._actionModElement.value = Player.DEFAULTMODIFIER + "";
    }
    _populateActionElement() {
        this._actionSelectElement = this._createSelect(this.actionSelectLabel, Object.keys(Action.PLAYERACTIONS));
    }
    _populateTargetElement() {
        this._targetSelectElement = this._createSelect(this.targetSelectLabel, this.allPlayerIds);
    }
    /*
     *
     *
     */
    _addHandlersToElements() {
        this._addPlayerInfoUpdateHandlerToElements();
        this._addPlayerActionUpdateHandlerToElements();
    }
    _addPlayerInfoUpdateHandlerToElements() {
        this._playerNameElement.addEventListener("change", () => { this.updatePlayerDataHandler(); });
        this._hpElement.addEventListener("change", () => { this.updatePlayerDataHandler(); });
        this._sanElement.addEventListener("change", () => { this.updatePlayerDataHandler(); });
        this._staElement.addEventListener("change", () => { this.updatePlayerDataHandler(); });
        this._strElement.addEventListener("change", () => { this.updatePlayerDataHandler(); });
        this._dexElement.addEventListener("change", () => { this.updatePlayerDataHandler(); });
        this._conElement.addEventListener("change", () => { this.updatePlayerDataHandler(); });
        this._intElement.addEventListener("change", () => { this.updatePlayerDataHandler(); });
        this._wisElement.addEventListener("change", () => { this.updatePlayerDataHandler(); });
        this._chaElement.addEventListener("change", () => { this.updatePlayerDataHandler(); });
    }
    _addPlayerActionUpdateHandlerToElements() {
        this._actionModElement.addEventListener("change", () => { this.updatePlayerActionHandler(); });
        this._actionSelectElement.addEventListener("change", () => { this.updatePlayerActionHandler(); });
        this._targetSelectElement.addEventListener("change", () => { this.updatePlayerActionHandler(); });
    }
    /*
     * Functions for adding the elements to the container element
     */
    _addElementsToContainer() {
        this._addNameSection();
        this._addVitalsSection();
        this._addStatsSection();
        this._addActionSection();
    }
    _addNameSection() {
        let nameSection = this._createContainerDiv("PlayerName", "Section");
        let nameInputCon = this._createContainerDiv("InputContainer");
        nameInputCon.appendChild(this._playerNameElement);
        nameSection.appendChild(nameInputCon);
        this._container.appendChild(nameSection);
    }
    _addVitalsSection() {
        let vitalsection = this._createContainerDiv("PlayerVitals", "Section");
        let hpInputCon = this._createContainerDiv("InputContainer");
        hpInputCon.appendChild(this._createLabel(this.hpLabel));
        hpInputCon.appendChild(this._hpElement);
        vitalsection.appendChild(hpInputCon);
        let sanInputCon = this._createContainerDiv("InputContainer");
        sanInputCon.appendChild(this._createLabel(this.sanLabel));
        sanInputCon.appendChild(this._sanElement);
        vitalsection.appendChild(sanInputCon);
        let staInputCon = this._createContainerDiv("InputContainer");
        staInputCon.appendChild(this._createLabel(this.staLabel));
        staInputCon.appendChild(this._staElement);
        vitalsection.appendChild(staInputCon);
        this._container.appendChild(vitalsection);
    }
    _addStatsSection() {
        let statSection = this._createContainerDiv("PlayerStats", "Section");
        let strInputCon = this._createContainerDiv("InputContainer");
        strInputCon.appendChild(this._createLabel(this.strLabel));
        strInputCon.appendChild(this._strElement);
        statSection.appendChild(strInputCon);
        let dexInputCon = this._createContainerDiv("InputContainer");
        dexInputCon.appendChild(this._createLabel(this.dexLabel));
        dexInputCon.appendChild(this._dexElement);
        statSection.appendChild(dexInputCon);
        let conInputCon = this._createContainerDiv("InputContainer");
        conInputCon.appendChild(this._createLabel(this.conLabel));
        conInputCon.appendChild(this._conElement);
        statSection.appendChild(conInputCon);
        let intInputCon = this._createContainerDiv("InputContainer");
        intInputCon.appendChild(this._createLabel(this.intLabel));
        intInputCon.appendChild(this._intElement);
        statSection.appendChild(intInputCon);
        let wisInputCon = this._createContainerDiv("InputContainer");
        wisInputCon.appendChild(this._createLabel(this.wisLabel));
        wisInputCon.appendChild(this._wisElement);
        statSection.appendChild(wisInputCon);
        let chaInputCon = this._createContainerDiv("InputContainer");
        chaInputCon.appendChild(this._createLabel(this.chaLabel));
        chaInputCon.appendChild(this._chaElement);
        statSection.appendChild(chaInputCon);
        this._container.appendChild(statSection);
    }
    _addActionSection() {
        let actionSection = this._createContainerDiv("PlayerAction", "Section");
        let actionModInputCon = this._createContainerDiv("InputContainer");
        actionModInputCon.appendChild(this._createLabel(this.actionModLabel));
        actionModInputCon.appendChild(this._actionModElement);
        actionSection.appendChild(actionModInputCon);
        let actionSelectCon = this._createContainerDiv("InputContainer");
        actionSelectCon.appendChild(this._createLabel(this.actionSelectLabel));
        actionSelectCon.appendChild(this._actionSelectElement);
        actionSection.appendChild(actionSelectCon);
        let targetSelectCon = this._createContainerDiv("InputContainer");
        targetSelectCon.appendChild(this._createLabel(this.targetSelectLabel));
        targetSelectCon.appendChild(this._targetSelectElement);
        actionSection.appendChild(targetSelectCon);
        this._container.appendChild(actionSection);
    }
    /*
     * Handlers for when data changes on the input controls
     */
    updatePlayerDataHandler() {
        this.player.updatePlayer(this.getName(), this.getVitals(), this.getStats());
    }
    updatePlayerActionHandler() {
        this.updatePlayerAction();
    }
    initializePlayerData() {
        this.updatePlayerDataHandler();
        this.updatePlayerActionHandler();
    }
    updatePlayerAction() {
        let mod = undefined;
        let action = undefined;
        let target = undefined;
        mod = +this._actionModElement.value;
        if (this._actionSelectElement.selectedIndex != -1 && this._actionSelectElement.options.length > 0) {
            let selectedOption = this._actionSelectElement.options.item(this._actionSelectElement.selectedIndex);
            if (Action.isValidAction(selectedOption.value)) {
                action = selectedOption.value;
            }
        }
        if (this._targetSelectElement.selectedIndex != -1 && this._targetSelectElement.options.length > 0) {
            let selectedOption = this._targetSelectElement.options.item(this._targetSelectElement.selectedIndex);
            target = +selectedOption.value;
        }
        if (mod !== undefined && action && target !== undefined) {
            this.player.updateAction(action, target, mod);
            //this.player.setAction(action, target, mod);
        }
        return;
    }
    updateControlWithPlayerData() {
        this._playerNameElement.value = this.player.playerName;
        let vitals = this.player.vitals;
        this._hpElement.value = vitals.hp + "";
        this._sanElement.value = vitals.san + "";
        this._staElement.value = vitals.sta + "";
        let stats = this.player.stats;
        this._strElement.value = stats.str + "";
        this._dexElement.value = stats.dex + "";
        this._conElement.value = stats.con + "";
        this._intElement.value = stats.int + "";
        this._wisElement.value = stats.wis + "";
        this._chaElement.value = stats.cha + "";
    }
    getName() {
        return this._playerNameElement.value;
    }
    getNameTag() {
        return "[" + this.playerId + "] " + this._playerNameElement.value;
    }
    getVitals() {
        return {
            hp: +this._hpElement.value,
            san: +this._sanElement.value,
            sta: +this._staElement.value
        };
    }
    getStats() {
        return {
            str: +this._strElement.value,
            dex: +this._dexElement.value,
            con: +this._conElement.value,
            int: +this._intElement.value,
            wis: +this._wisElement.value,
            cha: +this._chaElement.value
        };
    }
}
//# sourceMappingURL=devPlayerControl.js.map