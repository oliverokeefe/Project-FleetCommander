
import { roll } from '../types/types';



export class Dice {

    private static _roll(): roll {
        return {
            value: this._rollPercentDice(),
            success: undefined,
            crit: undefined
        };
    }

    private static _rollPercentDice(): number {
        return Math.floor(Math.random() * 100) + 1;
    }

    private static _isCrit(value: number): boolean {
        let valueStr: string = value.toString();
        return (valueStr.length === 2 && valueStr[0] === valueStr[1]) || (value === 1) || (value === 100);
    }

    private static _isSuccess(value: number, successPercent: number): boolean {
        return (value != 100 && value <= successPercent)
    }

    public static roll(successPercent: number, modifier: number): roll {

        let roll: roll = this._roll();

        roll.success = this._isSuccess(roll.value+modifier, successPercent);

        roll.crit = this._isCrit(roll.value);

        return roll;
    }

}





