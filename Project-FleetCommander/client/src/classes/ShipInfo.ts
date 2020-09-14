
import { socket, Game } from './MainModel.js';
import * as Delta from '../../../shared/src/classes/GameDelta.js';
import { Ship } from './Ships.js';


export class ShipInfo {


    public displayElement: HTMLDivElement;
    public PlayerId: HTMLDivElement;
    public ShipId: HTMLDivElement;
    public ShipClass: HTMLDivElement;
    public ShipSupply: HTMLDivElement;
    public ShipFrom: HTMLDivElement;
    public ShipTo: HTMLDivElement;

    constructor() {

        this.displayElement = document.getElementById("ShipInfo") as HTMLDivElement;
        this.PlayerId = document.getElementById("PlayerId") as HTMLDivElement;
        this.ShipId = document.getElementById("ShipId") as HTMLDivElement;
        this.ShipClass = document.getElementById("ShipClass") as HTMLDivElement;
        this.ShipSupply = document.getElementById("ShipSupply") as HTMLDivElement;
        this.ShipFrom = document.getElementById("ShipFrom") as HTMLDivElement;
        this.ShipTo = document.getElementById("ShipTo") as HTMLDivElement;
        

        this.setUpSocket();
        this.addEventHandlers();
        return;
    }

    public setUpSocket(): void {
        return;
    }

    public addEventHandlers(): void {
        return;
    }

    public update(ship: Ship): void {

        this.PlayerId.innerText = `Player ID: ${ship.playerId}`;
        this.ShipId.innerText = `Ship ID: ${ship.id}`;
        this.ShipClass.innerText = `Ship Class: ${ship.shipClass}`;
        this.ShipSupply.innerText = `Supply: ${ship.supply}`;
        this.ShipFrom.innerText = (ship.position) ? `From: ${ship.position.rowcol}` : `From: `;
        this.ShipTo.innerText = (ship.shadow.position) ? `To: ${ship.shadow.position.rowcol}` : `To: `;

        this.displayElement.classList.remove("nodisp");
        return;
    }
}




