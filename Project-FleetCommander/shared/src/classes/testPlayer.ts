
import type { actionKey } from '../types/types';
import { testAction } from './testAction.js';

export class testPlayer {

    readonly parent: HTMLDivElement;
    readonly name: string;

    private _container: HTMLDivElement;
    private _selectElement: HTMLSelectElement;
    private _changeEventHandler: EventListener;
    private _selectedAction: testAction;


    constructor(parentElement: HTMLDivElement, playerName: string) {
        this.parent = parentElement;
        this.name = playerName;

        this.parent.classList.add("PlayerControl");

        this._container = document.createElement("div");
        this._container.classList.add("PlayerContainer");

        this._container.appendChild(this._createLabel());
        this._container.appendChild(this._createSelect());

        this.parent.appendChild(this._container);

        return
    }


    private _createLabel(): HTMLLabelElement {

        let label: HTMLLabelElement = document.createElement('label');
        label.classList.add("PlayerLabel");
        label.setAttribute('for', this.name);
        label.innerText = this.name;

        return label;
    }

    private _createSelect(): HTMLSelectElement {

        let select: HTMLSelectElement = document.createElement('select');
        select.setAttribute('name', this.name);

        testAction.playerActions.forEach((action) => {
            select.appendChild(this._createOption(action));
        });

        this._selectElement = select;
        this._changeEventHandler = () => { this._setSelectedAction(); };
        this._selectElement.addEventListener("change", this._changeEventHandler);
        this._setSelectedAction();

        return select;
    }

    private _createOption(action: string): HTMLOptionElement {

        let option: HTMLOptionElement = document.createElement('option');
        option.setAttribute('value', action);
        option.innerText = action;

        return option;
    }

    private _setSelectedAction(): void {

        if (this._selectElement && this._selectElement.selectedIndex != -1 && this._selectElement.options.length > 0) {

            let selectedOption: HTMLOptionElement = this._selectElement.options.item(this._selectElement.selectedIndex);

            if (testAction.isValidAction(selectedOption.value)) {
                this._selectedAction = new testAction(selectedOption.value as actionKey, this.name);
            } else {
                this._selectedAction = undefined;
            }
        }
        return
    }

    public getSelectedAction(): testAction {
        return this._selectedAction;
    }
}