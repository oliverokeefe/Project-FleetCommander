//Board
//Player
//Ship
//Scoreboard
//Delta
export class GameModel {
    constructor(socket) {
    }
    /**
     *
     * @param data data for connecting to a game, probably just game name (and or pswd)
     */
    connect(data) {
        // Set up inital connection with server
        // Puts player in game lobby?
        return;
    }
    ready() {
        // handler for the ready button in lobby?, signaling the player is ready to start
        return;
    }
    start() {
        // Called once all players are connected and prepared to play the game
        // Resets all inital states and round counters etc...
        return;
    }
    update(data) {
        // call to update the game with data
        // should end up being the handler for game updates
        return;
    }
    clearGame() {
        // Remove and delete HTML elements from document. Clean up any other data
        // maybe send message to server to clean it up as well
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
//# sourceMappingURL=GameModel.js.map