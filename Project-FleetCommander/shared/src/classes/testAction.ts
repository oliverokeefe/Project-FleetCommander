
import type { actionKey } from '../types/types';

export class testAction {

    static readonly playerActions: string[] = ["attack", "defend", "move", "follow", "rest", "wait"];

    readonly owner: string;
    readonly mod: number;
    readonly action: string;
    readonly target: number;

    private _priority: number;

    constructor(action: actionKey, owner: string) {
        this.owner = owner;
        this.action = action;

        this._setPriorityFromAction();
    }

    private _setPriorityFromAction() {

        switch (this.action) {
            case ("attack"):
                this._priority = 1;
                break;
            case("defend"):
                this._priority = 2;
                break;
            case("move"):
                this._priority = 3;
                break;
            case("follow"):
                this._priority = 4;
                break;
            case("rest"):
                this._priority = 5;
                break;
            case("wait"):
                this._priority = 6;
                break;
            default:
                this._priority = 1000;
                break;
        }
    }


    public static comparator(a: testAction, b: testAction): boolean {

        return a._priority < b._priority;

    }

    public static isValidAction(action: string): boolean {

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





