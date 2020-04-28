export class Game {
    public isStarted: number;
    public name: string;
    public hasAdmin: number;
    public hasPassword: number;
    public hasGamePowerUp: number;
    public gameCounter: number;
    public gameTicks: number;
    public creatorId: number;
    public iccuphost: string;
    public slotfslg: number;
    public maxPlayers: number;
    public playersCount: number;
    public players: Player[] = [];
}

export class Player {
    public color: number;
    public name: string;
    public realm: string;
    public comment: string;
}