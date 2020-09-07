"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const Ships_1 = require("./Ships");
class Player {
    constructor(id, territory, name) {
        this.id = id;
        this.name = (name) ? name : this.id;
        this.score = 0;
        this.setTerritory(territory);
        this.connected = false;
        this.ready = false;
        this.actions = undefined;
        this.updateData = undefined;
    }
    setReady(readyState) {
        this.ready = readyState;
        return;
    }
    setTerritory(territory) {
        if (territory) {
            this.territory = territory;
            this.territory.player = this.id;
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
    incrementalUpdate() {
        //calculate move incremetaly
        //if moves finished
        //Do these
        //BC's
        //points
        //spawn
        //clear the this.actions
        return;
    }
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map