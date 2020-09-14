export class ShipInfo {
    constructor() {
        this.displayElement = document.getElementById("ShipInfo");
        this.PlayerId = document.getElementById("PlayerId");
        this.ShipId = document.getElementById("ShipId");
        this.ShipClass = document.getElementById("ShipClass");
        this.ShipSupply = document.getElementById("ShipSupply");
        this.ShipFrom = document.getElementById("ShipFrom");
        this.ShipTo = document.getElementById("ShipTo");
        this.setUpSocket();
        this.addEventHandlers();
        return;
    }
    setUpSocket() {
        return;
    }
    addEventHandlers() {
        return;
    }
    update(ship) {
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
//# sourceMappingURL=ShipInfo.js.map