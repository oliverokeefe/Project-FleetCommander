import * as Delta from './GameDelta.js';

/**
 * Interface defines Client to Server Events
 */
export interface ClientToServerEvents {
    joinLobby: (game: string) => void;
    chat: (message: string) => void;
    ready: () => void;
    submitActions: (data: Delta.FromClientDelta) => void;
    leaveGame: () => void;
    disconnect: () => void;
}

/**
 * Interface defines Server to Client Events
 */
export interface ServerToClientEvents {
    // noArg: () => void;
    // basicEmit: (a: number, b: string, c: Buffer) => void;
    // withAck: (d: string, callback: (e: number) => void) => void;  
    joinLobby: (game: string) => void;
    createPlayer: (player: string) => void;
    updateChat: (chatLog: string[]) => void;
    joinGameAsSpectator: (game: string, player: string, GameBoard: any) => void; //GameBoard is currently of type board... which is a server only definition. Fix this after implementing spectator
    chat: (message: string) => void;
    start: (startGameData: Delta.InitialGameState) => void;
    update: (update: Delta.ToClientDelta) => void;
}

/**
 * Unused for now
 */
export interface InterServerEvents {
    ping: () => void;  
}

/**
 * Inerface defines values a player socket
 */
export interface SocketData {
    game: string;
    player: string;  
}

