import { Action } from './Actions.js';
let Player = /** @class */ (() => {
    class Player {
        constructor(playerId, playerName, stats) {
            this.playerId = playerId;
            this.playerName = playerName;
            this.stats = stats;
            this.vitals = Player.STARTINGVITALS;
            return;
        }
        takeDmg(damage) {
            this.vitals.hp = (this.vitals.hp - damage <= 0) ? 0 : this.vitals.hp - damage;
        }
        getNameTag() {
            return "[" + this.playerId + "] " + this.playerName;
        }
        setAction() {
            if (Action.isValidAction(this.actionKey)) {
                this.action = Action.buildAction(this);
            }
            else {
                this.action = undefined;
            }
            return this.action;
        }
        setTarget(target) {
            this.target = target;
        }
        updateAction(action, targetId, modifier) {
            this.actionKey = action;
            this.targetId = targetId;
            this.modifier = modifier;
        }
        /**
         * This is for testing, needs to be removed/changed for production
         */
        updatePlayer(name, vitals, stats) {
            this.playerName = name;
            this.vitals = vitals;
            this.stats = stats;
        }
    }
    Player.STARTINGVITALS = {
        hp: 100,
        san: 70,
        sta: 50
    };
    Player.DEFAULTSTATS = {
        str: 13,
        dex: 13,
        con: 12,
        int: 12,
        wis: 11,
        cha: 11
    };
    Player.DEFAULTMODIFIER = 0;
    return Player;
})();
export { Player };
//# sourceMappingURL=Player.js.map