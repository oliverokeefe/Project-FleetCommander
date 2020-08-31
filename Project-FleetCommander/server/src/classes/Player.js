"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const Ships_1 = require("./Ships");
class Player {
    constructor(id, name) {
        this.id = (id) ? id : "spectator";
        this.name = (name) ? name : this.id;
        this.score = 0;
        this.territory = undefined;
        this.ready = false;
    }
    setReady(readyState) {
        this.ready = readyState;
        return;
    }
    setTerritory(territory) {
        if (territory) {
            this.territory = territory;
            this.fleet = new Ships_1.Fleet(this.territory);
        }
        else {
            this.territory = undefined;
        }
        return;
    }
    clear() {
        this.fleet.clear();
        this.territory = undefined;
        this.score = 0;
        this.ready = false;
        return;
    }
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map