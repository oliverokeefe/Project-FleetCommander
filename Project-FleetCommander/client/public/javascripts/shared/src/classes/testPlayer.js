import { testAction } from './testAction.js';
export class testPlayer {
    constructor(parentElement, playerName) {
        this.parent = parentElement;
        this.name = playerName;
        this.parent.classList.add("PlayerControl");
        this._container = document.createElement("div");
        this._container.classList.add("PlayerContainer");
        this._container.appendChild(this._createLabel());
        this._container.appendChild(this._createSelect());
        this.parent.appendChild(this._container);
        return;
    }
    _createLabel() {
        let label = document.createElement('label');
        label.classList.add("PlayerLabel");
        label.setAttribute('for', this.name);
        label.innerText = this.name;
        return label;
    }
    _createSelect() {
        let select = document.createElement('select');
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
    _createOption(action) {
        let option = document.createElement('option');
        option.setAttribute('value', action);
        option.innerText = action;
        return option;
    }
    _setSelectedAction() {
        if (this._selectElement && this._selectElement.selectedIndex != -1 && this._selectElement.options.length > 0) {
            let selectedOption = this._selectElement.options.item(this._selectElement.selectedIndex);
            if (testAction.isValidAction(selectedOption.value)) {
                this._selectedAction = new testAction(selectedOption.value, this.name);
            }
            else {
                this._selectedAction = undefined;
            }
        }
        return;
    }
    getSelectedAction() {
        return this._selectedAction;
    }
}
//# sourceMappingURL=testPlayer.js.map