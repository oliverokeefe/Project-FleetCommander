"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
class Player {
    constructor(id, name) {
        this.id = (id) ? id : "spectator";
        this.name = (name) ? name : this.id;
        this.score = 0;
        this.territory = undefined;
        this.ships = [];
        this.ready = false;
    }
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map