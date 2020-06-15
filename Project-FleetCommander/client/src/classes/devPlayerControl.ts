
import type { actionKey, stats, vitals } from '../../../shared/src/types/types';
import { Action } from '../../../shared/src/classes/Actions.js';
import { Player } from '../../../shared/src/classes/Player.js';

export class PlayerControl {

    readonly parentElement: HTMLDivElement;
    readonly playerId: string;
    readonly allPlayerIds: string[];

    //Containing element
    private _container: HTMLDivElement;

    //Player name input element
    private _playerNameElement: HTMLInputElement;
    readonly playerNameLabel: string = "Name";

    //Vitals
    private _hpElement: HTMLInputElement;
    private _sanElement: HTMLInputElement;
    private _staElement: HTMLInputElement;

    readonly hpLabel: string = "HP";
    readonly sanLabel: string = "San";
    readonly staLabel: string = "Sta";

    //Player Stat input elements
    private _strElement: HTMLInputElement;
    private _dexElement: HTMLInputElement;
    private _conElement: HTMLInputElement;
    private _intElement: HTMLInputElement;
    private _wisElement: HTMLInputElement;
    private _chaElement: HTMLInputElement;

    readonly strLabel: string = "Str";
    readonly dexLabel: string = "Dex";
    readonly conLabel: string = "Con";
    readonly intLabel: string = "Int";
    readonly wisLabel: string = "Wis";
    readonly chaLabel: string = "Cha";

    //Used to add bonus or subtract penalty to action roll if one is performed
    private _actionModElement: HTMLInputElement;
    readonly actionModLabel: string = "Modifier";

    //Action selection element
    private _actionSelectElement: HTMLSelectElement;
    readonly actionSelectLabel: string = "Action";

    //Target selection element
    private _targetSelectElement: HTMLSelectElement;
    readonly targetSelectLabel: string = "Target";

    readonly player: Player;



    constructor(parentElement: HTMLDivElement, id: string, allPlayerIds: string[]) {

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


        return
    }



    /*
     * Functions for creating HTML elements that are needed
     */

    private _createSelect(name: string, options: string[]): HTMLSelectElement {

        let select: HTMLSelectElement = document.createElement('select');
        select.setAttribute('name', name+this.playerId);

        options.forEach((option) => {
            select.appendChild(this._createOption(option));
        });

         return select;
    }

    private _createOption(option: string): HTMLOptionElement {

        let optionElement: HTMLOptionElement = document.createElement('option');
        optionElement.setAttribute('value', option);
        optionElement.innerText = option;

        return optionElement;
    }

    private _createLabel(forName: string): HTMLLabelElement {

        let label: HTMLLabelElement = document.createElement('label');
        label.setAttribute('for', forName+this.playerId);
        label.innerText = forName;

        return label;
    }

    private _createTextInput(name: string): HTMLInputElement {

        let textInput: HTMLInputElement = document.createElement('input');
        textInput.setAttribute('type', 'text');
        textInput.setAttribute('name', name + this.playerId);

        return textInput;
    }

    private _createNumberInput(name: string): HTMLInputElement {

        let numberInput: HTMLInputElement = document.createElement('input');
        numberInput.setAttribute('type', 'number');
        numberInput.setAttribute('name', name + this.playerId);

        return numberInput;
    }

