
import { socket, Game } from './MainModel.js';
import * as Delta from '../../../shared/src/classes/GameDelta.js';
import { Ship } from './Ships.js';


export class Scoreboard {


    public displayElement: HTMLDivElement;
    public MovePhase: HTMLDivElement;
    public scores: { [playerId: string]: HTMLDivElement};
    // public Player1Score: HTMLDivElement;
    // public Player2Score: HTMLDivElement;
    // public Player3Score: HTMLDivElement;
    // public Player4Score: HTMLDivElement;
    public SubmitMoveBtn: HTMLButtonElement;

    constructor() {

        this.displayElement = document.getElementById("Scoreboard") as HTMLDivElement;
        this.MovePhase = document.getElementById("MovePhase") as HTMLDivElement;
        this.scores = {};
        this.scores.Player1 = document.getElementById("Player1Score") as HTMLDivElement;
        this.scores.Player2 = document.getElementById("Player2Score") as HTMLDivElement;
        this.scores.Player3 = document.getElementById("Player3Score") as HTMLDivElement;
        this.scores.Player4 = document.getElementById("Player4Score") as HTMLDivElement;
        this.SubmitMoveBtn = document.getElementById("SubmitMoveBtn") as HTMLButtonElement;

        this.setUpSocket();
        this.addEventHandlers();
        return;
    }

    public init(): void {
        let scores: Delta.ScoreDelta[];
        scores = [
            {playerId: "Player1", score: 0},
            {playerId: "Player2", score: 0},
            {playerId: "Player3", score: 0},
            {playerId: "Player4", score: 0},
        ];
        this.update(scores, Ship.SHIPCLASSES.PAWN);
        return;
    }

    public start(scores: Delta.ScoreDelta[], movePhase: string): void {
        this.update(scores, movePhase);
        this.displayElement.classList.remove("nodisp");
    }

    public setUpSocket(): void {
        return;
    }

    public addEventHandlers(): void {
        this.SubmitMoveBtn.addEventListener('click', () => { this.submitMoveBtnHandler() });
        return;
    }

    public submitMoveBtnHandler(): void {
        console.log("submit move button clicked");
        this.SubmitMoveBtn.disabled = true;
        let data: Delta.FromClientDelta = Game.buildUpdateDelta();
        socket.emit('submitActions', data);
        return;
    }

    public update(scores: Delta.ScoreDelta[], movePhase: string): void {

        scores.forEach((score: Delta.ScoreDelta) => {
            this.setScore(score.playerId, score.score);
        });

        this.setMovePhase(movePhase);

        return;
    }

    public setScore(playerId: string, score: number): string {
        this.scores[playerId].innerText = `${playerId}: ${score}`;
        return;
    }

    public setMovePhase(phase: string): string {
        this.MovePhase.innerText = `Move Phase: ${phase}`;
        Game.movePhase = phase;
        return;
    }

}




