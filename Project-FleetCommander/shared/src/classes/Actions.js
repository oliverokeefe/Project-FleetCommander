"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wait = exports.Rest = exports.Search = exports.Move = exports.Hide = exports.Attack = exports.Action = void 0;
let Action = /** @class */ (() => {
    class Action {
        constructor(owner) {
            this.actionType = "";
            this.owner = owner;
            this.interupted = false;
        }
        static comparator(a, b) {
            return a._priority < b._priority;
        }
        static isValidAction(action) {
            return Action.PLAYERACTIONS.hasOwnProperty(action);
        }
        static buildAction(owner) {
            let action = undefined;
            if (Action.isValidAction(owner.actionKey)) {
                switch (owner.actionKey) {
                    case (Action.PLAYERACTIONS.attack):
                        action = new Attack(owner);
                        break;
                    case (Action.PLAYERACTIONS.hide):
                        action = new Hide(owner);
                        break;
                    case (Action.PLAYERACTIONS.move):
                        action = new Move(owner);
                        break;
                    case (Action.PLAYERACTIONS.search):
                        action = new Search(owner);
                        break;
                    case (Action.PLAYERACTIONS.rest):
                        action = new Rest(owner);
                        break;
                    case (Action.PLAYERACTIONS.wait):
                        action = new Wait(owner);
                        break;
                    default:
                        break;
                }
            }
            return action;
        }
        resolve() {
            return `+${this.owner.getNameTag()}:: ${this.actionType} <br/>`;
        }
        attackResponse() {
            return "";
        }
    }
    Action.PLAYERACTIONS = {
        attack: "attack",
        hide: "hide",
        move: "move",
        search: "search",
        rest: "rest",
        wait: "wait"
    };
    return Action;
})();
exports.Action = Action;
class Attack extends Action {
    constructor(owner) {
        super(owner);
        this.target = owner.target;
        this.actionType = Action.PLAYERACTIONS.attack;
        this._priority = 1;
    }
    resolve() {
        let log = "";
        log += super.resolve();
        log += `++Begin Action<br/>`;
        log += this.target.action.attackResponse();
        log += `++++${this.owner.playerName} attack role<br/>`;
        log += `++++${this.owner.playerName} damage role<br/>`;
        log += `++++${this.target.playerName} take damage<br/>`;
        log += `++End Action<br/>`;
        return log;
    }
}
exports.Attack = Attack;
class Hide extends Action {
    constructor(owner) {
        super(owner);
        this.actionType = Action.PLAYERACTIONS.hide;
        this._priority = 2;
    }
    attackResponse() {
        return `+++${this.owner.playerName} hiding attack response<br/>`;
        ;
    }
}
exports.Hide = Hide;
class Move extends Action {
    constructor(owner) {
        super(owner);
        this.actionType = Action.PLAYERACTIONS.move;
        this._priority = 3;
    }
    attackResponse() {
        return `+++${this.owner.playerName} moving attack response<br/>`;
    }
}
exports.Move = Move;
class Search extends Action {
    constructor(owner) {
        super(owner);
        this.actionType = Action.PLAYERACTIONS.search;
        this._priority = 4;
    }
}
exports.Search = Search;
class Rest extends Action {
    constructor(owner) {
        super(owner);
        this.actionType = Action.PLAYERACTIONS.rest;
        this._priority = 5;
    }
}
exports.Rest = Rest;
class Wait extends Action {
    constructor(owner) {
        super(owner);
        this.actionType = Action.PLAYERACTIONS.wait;
        this._priority = 6;
    }
}
exports.Wait = Wait;
//# sourceMappingURL=Actions.js.map