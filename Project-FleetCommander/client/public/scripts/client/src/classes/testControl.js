export class testControl {
    constructor(input, output, handler) {
        this.setChangeEventHandler(handler);
        this.setInputElement(input);
        this.setOutputElement(output);
        return;
    }
    _defaultChangeEventHandler() {
        //console.log(["Input", this._inputElement]);
        //console.log(["Output", this._outputElement]);
        if (this._inputElement && this._outputElement && this._inputElement.selectedIndex != -1 && this._inputElement.options.length > 0) {
            let selectedOption = this._inputElement.options.item(this._inputElement.selectedIndex);
            this._outputElement.innerHTML = selectedOption.value;
        }
        return;
    }
    _attachChangeEventHandler() {
        if (this._inputElement && this._changeEventHandler) {
            this._inputElement.addEventListener("change", this._changeEventHandler);
        }
    }
    _detachChangeEventHandler() {
        if (this._inputElement && this._changeEventHandler) {
            this._inputElement.removeEventListener("change", this._changeEventHandler);
        }
    }
    setInputElement(element, handler) {
        this._detachChangeEventHandler();
        this._inputElement = element;
        this.setChangeEventHandler(handler);
    }
    setOutputElement(element) {
        this._outputElement = element;
    }
    setChangeEventHandler(handler) {
        this._detachChangeEventHandler();
        if (handler) {
            this._changeEventHandler = handler;
        }
        else {
            this._changeEventHandler = () => {
                this._defaultChangeEventHandler();
            };
        }
        this._attachChangeEventHandler();
    }
}
//# sourceMappingURL=testControl.js.map