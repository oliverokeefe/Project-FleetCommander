"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dice = void 0;
class Dice {
    static _roll() {
        return {
            value: this._rollPercentDice(),
            success: undefined,
            crit: undefined
        };
    }
    static _rollPercentDice() {
        return Math.floor(Math.random() * 100) + 1;
    }
    static _isCrit(value) {
        let valueStr = value.toString();
        return (valueStr.length === 2 && valueStr[0] === valueStr[1]) || (value === 1) || (value === 100);
    }
    static _isSuccess(value, successPercent) {
        return (value != 100 && value <= successPercent);
    }
    static roll(successPercent, modifier) {
        let roll = this._roll();
        roll.success = this._isSuccess(roll.value + modifier, successPercent);
        roll.crit = this._isCrit(roll.value);
        return roll;
    }
}
exports.Dice = Dice;
//# sourceMappingURL=Dice.js.map