import { Game } from './MainModel.js';
import { Ship } from './Ships.js';
export class Scoreboard {
    constructor() {
        this.displayElement = document.getElementById("Scoreboard");
        this.MovePhase = document.getElementById("MovePhase");
        this.scores = {};
        this.scores.Player1 = document.getElementById("Player1Score");
        this.scores.Player2 = document.getElementById("Player2Score");
        this.scores.Player3 = document.getElementById("Player3Score");
        this.scores.Player4 = document.getElementById("Player4Score");
        this.SubmitMoveBtn = document.getElementById("SubmitMoveBtn");
        this.setUpSocket();
        this.addEventHandlers();
        return;
    }
    init() {
        let scores;
        scores = [
            { playerId: "Player1", score: 0 },
            { playerId: "Player2", score: 0 },
            { playerId: "Player3", score: 0 },
            { playerId: "Player4", score: 0 },
        ];
        this.update(scores, Ship.SHIPCLASSES.PAWN);
        return;
    }
    start(scores, movePhase) {
        this.update(scores, movePhase);
        this.displayElement.classList.remove("nodisp");
    }
    setUpSocket() {
        return;
    }
    addEventHandlers() {
        this.SubmitMoveBtn.addEventListener('click', () => { this.submitMoveBtnHandler(); });
        return;
    }
    submitMoveBtnHandler() {
        console.log("submit move button clicked");
        return;
    }
    update(scores, movePhase) {
        scores.forEach((score) => {
            this.setScore(score.playerId, score.score);
        });
        this.setMovePhase(movePhase);
        return;
    }
    setScore(playerId, score) {
        this.scores[playerId].innerText = `${playerId}: ${score}`;
        return;
    }
    setMovePhase(phase) {
        this.MovePhase.innerText = `Move Phase: ${phase}`;
        Game.movePhase = phase;
        return;
    }
}
//# sourceMappingURL=Scoreboard copy.js.map