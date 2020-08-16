/*
 *
 * Keep track of player resources (ships, points)
 *
 * SENDS turn updates to server
 *
 */
export class PlayerData {
    constructor(name) {
        this.name = name;
        this.score = 0;
        this.territory = undefined;
        this.ships = [];
    }
    ready() {
        //singal player to the server the player is ready
        // This may include submiting any moves that have been made
        return;
    }
    setUpSocket(socket) {
        // adds the handlers to the socket for the events that occur during the game
        // the handlers will be functions of this GameData class.
        return;
    }
    clearSocket(socket) {
        // Remove all event handlers that were added in the setUpSocket function
        return;
    }
}
//# sourceMappingURL=PlayerData.js.map