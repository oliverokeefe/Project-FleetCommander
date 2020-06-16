let testAction = /** @class */ (() => {
    class testAction {
        constructor(action, owner) {
            this.owner = owner;
            this.action = action;
            this._setPriorityFromAction();
        }
        _setPriorityFromAction() {
            switch (this.action) {
                case ("attack"):
                    this._priority = 1;
                    break;
                case ("defend"):
                    this._priority = 2;
                    break;
                case ("move"):
                    this._priority = 3;
                    break;
                case ("follow"):
                    this._priority = 4;
                    break;
                case ("rest"):
                    this._priority = 5;
                    break;
                case ("wait"):
                    this._priority = 6;
                    break;
                default:
                    this._priority = 1000;
                    break;
            }
        }
        static comparator(a, b) {
            return a._priority < b._priority;
        }
        static isValidAction(action) {
            let isValid = false;
            switch (action) {
                case ("attack"):
                case ("defend"):
                case ("move"):
                case ("follow"):
                case ("rest"):
                case ("wait"):
                    isValid = true;
                    break;
                default:
                    isValid = false;
                    break;
            }
            return isValid;
        }
    }
    testAction.playerActions = ["attack", "defend", "move", "follow", "rest", "wait"];
    return testAction;
})();
export { testAction };
//# sourceMappingURL=testAction.js.map