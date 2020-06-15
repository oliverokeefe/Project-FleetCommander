
import type { actionKey, stats, vitals } from '../types/types';
import { PlayerControl } from '../../../client/src/classes/devPlayerControl.js';
import { Action } from './Actions.js';

export class Player {

    static readonly STARTINGVITALS: vitals = {
        hp: 100,
        san: 70,
        sta: 50
    };
    static readonly DEFAULTSTATS: stats = {
        str: 13,
        dex: 13,
        con: 12,
        int: 12,
        wis: 11,
        cha: 11
    };
    static readonly DEFAULTMODIFIER: number = 0;


    public readonly playerId: string;

    //Below properties need to have their access modifiers properly set for production
    //Currently they are public for ease of development
    public playerName: string;
    public vitals: vitals;
    public stats: stats;
    public action: Action;
    public actionKey: actionKey
    public modifier: number;
    public targetId: number;
    public target: Player;



    constructor(playerId: string, playerName: string, stats: stats) {

        this.playerId = playerId;
        this.playerName = playerName;
        this.stats = stats;
        this.vitals = Player.STARTINGVITALS;

        return
    }

    public takeDmg(damage: number) {
        this.vitals.hp = (this.vitals.hp - damage <= 0) ? 0 : this.vitals.hp - damage;
    }

    public getNameTag(): string {
        return "[" + this.playerId + "] " + this.playerName;
    }

    public setAction(): Action {

        if (Action.isValidAction(this.actionKey)) {
            this.action = Action.buildAction(this);
        } else {
            this.action = undefined;
        }

        return this.action;
    }

    public setTarget(target: Player): void {
        this.target = target;
    }

    public updateAction(action: actionKey, targetId: number, modifier: number) {
        this.actionKey = action;
        this.targetId = targetId;
        this.modifier = modifier;
    }

    /**
     * This is for testing, needs to be removed/changed for production
     */
    public updatePlayer(name: string, vitals: vitals, stats: stats): void {
        this.playerName = name;
        this.vitals = vitals;
        this.stats = stats;
    }

}



