import { coordinate } from "../types/types";

export interface ShipData {
    playerId: string;
    shipId: string;
    shipClass: string;
    position: coordinate;
}

export interface SpawnDelta {
    ship: ShipData;
    spawn: coordinate;
}

export interface MoveDelta {
    ship: ShipData;
    to: coordinate;
}

export interface FollowDelta {
    follower: ShipData;
    target: ShipData;
}

export interface SupplyDelta {
    ship: ShipData;
    supply: number;
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
    supply: SupplyDelta[];
    scores: ScoreDelta[];
    movePhase: string;
}

export interface InitialGameState {
    ships: ShipData[]; //The initial position is treated as the ships spawn
    scores: ScoreDelta[];
    movePhase: string;
    board: string; // Currently unimplemented
}








