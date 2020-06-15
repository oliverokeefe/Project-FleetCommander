



export class testData {

    private _players: any[];


    constructor() {

    }

    public addPlayer(player): number {
        return this._players.push(player) - 1;
    }

    public removePlayer(playerIndex: number): number {
        let newPlayers = [];
        this._players.forEach((player, index) => { if (playerIndex != index) { newPlayers.push(player) } });
        this._players = newPlayers;
        return this._players.length;
    }
}



