

export type comparator = (a: any, b: any) => boolean;
export type actionKey = "attack" | "hide" | "move" | "search" | "rest" | "wait";
export type actions = { [action in actionKey]: string; };
export type statKey = "str" | "dex" | "con" | "int" | "wis" | "cha";
export type stats = { [stat in statKey]: number; };
export type vitalKey = "hp" | "san" | "sta";
export type vitals = { [vital in vitalKey]: number; };
export type roll = { value: number; success: boolean, crit: boolean; }

