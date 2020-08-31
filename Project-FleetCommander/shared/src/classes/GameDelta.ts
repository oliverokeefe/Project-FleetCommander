import { coordinate } from "../types/types";


export interface SpawnDelta {
    playerId: string;
    shipId: string;
    on: coordinate;
}

export interface MoveDelta {
    playerId: string;
    shipId: string;
    from: coordinate;
    to: coordinate;
}

export interface DestroyedDelta {
    playerId: string;
    shipId: string;
}

export interface ScoreDelta {
    playerId: string;
    score: number;
}

export interface FromClientDelta {
    spawnAttempts: SpawnDelta[];
    moveAttempts: MoveDelta[];
}

export interface ToClientDelta {
    spawns: SpawnDelta[];
    moves: MoveDelta[];
    destroyed: DestroyedDelta[];
    scores: ScoreDelta[];
    movePhase: string;
}