    private _createContainerDiv(...classes: string[]): HTMLDivElement {
        let containerDiv: HTMLDivElement = document.createElement('div');

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

    private _populateElements(): void {
        this._populateNameElement();
        this._populateStatElements();
        this._populateVitalsElements();
        this._populateActionMod();
        this._populateActionElement();
        this._populateTargetElement();
    }

    private _populateNameElement(): void {
        this._playerNameElement = this._createTextInput(this.playerNameLabel);
        this._playerNameElement.value = "Player"+(+this.playerId+1);
    }

    private _populateVitalsElements(): void {
        this._hpElement = this._createNumberInput(this.hpLabel);
        this._sanElement = this._createNumberInput(this.sanLabel);
        this._staElement = this._createNumberInput(this.staLabel);

        this._hpElement.value = Player.STARTINGVITALS.hp + "";
        this._sanElement.value = Player.STARTINGVITALS.san + "";
        this._staElement.value = Player.STARTINGVITALS.sta + "";
    }

    private _populateStatElements(): void {
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

    private _populateActionMod(): void {
        this._actionModElement = this._createNumberInput(this.actionModLabel);

        this._actionModElement.value = Player.DEFAULTMODIFIER + "";
    }

    private _populateActionElement(): void {
        this._actionSelectElement = this._createSelect(this.actionSelectLabel, Object.keys(Action.PLAYERACTIONS));
    }

    private _populateTargetElement(): void {
        this._targetSelectElement = this._createSelect(this.targetSelectLabel, this.allPlayerIds);
    }



    /*
     * 
     * 
     */

    private _addHandlersToElements() {
        this._addPlayerInfoUpdateHandlerToElements();
        this._addPlayerActionUpdateHandlerToElements();
    }

    private _addPlayerInfoUpdateHandlerToElements() {
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

    private _addPlayerActionUpdateHandlerToElements() {
        this._actionModElement.addEventListener("change", () => { this.updatePlayerActionHandler() });
        this._actionSelectElement.addEventListener("change", () => { this.updatePlayerActionHandler() });
        this._targetSelectElement.addEventListener("change", () => { this.updatePlayerActionHandler() });
    }



    /*
     * Functions for adding the elements to the container element
     */

    private _addElementsToContainer(): void {
        this._addNameSection();
        this._addVitalsSection();
        this._addStatsSection();
        this._addActionSection();
    }

    private _addNameSection(): void {

        let nameSection = this._createContainerDiv("PlayerName", "Section");
        let nameInputCon = this._createContainerDiv("InputContainer");
        nameInputCon.appendChild(this._playerNameElement);
        nameSection.appendChild(nameInputCon);
        this._container.appendChild(nameSection);
    }

    private _addVitalsSection(): void {

        let vitalsection = this._createContainerDiv("PlayerVitals", "Section")

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

    private _addStatsSection(): void {

        let statSection = this._createContainerDiv("PlayerStats", "Section")

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

    private _addActionSection(): void {

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

    private updatePlayerDataHandler() {
        this.player.updatePlayer(this.getName(), this.getVitals(), this.getStats());
    }

    private updatePlayerActionHandler() {
        this.updatePlayerAction();
    }



    private initializePlayerData() {
        this.updatePlayerDataHandler();
        this.updatePlayerActionHandler();
    }

    private updatePlayerAction(): void {

        let mod: number = undefined;
        let action: actionKey = undefined;
        let target: number = undefined;


        mod = +this._actionModElement.value;

        if (this._actionSelectElement.selectedIndex != -1 && this._actionSelectElement.options.length > 0) {

            let selectedOption: HTMLOptionElement = this._actionSelectElement.options.item(this._actionSelectElement.selectedIndex);

            if (Action.isValidAction(selectedOption.value)) {
                action = selectedOption.value as actionKey;
            }
        }

        if (this._targetSelectElement.selectedIndex != -1 && this._targetSelectElement.options.length > 0) {

            let selectedOption: HTMLOptionElement = this._targetSelectElement.options.item(this._targetSelectElement.selectedIndex);
            target = +selectedOption.value;
        }


        if (mod !== undefined && action && target !== undefined) {
            this.player.updateAction(action, target, mod);
            //this.player.setAction(action, target, mod);
        }


        return;
    }

    public updateControlWithPlayerData(): void {

        this._playerNameElement.value = this.player.playerName;
        
        let vitals: vitals = this.player.vitals;
        this._hpElement.value = vitals.hp + "";
        this._sanElement.value = vitals.san + "";
        this._staElement.value = vitals.sta + "";

        let stats: stats = this.player.stats;
        this._strElement.value = stats.str + "";
        this._dexElement.value = stats.dex + "";
        this._conElement.value = stats.con + "";
        this._intElement.value = stats.int + "";
        this._wisElement.value = stats.wis + "";
        this._chaElement.value = stats.cha + "";

    }

    public getName(): string {
        return this._playerNameElement.value;
    }

    public getNameTag(): string {
        return "[" + this.playerId + "] " + this._playerNameElement.value;
    }

    public getVitals(): vitals {
       return {
            hp: +this._hpElement.value,
            san: +this._sanElement.value,
            sta: +this._staElement.value
        };
    }

    public getStats(): stats {
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