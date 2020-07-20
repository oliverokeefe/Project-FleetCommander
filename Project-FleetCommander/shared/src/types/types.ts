import { Tile } from "../classes/GameBoard";


export type comparator = (a: any, b: any) => boolean;
export type actionKey = "attack" | "hide" | "move" | "search" | "rest" | "wait";
export type actions = { [action in actionKey]: string; };
export type statKey = "str" | "dex" | "con" | "int" | "wis" | "cha";
export type stats = { [stat in statKey]: number; };
export type vitalKey = "hp" | "san" | "sta";
export type vitals = { [vital in vitalKey]: number; };
export type roll = { value: number; success: boolean, crit: boolean; };

export type joinData = { game: string, player: string };
export type gameList = { [game: string]: game };
export type game = {
    name: string
    chatLog: string[],
    playerList: playerList,
    playerCount: number
};
export type playerList = { [player: string]: string };
export type coordinate = [number, number];
export type board = Array<Array<Tile>>;


